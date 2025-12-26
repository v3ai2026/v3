#!/bin/bash

# 前端快速部署脚本
# Quick Frontend Deployment Script

set -e

echo "🚀 Vision PaaS 前端部署脚本"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js 版本: $(node -v)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm 版本: $(npm -v)"
echo ""

# 选择部署模式
echo "请选择部署模式:"
echo "1) Docker 部署 (推荐)"
echo "2) 构建静态文件"
echo "3) 完整部署 (前端 + 后端)"
read -p "选择 [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "🐳 Docker 部署模式"
        echo "--------------------------------"
        
        # 检查 Docker
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker 未安装${NC}"
            echo "请先安装 Docker: https://docs.docker.com/get-docker/"
            exit 1
        fi
        
        echo -e "${GREEN}✓${NC} Docker 版本: $(docker -v)"
        
        # 构建前端镜像
        echo ""
        echo "📦 构建前端 Docker 镜像..."
        docker build -f Dockerfile.frontend -t vision-frontend:latest .
        
        # 运行容器
        echo ""
        echo "🚀 启动前端容器..."
        docker stop vision-frontend 2>/dev/null || true
        docker rm vision-frontend 2>/dev/null || true
        docker run -d \
            --name vision-frontend \
            -p 80:80 \
            --restart unless-stopped \
            vision-frontend:latest
        
        echo ""
        echo -e "${GREEN}✅ 前端部署成功！${NC}"
        echo "🌐 访问: http://localhost"
        ;;
        
    2)
        echo ""
        echo "📦 构建静态文件模式"
        echo "--------------------------------"
        
        # 安装依赖
        echo "📥 安装依赖..."
        npm install --legacy-peer-deps
        
        # 构建
        echo ""
        echo "🔨 构建生产版本..."
        npm run build
        
        echo ""
        echo -e "${GREEN}✅ 构建完成！${NC}"
        echo "📁 构建文件位于: ./dist/"
        echo ""
        echo "📤 部署到服务器:"
        echo "  方法 1: scp -r dist/* user@server:/var/www/vision-paas/"
        echo "  方法 2: rsync -avz dist/ user@server:/var/www/vision-paas/"
        echo ""
        echo "📋 Nginx 配置示例:"
        echo "  查看: FRONTEND_DEPLOYMENT.md"
        ;;
        
    3)
        echo ""
        echo "🎯 完整部署模式 (前端 + 后端)"
        echo "--------------------------------"
        
        # 检查 Docker Compose
        if ! command -v docker-compose &> /dev/null; then
            echo -e "${RED}❌ Docker Compose 未安装${NC}"
            echo "请先安装 Docker Compose"
            exit 1
        fi
        
        echo -e "${GREEN}✓${NC} Docker Compose 已安装"
        
        # 进入 server 目录
        cd server
        
        # 停止旧容器
        echo ""
        echo "🛑 停止旧容器..."
        docker-compose down 2>/dev/null || true
        
        # 启动所有服务
        echo ""
        echo "🚀 启动所有服务..."
        docker-compose up -d
        
        # 等待服务启动
        echo ""
        echo "⏳ 等待服务启动..."
        sleep 10
        
        # 检查服务状态
        echo ""
        echo "📊 服务状态:"
        docker-compose ps
        
        echo ""
        echo -e "${GREEN}✅ 完整部署成功！${NC}"
        echo ""
        echo "🌐 服务访问地址:"
        echo "  前端: http://localhost"
        echo "  API网关: http://localhost:8080"
        echo "  认证服务: http://localhost:8081"
        echo "  部署服务: http://localhost:8083"
        echo ""
        echo "📊 查看日志:"
        echo "  docker-compose logs -f frontend"
        echo "  docker-compose logs -f blade-gateway"
        ;;
        
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "🎉 部署完成！"
echo ""
echo "📚 更多信息:"
echo "  - 部署文档: FRONTEND_DEPLOYMENT.md"
echo "  - 后端文档: server/README.md"
echo "  - 快速开始: server/QUICKSTART.md"
echo ""
