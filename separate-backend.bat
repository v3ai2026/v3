@echo off
REM 后端代码分离自动化脚本 (Backend Separation Script for Windows)

setlocal enabledelayedexpansion

echo ================================================
echo 后端代码分离脚本 (Backend Separation Script)
echo ================================================
echo.

REM 检查 server 目录
if not exist "server" (
    echo 错误: 未找到 server 目录
    echo 请在 vision- 仓库的根目录运行此脚本
    pause
    exit /b 1
)

REM 获取用户输入
echo 请提供以下信息:
echo.
set /p BACKEND_REPO_URL="新后端仓库的 GitHub URL (例如: https://github.com/v3ai2026/vision-backend.git): "
echo.
set /p TEMP_DIR="临时目录路径 (默认: C:\Temp\vision-backend): "
if "%TEMP_DIR%"=="" set TEMP_DIR=C:\Temp\vision-backend
echo.

REM 确认
echo 即将执行以下操作:
echo 1. 创建临时目录: %TEMP_DIR%
echo 2. 复制后端代码到临时目录
echo 3. 初始化新的 Git 仓库
echo 4. 提交并推送到: %BACKEND_REPO_URL%
echo.
set /p CONFIRM="是否继续? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo 已取消操作
    pause
    exit /b 0
)

REM 步骤 1: 创建临时目录
echo.
echo ================================================
echo 步骤 1/5: 创建临时目录
echo ================================================

if exist "%TEMP_DIR%" (
    echo 警告: 目录 %TEMP_DIR% 已存在
    set /p DELETE="是否删除并重新创建? (y/n): "
    if /i "!DELETE!"=="y" (
        rmdir /s /q "%TEMP_DIR%"
        echo 已删除旧目录
    ) else (
        echo 已取消操作
        pause
        exit /b 1
    )
)

mkdir "%TEMP_DIR%"
cd /d "%TEMP_DIR%"
git init
echo 临时目录创建完成
cd /d "%~dp0"

REM 步骤 2: 复制后端代码
echo.
echo ================================================
echo 步骤 2/5: 复制后端代码
echo ================================================

echo 复制微服务...
for %%s in (blade-gateway blade-auth vision-user vision-deploy vision-project vision-payment vision-monitor vision-database vision-proxy) do (
    if exist "server\%%s" (
        xcopy /E /I /Q "server\%%s" "%TEMP_DIR%\%%s" >nul
        echo   - %%s
    )
)

echo 复制通用模块...
for %%c in (vision-common blade-common) do (
    if exist "server\%%c" (
        xcopy /E /I /Q "server\%%c" "%TEMP_DIR%\%%c" >nul
        echo   - %%c
    )
)

echo 复制配置文件...
if exist "server\pom.xml" copy /Y "server\pom.xml" "%TEMP_DIR%\" >nul && echo   - pom.xml
if exist "server\docker-compose.yml" copy /Y "server\docker-compose.yml" "%TEMP_DIR%\" >nul && echo   - docker-compose.yml
if exist "server\.env.example" copy /Y "server\.env.example" "%TEMP_DIR%\" >nul && echo   - .env.example

echo 复制文档...
for %%d in (README.md ARCHITECTURE.md QUICKSTART.md IMPLEMENTATION_SUMMARY.md RAILWAY_DEPLOYMENT.md) do (
    if exist "server\%%d" (
        copy /Y "server\%%d" "%TEMP_DIR%\" >nul
        echo   - %%d
    )
)

echo 后端代码复制完成

REM 步骤 3: 创建 .gitignore
echo.
echo ================================================
echo 步骤 3/5: 创建 .gitignore
echo ================================================

(
echo # Maven
echo target/
echo pom.xml.tag
echo pom.xml.releaseBackup
echo pom.xml.versionsBackup
echo.
echo # IDE
echo .idea/
echo *.iml
echo .vscode/
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo *.log
echo.
echo # Environment
echo .env
echo .env.local
) > "%TEMP_DIR%\.gitignore"

echo .gitignore 创建完成

REM 步骤 4: 创建 GitHub Actions
echo.
echo ================================================
echo 步骤 4/5: 创建 GitHub Actions 工作流
echo ================================================

mkdir "%TEMP_DIR%\.github\workflows" 2>nul

(
echo name: Railway Backend Deploy
echo.
echo on:
echo   push:
echo     branches:
echo       - main
echo       - master
echo.
echo jobs:
echo   deploy-backend:
echo     name: Deploy Backend Services
echo     runs-on: ubuntu-latest
echo     strategy:
echo       matrix:
echo         service:
echo           - blade-gateway
echo           - blade-auth
echo           - vision-user
echo           - vision-deploy
echo           - vision-project
echo           - vision-payment
echo     steps:
echo       - name: Checkout code
echo         uses: actions/checkout@v4
echo       - name: Install Railway CLI
echo         run: npm install -g @railway/cli
echo       - name: Deploy $^{{ matrix.service ^}}
echo         run: ^|
echo           cd $^{{ matrix.service ^}}
echo           railway up --service $^{{ matrix.service ^}}
echo         env:
echo           RAILWAY_TOKEN: $^{{ secrets.RAILWAY_TOKEN ^}}
) > "%TEMP_DIR%\.github\workflows\railway-deploy.yml"

echo GitHub Actions 工作流创建完成

REM 步骤 5: 提交并推送
echo.
echo ================================================
echo 步骤 5/5: 提交并推送到新仓库
echo ================================================

cd /d "%TEMP_DIR%"

git add .
git commit -m "Initial commit: Backend microservices from vision- repository"
git remote add origin "%BACKEND_REPO_URL%"

echo.
echo 正在推送到远程仓库...
git push -u origin main
if errorlevel 1 (
    echo 尝试推送到 master 分支...
    git branch -M master
    git push -u origin master
)

REM 完成
echo.
echo ================================================
echo 后端代码分离完成！
echo ================================================
echo.
echo 新后端仓库位置: %BACKEND_REPO_URL%
echo 临时目录位置: %TEMP_DIR%
echo.
echo 下一步:
echo 1. 访问 %BACKEND_REPO_URL% 验证代码
echo 2. 在 Railway 创建新项目并连接后端仓库
echo 3. 从前端仓库删除 server 目录
echo.
echo 详见: BACKEND_SEPARATION_GUIDE.md

pause
