# Railway 自动部署配置文档 (Automatic Deployment Configuration)

本文档说明如何配置 Railway 平台的自动部署功能，使得代码推送到 GitHub 后自动部署到 Railway。

## 📋 概述 (Overview)

此配置实现了：
- ✅ 自动检测代码变更
- ✅ 自动构建前端和后端服务
- ✅ 自动部署到 Railway
- ✅ 支持多服务并行部署
- ✅ 失败自动重试
- ✅ GitHub Actions 集成

## 🏗️ 配置文件结构 (Configuration Files)

### 1. Railway 配置文件 (Railway Configuration)

每个服务都有独立的 `railway.json` 配置文件：

```
.
├── railway.json                          # 前端配置
├── railway-template.yml                  # 一键部署模板
└── server/
    ├── blade-gateway/railway.json        # API Gateway
    ├── blade-auth/railway.json           # 认证服务
    ├── vision-user/railway.json          # 用户管理
    ├── vision-deploy/railway.json        # 部署引擎
    ├── vision-project/railway.json       # 项目管理
    └── vision-payment/railway.json       # 支付服务
```

### 2. GitHub Actions 工作流 (GitHub Actions Workflow)

```
.github/workflows/railway-deploy.yml      # 自动部署工作流
```

## 🚀 设置自动部署 (Setup Automatic Deployment)

### 方法 1: Railway 原生自动部署 (推荐)

Railway 原生支持 GitHub 集成，这是最简单的方法：

#### 步骤：

1. **连接 GitHub 仓库**
   - 登录 Railway (https://railway.app)
   - 创建新项目
   - 选择 "Deploy from GitHub repo"
   - 授权 Railway 访问你的 GitHub 仓库
   - 选择 `v3ai2026/vision-` 仓库

2. **配置前端服务**
   - Service Name: `frontend`
   - Root Directory: `/` (根目录)
   - 分支: `main` 或 `master`
   - Railway 会自动检测 `nixpacks.toml` 和 `railway.json`

3. **配置后端服务** (对每个服务重复)
   - 点击 "New Service" → "GitHub Repo" (选择同一仓库)
   - Service Name: `blade-gateway`, `blade-auth`, `vision-user`, 等
   - Root Directory: `server/blade-gateway`, `server/blade-auth`, 等
   - 分支: `main` 或 `master`

4. **配置自动部署触发器**
   - Railway 默认会在以下情况自动部署：
     - 代码推送到配置的分支
     - PR 合并到配置的分支
     - 手动触发部署

5. **设置环境变量**
   - 在每个服务的 Settings → Variables 中设置：
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   DB_USERNAME=postgres
   DB_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
   PORT=${{RAILWAY_PUBLIC_PORT}}
   ```

### 方法 2: GitHub Actions 自动部署

使用 GitHub Actions 实现更精细的控制：

#### 步骤：

1. **获取 Railway Token**
   - 登录 Railway
   - 进入 Account Settings → Tokens
   - 创建新的 API Token
   - 复制 Token

2. **设置 GitHub Secret**
   - 进入 GitHub 仓库 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - Name: `RAILWAY_TOKEN`
   - Value: 粘贴 Railway Token
   - 点击 "Add secret"

3. **在 Railway 创建服务**
   - 按照方法 1 的步骤 1-3 创建所有服务
   - 不需要配置自动部署，因为 GitHub Actions 会处理

4. **推送代码触发部署**
   - 工作流会在以下情况自动运行：
     - 推送到 `main`, `master`, 或 `production` 分支
     - PR 合并到这些分支
   
   ```bash
   git add .
   git commit -m "Update code"
   git push origin main
   ```

5. **监控部署进度**
   - GitHub: Actions 标签页查看工作流状态
   - Railway: Dashboard 查看服务部署状态

### 方法 3: 使用 Railway Template 一键部署

使用 `railway-template.yml` 文件实现一键部署所有服务：

#### 步骤：

1. **安装 Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **登录 Railway**
   ```bash
   railway login
   ```

3. **使用模板部署**
   ```bash
   railway init --template railway-template.yml
   railway up
   ```

## 🔄 自动部署工作流程 (Automatic Deployment Workflow)

### Railway 原生自动部署流程：

```
代码推送到 GitHub
    ↓
Railway 检测到变更
    ↓
自动触发构建
    ↓
执行 nixpacks.toml 中的构建步骤
    ↓
构建完成
    ↓
自动部署新版本
    ↓
健康检查
    ↓
切换流量到新版本
    ↓
部署完成 ✅
```

### GitHub Actions 部署流程：

```
代码推送到 GitHub
    ↓
触发 GitHub Actions 工作流
    ↓
并行部署前端和所有后端服务
    ↓
    ├─ Frontend → Railway
    ├─ blade-gateway → Railway
    ├─ blade-auth → Railway
    ├─ vision-user → Railway
    ├─ vision-deploy → Railway
    ├─ vision-project → Railway
    └─ vision-payment → Railway
    ↓
所有服务部署完成
    ↓
发送通知 ✅
```

## 📊 监控和日志 (Monitoring and Logs)

### Railway Dashboard
- 访问: https://railway.app/dashboard
- 查看实时部署状态
- 查看服务日志
- 查看资源使用情况

### GitHub Actions
- 访问: `https://github.com/v3ai2026/vision-/actions`
- 查看工作流运行历史
- 查看详细构建日志
- 查看部署状态

## 🔧 配置说明 (Configuration Details)

### railway.json 文件结构

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",           // 使用 Nixpacks 构建器
    "nixpacksPath": "nixpacks.toml"  // Nixpacks 配置文件路径
  },
  "deploy": {
    "numReplicas": 1,                // 副本数量
    "restartPolicyType": "ON_FAILURE", // 失败时重启
    "restartPolicyMaxRetries": 10    // 最大重试次数
  }
}
```

### nixpacks.toml 文件结构

**前端 (Frontend):**
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci --legacy-peer-deps"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npx serve -s dist -p $PORT"
```

**后端 (Backend):**
```toml
[phases.setup]
nixPkgs = ["maven", "jdk17"]

[phases.install]
cmds = ["cd ../vision-common && mvn clean install -DskipTests"]

[phases.build]
cmds = ["mvn clean package -DskipTests"]

[start]
cmd = "java -Dserver.port=$PORT -jar target/*.jar"
```

## 🎯 环境变量配置 (Environment Variables)

### 自动设置的变量 (Auto-set Variables)
- `PORT` - Railway 自动分配的端口
- `RAILWAY_PUBLIC_PORT` - 公开访问端口
- `RAILWAY_ENVIRONMENT` - 环境名称 (production/staging)

### 需要手动设置的变量 (Manual Variables)

**所有后端服务:**
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_USERNAME=postgres
DB_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
```

**blade-auth (额外):**
```bash
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
```

**vision-payment (额外):**
```bash
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🐛 故障排查 (Troubleshooting)

### 部署失败

**问题**: 构建失败
**解决方案**:
1. 检查 Railway 日志: Dashboard → Service → Logs
2. 验证 `nixpacks.toml` 配置正确
3. 确保所有依赖项都已声明

**问题**: 服务启动失败
**解决方案**:
1. 检查环境变量是否正确设置
2. 验证数据库连接配置
3. 查看服务日志中的错误信息

### GitHub Actions 失败

**问题**: `RAILWAY_TOKEN` 未设置
**解决方案**:
- 在 GitHub 仓库设置中添加 `RAILWAY_TOKEN` secret

**问题**: Railway CLI 命令失败
**解决方案**:
- 确保 Railway Token 有效
- 确保服务名称与 Railway 中的服务名称匹配

### 自动部署未触发

**问题**: 代码推送后没有自动部署
**解决方案**:
1. **Railway 原生**: 检查仓库是否正确连接
2. **GitHub Actions**: 检查工作流是否启用
3. 验证分支名称是否匹配 (main/master/production)

## 📝 最佳实践 (Best Practices)

### 1. 使用分支策略
```
main/master → 生产环境 (Production)
staging → 预发布环境 (Staging)
develop → 开发环境 (Development)
```

### 2. 环境隔离
- 为每个环境创建独立的 Railway 项目
- 使用不同的数据库实例
- 设置环境特定的环境变量

### 3. 监控和告警
- 启用 Railway 的性能监控
- 配置错误告警
- 定期检查日志

### 4. 回滚策略
- Railway 支持一键回滚到之前的部署
- 保持至少最近 3 个部署版本

### 5. 安全性
- 不要在代码中硬编码密钥
- 使用环境变量存储敏感信息
- 定期轮换 API Token

## 🎉 验证部署成功 (Verify Deployment)

### 检查清单:

- [ ] 前端可以通过 Railway URL 访问
- [ ] API Gateway 响应正常
- [ ] 所有后端服务状态为 "Active"
- [ ] 数据库连接成功
- [ ] 日志中没有错误信息
- [ ] GitHub Actions 工作流显示绿色 ✅

### 测试命令:

```bash
# 测试前端
curl https://your-frontend.railway.app

# 测试 API Gateway
curl https://your-gateway.railway.app/actuator/health

# 测试认证服务
curl https://your-auth.railway.app/actuator/health
```

## 📚 相关文档 (Related Documentation)

- [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md) - 完整部署指南
- [Railway 官方文档](https://docs.railway.app)
- [Nixpacks 文档](https://nixpacks.com)
- [GitHub Actions 文档](https://docs.github.com/actions)

## 🆘 获取帮助 (Get Help)

如遇到问题:
1. 查看 Railway Dashboard 中的日志
2. 查看 GitHub Actions 运行日志
3. 检查环境变量配置
4. 参考故障排查章节

---

**注意**: 自动部署配置完成后，每次推送代码到配置的分支都会自动触发部署。请确保代码经过充分测试后再推送到生产分支。

**更新时间**: 2025-12-26
