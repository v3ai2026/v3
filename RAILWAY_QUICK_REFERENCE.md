# Railway 部署快速参考 (Quick Reference)

## 🚀 一键部署 (One-Click Deploy)

### 方法 1: 使用自动脚本

**Linux/Mac:**
```bash
./railway-deploy.sh
```

**Windows:**
```cmd
railway-deploy.bat
```

### 方法 2: Railway CLI 手动部署

```bash
# 1. 安装 CLI
npm install -g @railway/cli

# 2. 登录
railway login

# 3. 部署前端
railway up --service frontend

# 4. 部署后端服务
cd server/blade-gateway && railway up --service blade-gateway
cd server/blade-auth && railway up --service blade-auth
cd server/vision-user && railway up --service vision-user
cd server/vision-deploy && railway up --service vision-deploy
cd server/vision-project && railway up --service vision-project
cd server/vision-payment && railway up --service vision-payment
```

### 方法 3: GitHub Actions 自动部署

1. 在 GitHub 仓库设置中添加 Secret: `RAILWAY_TOKEN`
2. 推送代码到 `main` 分支
3. GitHub Actions 自动部署所有服务

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

## 📋 配置文件清单

- [x] `nixpacks.toml` - 前端构建配置
- [x] `railway.json` - 前端 Railway 配置
- [x] `server/*/nixpacks.toml` - 后端构建配置 (6个服务)
- [x] `server/*/railway.json` - 后端 Railway 配置 (6个服务)
- [x] `.github/workflows/railway-deploy.yml` - GitHub Actions 工作流
- [x] `railway-template.yml` - 一键部署模板

## 🔧 必需环境变量

### 所有后端服务:
```bash
PORT=${{RAILWAY_PUBLIC_PORT}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_USERNAME=postgres
DB_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
```

### blade-auth (额外):
```bash
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
```

### vision-payment (额外):
```bash
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📊 服务列表

| 服务 | Root Directory | 端口 | 说明 |
|------|---------------|------|------|
| frontend | `/` | - | React + Vite 前端 |
| blade-gateway | `server/blade-gateway` | 8080 | API 网关 |
| blade-auth | `server/blade-auth` | 8081 | 认证服务 |
| vision-user | `server/vision-user` | 8082 | 用户管理 |
| vision-deploy | `server/vision-deploy` | 8083 | 部署引擎 |
| vision-project | `server/vision-project` | 8084 | 项目管理 |
| vision-payment | `server/vision-payment` | 8085 | 支付服务 |

## 🐛 常见问题

**Q: 构建失败?**
A: 检查 Railway 日志，确保 `nixpacks.toml` 配置正确

**Q: 服务无法启动?**
A: 验证环境变量设置，特别是 `DATABASE_URL`

**Q: GitHub Actions 失败?**
A: 确保设置了 `RAILWAY_TOKEN` secret

**Q: 自动部署未触发?**
A: 检查分支名称是否为 `main`, `master`, 或 `production`

## 📚 详细文档

- 📖 [完整部署指南](./RAILWAY_DEPLOYMENT_GUIDE.md)
- 🤖 [自动部署配置](./RAILWAY_AUTO_DEPLOY.md)
- 🔨 [故障排查](./RAILWAY_AUTO_DEPLOY.md#-故障排查-troubleshooting)

## ✅ 验证部署

```bash
# 测试前端
curl https://your-frontend.railway.app

# 测试后端
curl https://your-gateway.railway.app/actuator/health
```

## 🎯 成功标准

- ✅ 所有服务显示 "Active" 状态
- ✅ 前端可访问
- ✅ API 响应正常
- ✅ 数据库连接成功
- ✅ 日志无错误

---

**更新时间**: 2025-12-26
