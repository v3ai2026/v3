@echo off
REM Railway 自动部署脚本 (Windows) - Railway Auto Deploy Script for Windows
REM 此脚本帮助快速部署所有服务到 Railway

echo ============================================
echo Railway 自动部署脚本 (Windows)
echo ============================================
echo.

REM 检查 Railway CLI 是否安装
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Railway CLI 未安装
    echo 正在安装 Railway CLI...
    call npm install -g @railway/cli
    echo Railway CLI 安装完成
) else (
    echo Railway CLI 已安装
)

echo.
echo 请确保已完成以下步骤:
echo 1. 在 Railway 创建项目
echo 2. 连接 GitHub 仓库
echo 3. 为每个服务创建 Railway Service
echo.
set /p continue="是否继续? (y/n): "
if /i not "%continue%"=="y" (
    echo 已取消部署
    exit /b 0
)

echo.
echo 检查 Railway 登录状态...
railway whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 请登录 Railway...
    railway login
)

echo.
echo 已登录 Railway
echo.

REM 定义服务列表
set "services=frontend blade-gateway blade-auth vision-user vision-deploy vision-project vision-payment"
set "failed_services="

REM 部署每个服务
for %%s in (%services%) do (
    echo ================================================
    echo 部署服务: %%s
    echo ================================================
    
    if "%%s"=="frontend" (
        REM 部署前端
        railway up --service %%s
        if %ERRORLEVEL% NEQ 0 (
            echo %%s 部署失败
            set "failed_services=!failed_services! %%s"
        ) else (
            echo %%s 部署成功
        )
    ) else (
        REM 部署后端服务
        cd server\%%s
        railway up --service %%s
        if %ERRORLEVEL% NEQ 0 (
            echo %%s 部署失败
            set "failed_services=!failed_services! %%s"
        ) else (
            echo %%s 部署成功
        )
        cd ..\..
    )
    
    echo.
)

REM 显示部署结果
echo ================================================
echo 部署完成!
echo ================================================
echo.

if "%failed_services%"=="" (
    echo 所有服务部署成功!
    echo.
    echo 下一步:
    echo 1. 访问 Railway Dashboard 查看服务状态
    echo 2. 配置环境变量 (DATABASE_URL, etc.^)
    echo 3. 测试应用程序
) else (
    echo 以下服务部署失败:
    echo %failed_services%
    echo.
    echo 请检查错误信息并重试
    exit /b 1
)

pause
