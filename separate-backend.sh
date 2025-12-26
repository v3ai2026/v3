#!/bin/bash

# 后端代码分离自动化脚本 (Backend Separation Automation Script)
# 此脚本帮助将后端代码从当前仓库分离到新仓库

set -e

echo "================================================"
echo "后端代码分离脚本 (Backend Separation Script)"
echo "================================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -d "server" ]; then
    echo -e "${RED}错误: 未找到 server 目录${NC}"
    echo "请在 vision- 仓库的根目录运行此脚本"
    exit 1
fi

# 获取用户输入
echo "请提供以下信息:"
echo ""
read -p "新后端仓库的 GitHub URL (例如: https://github.com/v3ai2026/vision-backend.git): " BACKEND_REPO_URL
echo ""
read -p "临时目录路径 (默认: /tmp/vision-backend): " TEMP_DIR
TEMP_DIR=${TEMP_DIR:-/tmp/vision-backend}
echo ""

# 确认
echo -e "${YELLOW}即将执行以下操作:${NC}"
echo "1. 创建临时目录: $TEMP_DIR"
echo "2. 复制后端代码到临时目录"
echo "3. 初始化新的 Git 仓库"
echo "4. 提交并推送到: $BACKEND_REPO_URL"
echo ""
read -p "是否继续? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消操作"
    exit 0
fi

# 步骤 1: 创建临时目录
echo ""
echo "================================================"
echo "步骤 1/5: 创建临时目录"
echo "================================================"

if [ -d "$TEMP_DIR" ]; then
    echo -e "${YELLOW}警告: 目录 $TEMP_DIR 已存在${NC}"
    read -p "是否删除并重新创建? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$TEMP_DIR"
        echo "已删除旧目录"
    else
        echo "已取消操作"
        exit 1
    fi
fi

mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"
git init
echo -e "${GREEN}✓ 临时目录创建完成${NC}"

# 步骤 2: 复制后端代码
echo ""
echo "================================================"
echo "步骤 2/5: 复制后端代码"
echo "================================================"

# 返回到原始目录
cd - > /dev/null

# 复制服务目录
echo "复制微服务..."
for service in blade-gateway blade-auth vision-user vision-deploy vision-project vision-payment vision-monitor vision-database vision-proxy; do
    if [ -d "server/$service" ]; then
        cp -r "server/$service" "$TEMP_DIR/"
        echo "  ✓ $service"
    fi
done

# 复制通用模块
echo "复制通用模块..."
for common in vision-common blade-common; do
    if [ -d "server/$common" ]; then
        cp -r "server/$common" "$TEMP_DIR/"
        echo "  ✓ $common"
    fi
done

# 复制配置文件
echo "复制配置文件..."
[ -f "server/pom.xml" ] && cp "server/pom.xml" "$TEMP_DIR/" && echo "  ✓ pom.xml"
[ -f "server/docker-compose.yml" ] && cp "server/docker-compose.yml" "$TEMP_DIR/" && echo "  ✓ docker-compose.yml"
[ -f "server/.gitignore" ] && cp "server/.gitignore" "$TEMP_DIR/" && echo "  ✓ .gitignore"
[ -f "server/.env.example" ] && cp "server/.env.example" "$TEMP_DIR/" && echo "  ✓ .env.example"

# 复制文档
echo "复制文档..."
for doc in README.md ARCHITECTURE.md QUICKSTART.md IMPLEMENTATION_SUMMARY.md RAILWAY_DEPLOYMENT.md; do
    if [ -f "server/$doc" ]; then
        cp "server/$doc" "$TEMP_DIR/"
        echo "  ✓ $doc"
    fi
done

echo -e "${GREEN}✓ 后端代码复制完成${NC}"

# 步骤 3: 创建 .gitignore
echo ""
echo "================================================"
echo "步骤 3/5: 创建 .gitignore"
echo "================================================"

cat > "$TEMP_DIR/.gitignore" << 'EOF'
# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# IDE
.idea/
*.iml
*.iws
*.ipr
.vscode/
.classpath
.project
.settings/

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Environment
.env
.env.local
.env.*.local

# Build
out/
build/
bin/

# Spring Boot
spring-shell.log
EOF

echo -e "${GREEN}✓ .gitignore 创建完成${NC}"

# 步骤 4: 创建 GitHub Actions 工作流
echo ""
echo "================================================"
echo "步骤 4/5: 创建 GitHub Actions 工作流"
echo "================================================"

mkdir -p "$TEMP_DIR/.github/workflows"

cat > "$TEMP_DIR/.github/workflows/railway-deploy.yml" << 'EOF'
name: Railway Backend Deploy

on:
  push:
    branches:
      - main
      - master
      - production

jobs:
  deploy-backend:
    name: Deploy Backend Services
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - blade-gateway
          - blade-auth
          - vision-user
          - vision-deploy
          - vision-project
          - vision-payment
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy ${{ matrix.service }}
        run: |
          cd ${{ matrix.service }}
          railway up --service ${{ matrix.service }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
EOF

echo -e "${GREEN}✓ GitHub Actions 工作流创建完成${NC}"

# 步骤 5: 提交并推送到新仓库
echo ""
echo "================================================"
echo "步骤 5/5: 提交并推送到新仓库"
echo "================================================"

cd "$TEMP_DIR"

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Backend microservices from vision- repository

- Add all backend services (blade-gateway, blade-auth, vision-user, etc.)
- Add Railway deployment configuration
- Add documentation
- Add GitHub Actions workflow
- Configure environment variables

Migrated from: https://github.com/v3ai2026/vision-"

# 添加远程仓库
git remote add origin "$BACKEND_REPO_URL"

# 推送到 GitHub
echo ""
echo "正在推送到远程仓库..."
if git push -u origin main; then
    echo -e "${GREEN}✓ 成功推送到新仓库${NC}"
else
    echo -e "${YELLOW}警告: 推送失败，可能是因为分支名称不是 'main'${NC}"
    echo "尝试推送到 'master' 分支..."
    git branch -M master
    git push -u origin master
fi

# 完成
echo ""
echo "================================================"
echo "后端代码分离完成！"
echo "================================================"
echo ""
echo -e "${GREEN}✓ 新后端仓库位置: $BACKEND_REPO_URL${NC}"
echo -e "${GREEN}✓ 临时目录位置: $TEMP_DIR${NC}"
echo ""
echo "下一步:"
echo "1. 访问 $BACKEND_REPO_URL 验证代码"
echo "2. 在 Railway 创建新项目并连接后端仓库"
echo "3. 为每个微服务配置 Railway Service"
echo "4. 从前端仓库删除 server 目录:"
echo "   cd $(pwd)"
echo "   git rm -r server/"
echo "   git commit -m 'Remove backend code - moved to separate repository'"
echo "   git push"
echo ""
echo "详见: BACKEND_SEPARATION_GUIDE.md"
