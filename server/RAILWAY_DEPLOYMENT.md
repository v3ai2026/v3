# 🚂 Railway 部署指南

## 快速部署到 Railway

Railway 是一个现代化的云平台，支持 Java 应用部署。

### 方式一：通过 Railway CLI

```bash
# 1. 安装 Railway CLI
npm i -g @railway/cli

# 2. 登录
railway login

# 3. 创建新项目
railway init

# 4. 部署
cd server/
railway up
```

### 方式二：通过 Railway Dashboard

1. 访问 https://railway.app
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的仓库
5. 配置环境变量（见下方）
6. 部署会自动开始

### 环境变量配置

在 Railway 项目设置中添加以下环境变量：

```
# 数据库配置
SUPABASE_DB_HOST=db.your-project.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-password

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=604800000

# Stripe 配置
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_yyy

# Nacos 配置（使用 Railway 内部服务）
NACOS_SERVER_ADDR=nacos.railway.internal:8848

# 前端地址
FRONTEND_URL=https://your-app.vercel.app
```

### 部署多个服务

Railway 支持 monorepo 部署。为每个服务创建独立的服务：

1. **blade-gateway** (端口 9999)
   - Root Directory: `server/blade-gateway`
   - Start Command: `cd server/blade-gateway && mvn spring-boot:run`

2. **blade-auth** (端口 8100)
   - Root Directory: `server/blade-auth`
   - Start Command: `cd server/blade-auth && mvn spring-boot:run`

3. **vision-user** (端口 8101)
   - Root Directory: `server/vision-user`
   - Start Command: `cd server/vision-user && mvn spring-boot:run`

4. **vision-project** (端口 8102)
   - Root Directory: `server/vision-project`
   - Start Command: `cd server/vision-project && mvn spring-boot:run`

5. **vision-payment** (端口 8103)
   - Root Directory: `server/vision-payment`
   - Start Command: `cd server/vision-payment && mvn spring-boot:run`

### Nacos 部署（可选）

如果需要在 Railway 部署 Nacos：

1. 创建新服务
2. 使用 Docker 镜像：`nacos/nacos-server:v2.3.0`
3. 设置环境变量：`MODE=standalone`
4. 端口：8848

### 重要提示

⚠️ **Railway 免费套餐限制**：
- 每月 $5 免费额度
- 500 小时运行时间
- 如果部署所有 6 个服务，可能会快速消耗额度

**建议方案**：
1. 仅部署 API Gateway (blade-gateway)
2. 其他服务在本地或使用 Docker Compose 部署
3. 或升级到 Railway Pro 计划

### 常见问题

**Q: 构建失败？**
A: 确保 `pom.xml` 配置正确，Maven 版本兼容

**Q: 服务无法访问？**
A: 检查防火墙规则和端口配置

**Q: 数据库连接失败？**
A: 确认 Supabase 允许 Railway 的 IP 地址访问

### 访问你的服务

部署成功后，Railway 会提供一个公开 URL：
```
https://your-project.railway.app
```

你可以通过这个 URL 访问 API Gateway，然后访问其他服务。

### 监控和日志

在 Railway Dashboard 中：
- 查看实时日志
- 监控资源使用
- 设置告警

---

**推荐替代方案**：
如果 Railway 成本较高，可以考虑：
- **Heroku** - 类似 Railway
- **Render** - 免费套餐更慷慨
- **Fly.io** - 适合微服务
- **阿里云/腾讯云** - 国内访问更快
