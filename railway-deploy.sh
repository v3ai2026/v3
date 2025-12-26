#!/bin/bash

# Railway 自动部署脚本 (Railway Auto Deploy Script)
# 此脚本帮助快速部署所有服务到 Railway

set -e

echo "🚀 Railway 自动部署脚本"
echo "========================"
echo ""

# 检查 Railway CLI 是否安装
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI 未安装"
    echo "正在安装 Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI 安装完成"
else
    echo "✅ Railway CLI 已安装"
fi

echo ""
echo "请确保已完成以下步骤:"
echo "1. 在 Railway 创建项目"
echo "2. 连接 GitHub 仓库"
echo "3. 为每个服务创建 Railway Service"
echo ""
read -p "是否继续? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消部署"
    exit 0
fi

# 登录 Railway (如果需要)
echo ""
echo "检查 Railway 登录状态..."
if ! railway whoami &> /dev/null; then
    echo "请登录 Railway..."
    railway login
fi

echo ""
echo "✅ 已登录 Railway"
echo ""

# 部署服务
SERVICES=("frontend" "blade-gateway" "blade-auth" "vision-user" "vision-deploy" "vision-project" "vision-payment")
FAILED_SERVICES=()

for service in "${SERVICES[@]}"; do
    echo "================================================"
    echo "部署服务: $service"
    echo "================================================"
    
    if [ "$service" = "frontend" ]; then
        # 部署前端
        if railway up --service "$service"; then
            echo "✅ $service 部署成功"
        else
            echo "❌ $service 部署失败"
            FAILED_SERVICES+=("$service")
        fi
    else
        # 部署后端服务
        cd "server/$service" || continue
        if railway up --service "$service"; then
            echo "✅ $service 部署成功"
        else
            echo "❌ $service 部署失败"
            FAILED_SERVICES+=("$service")
        fi
        cd ../.. || exit
    fi
    
    echo ""
done

# 显示部署结果
echo "================================================"
echo "部署完成!"
echo "================================================"
echo ""

if [ ${#FAILED_SERVICES[@]} -eq 0 ]; then
    echo "🎉 所有服务部署成功!"
    echo ""
    echo "下一步:"
    echo "1. 访问 Railway Dashboard 查看服务状态"
    echo "2. 配置环境变量 (DATABASE_URL, etc.)"
    echo "3. 测试应用程序"
else
    echo "⚠️  以下服务部署失败:"
    for service in "${FAILED_SERVICES[@]}"; do
        echo "  - $service"
    done
    echo ""
    echo "请检查错误信息并重试"
    exit 1
fi
