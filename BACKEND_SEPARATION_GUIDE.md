# 后端分离到新仓库指南 (Backend Repository Separation Guide)

## 📋 概述 (Overview)

本文档说明如何将后端代码（`server/` 目录）从当前前端仓库分离到独立的后端仓库。

## 🎯 目标架构 (Target Architecture)

### 当前架构 (Current):
```
vision- (单一仓库)
├── frontend files (React + Vite)
└── server/ (Java Spring Boot 后端)
    ├── blade-gateway/
    ├── blade-auth/
    ├── vision-user/
    ├── vision-deploy/
    ├── vision-project/
    └── vision-payment/
```

### 目标架构 (Target):
```
vision-frontend (前端仓库)
├── React + Vite files
├── nixpacks.toml
├── railway.json
└── 前端配置文件

vision-backend (新的后端仓库)
├── blade-gateway/
├── blade-auth/
├── vision-user/
├── vision-deploy/
├── vision-project/
├── vision-payment/
├── vision-common/
├── blade-common/
├── pom.xml
└── 后端配置文件
```

## 🚀 步骤 1: 创建新的后端仓库 (Create New Backend Repository)

### 在 GitHub 上创建新仓库:

1. 访问 https://github.com/new
2. 仓库名称: `vision-backend`
3. 描述: "Vision Commerce Platform - Backend Services (Java Spring Boot Microservices)"
4. 选择 Private/Public
5. 不要添加 README, .gitignore, license (我们会从现有代码迁移)
6. 点击 "Create repository"

### 初始化新仓库:

```bash
# 创建临时目录
mkdir -p /tmp/vision-backend
cd /tmp/vision-backend

# 初始化 Git 仓库
git init
```

## 🚀 步骤 2: 复制后端代码到新仓库 (Copy Backend Code)

### 从当前仓库复制文件:

```bash
# 假设当前仓库在 ~/vision-
cd ~/vision-

# 复制整个 server 目录到新仓库
cp -r server/* /tmp/vision-backend/

# 复制后端相关的配置文件
cp server/.gitignore /tmp/vision-backend/.gitignore 2>/dev/null || true
cp server/.env.example /tmp/vision-backend/.env.example 2>/dev/null || true
```

### 需要复制的文件清单:

**核心代码目录:**
- ✅ `server/blade-gateway/`
- ✅ `server/blade-auth/`
- ✅ `server/vision-user/`
- ✅ `server/vision-deploy/`
- ✅ `server/vision-project/`
- ✅ `server/vision-payment/`
- ✅ `server/vision-monitor/`
- ✅ `server/vision-database/`
- ✅ `server/vision-proxy/`
- ✅ `server/vision-common/`
- ✅ `server/blade-common/`

**配置文件:**
- ✅ `server/pom.xml` (根 POM 文件)
- ✅ `server/docker-compose.yml`
- ✅ `server/.gitignore`
- ✅ `server/.env.example`

**文档文件:**
- ✅ `server/README.md`
- ✅ `server/ARCHITECTURE.md`
- ✅ `server/QUICKSTART.md`
- ✅ `server/IMPLEMENTATION_SUMMARY.md`
- ✅ `server/RAILWAY_DEPLOYMENT.md`

**Railway 配置:**
- ✅ `server/blade-gateway/nixpacks.toml` + `railway.json`
- ✅ `server/blade-auth/nixpacks.toml` + `railway.json`
- ✅ `server/vision-user/nixpacks.toml` + `railway.json`
- ✅ `server/vision-deploy/nixpacks.toml` + `railway.json`
- ✅ `server/vision-project/nixpacks.toml` + `railway.json`
- ✅ `server/vision-payment/nixpacks.toml` + `railway.json`

## 🚀 步骤 3: 创建后端仓库的 README (Create Backend README)

在新仓库创建 `README.md`:

```bash
cd /tmp/vision-backend
cat > README.md << 'EOF'
# Vision Commerce Platform - Backend Services

## 概述 (Overview)

Vision Commerce 平台的后端微服务系统，基于 Java Spring Boot 构建。

## 架构 (Architecture)

### 微服务列表:
- **blade-gateway** (8080) - API 网关
- **blade-auth** (8081) - 认证服务
- **vision-user** (8082) - 用户管理
- **vision-deploy** (8083) - 部署引擎
- **vision-project** (8084) - 项目管理
- **vision-payment** (8085) - 支付服务
- **vision-monitor** (8086) - 监控服务
- **vision-database** (8088) - 数据库服务
- **vision-proxy** (8087) - 代理服务

## 快速开始 (Quick Start)

### 前置要求:
- Java 17+
- Maven 3.6+
- PostgreSQL 15+

### 本地开发:

\`\`\`bash
# 1. 克隆仓库
git clone https://github.com/v3ai2026/vision-backend.git
cd vision-backend

# 2. 构建通用模块
cd vision-common
mvn clean install -DskipTests

# 3. 启动数据库
docker-compose up -d postgres

# 4. 启动服务
cd ../blade-gateway
mvn spring-boot:run
\`\`\`

## Railway 部署 (Railway Deployment)

每个服务都配置了独立的 Railway 部署:

\`\`\`bash
# 使用 Railway CLI
railway up --service blade-gateway
railway up --service blade-auth
railway up --service vision-user
# ... 其他服务
\`\`\`

详见: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## 环境变量 (Environment Variables)

\`\`\`bash
PORT=8080
DATABASE_URL=postgresql://user:password@host:5432/vision_paas
DB_USERNAME=postgres
DB_PASSWORD=your_password
\`\`\`

## 技术栈 (Tech Stack)

- Java 17
- Spring Boot 2.7+
- Spring Cloud Gateway
- PostgreSQL
- Maven
- Docker

## 文档 (Documentation)

- [架构说明](./ARCHITECTURE.md)
- [快速开始](./QUICKSTART.md)
- [Railway 部署](./RAILWAY_DEPLOYMENT.md)

## License

MIT License - see LICENSE file for details
EOF
```

## 🚀 步骤 4: 创建后端的 .gitignore (Create Backend .gitignore)

```bash
cd /tmp/vision-backend
cat > .gitignore << 'EOF'
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
```

## 🚀 步骤 5: 创建后端的 GitHub Actions 工作流 (Create Backend GitHub Actions)

```bash
mkdir -p /tmp/vision-backend/.github/workflows
cd /tmp/vision-backend/.github/workflows

cat > railway-deploy-backend.yml << 'EOF'
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
```

## 🚀 步骤 6: 提交后端代码到新仓库 (Commit Backend Code)

```bash
cd /tmp/vision-backend

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Backend microservices from vision- repository

- Add all backend services (blade-gateway, blade-auth, vision-user, etc.)
- Add Railway deployment configuration
- Add documentation
- Add GitHub Actions workflow
- Configure environment variables"

# 添加远程仓库
git remote add origin https://github.com/v3ai2026/vision-backend.git

# 推送到 GitHub
git push -u origin main
```

## 🚀 步骤 7: 更新前端仓库 (Update Frontend Repository)

### 从前端仓库删除后端代码:

```bash
cd ~/vision-

# 创建新分支
git checkout -b separate-backend

# 删除 server 目录
git rm -r server/

# 提交
git commit -m "Remove backend code - moved to separate vision-backend repository

Backend services are now in: https://github.com/v3ai2026/vision-backend"

# 推送
git push origin separate-backend
```

### 更新前端 README.md:

在前端仓库的 README.md 中添加:

```markdown
## 后端服务 (Backend Services)

后端代码已迁移到独立仓库: [vision-backend](https://github.com/v3ai2026/vision-backend)

后端提供以下 API 服务:
- API Gateway: `https://gateway.railway.app`
- Authentication: `https://auth.railway.app`
- User Management: `https://user.railway.app`
- ...等
```

### 更新前端环境变量配置:

创建 `.env.example`:

```bash
# API Gateway URL (后端网关地址)
VITE_API_GATEWAY_URL=https://gateway.railway.app

# API Endpoints
VITE_AUTH_API_URL=https://auth.railway.app
VITE_USER_API_URL=https://user.railway.app
VITE_PROJECT_API_URL=https://project.railway.app
VITE_DEPLOY_API_URL=https://deploy.railway.app
VITE_PAYMENT_API_URL=https://payment.railway.app

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Other Services
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## 🚀 步骤 8: 配置 Railway 部署 (Configure Railway Deployment)

### 前端仓库 (vision-frontend):

1. 在 Railway 创建新项目 "vision-frontend"
2. 连接 GitHub 仓库: `v3ai2026/vision-`
3. Root Directory: `/`
4. 环境变量:
   ```
   VITE_API_GATEWAY_URL=https://your-gateway.railway.app
   ```

### 后端仓库 (vision-backend):

1. 在 Railway 创建新项目 "vision-backend"
2. 连接 GitHub 仓库: `v3ai2026/vision-backend`
3. 为每个服务创建 Railway Service:
   - Service: `blade-gateway`, Root Directory: `blade-gateway`
   - Service: `blade-auth`, Root Directory: `blade-auth`
   - Service: `vision-user`, Root Directory: `vision-user`
   - ... 等等
4. 添加 PostgreSQL 数据库
5. 配置环境变量 (DATABASE_URL, etc.)

## 📊 迁移清单 (Migration Checklist)

### 后端仓库设置:
- [ ] 在 GitHub 创建 `vision-backend` 仓库
- [ ] 复制所有后端代码和配置
- [ ] 创建 README.md
- [ ] 创建 .gitignore
- [ ] 创建 GitHub Actions 工作流
- [ ] 提交并推送代码

### 前端仓库更新:
- [ ] 删除 `server/` 目录
- [ ] 更新 README.md 说明后端分离
- [ ] 更新 .env.example 添加后端 API 地址
- [ ] 提交并推送更改

### Railway 配置:
- [ ] 创建前端 Railway 项目
- [ ] 创建后端 Railway 项目
- [ ] 配置前端服务
- [ ] 配置所有后端服务
- [ ] 配置数据库
- [ ] 设置环境变量
- [ ] 测试部署

### 文档更新:
- [ ] 更新部署文档
- [ ] 更新 API 文档
- [ ] 更新开发文档

## 🎯 优势 (Benefits)

### 分离后的优势:

1. **独立部署** - 前端和后端可以独立部署和扩展
2. **团队协作** - 前端和后端团队可以独立工作
3. **版本控制** - 独立的版本管理和发布周期
4. **权限管理** - 可以为不同团队设置不同的访问权限
5. **CI/CD** - 独立的构建和部署流程
6. **仓库大小** - 减小单个仓库的大小

## 🔧 API 通信 (API Communication)

### 前端调用后端:

```typescript
// services/api.ts
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const api = {
  auth: {
    login: (credentials) => fetch(`${API_GATEWAY_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
  },
  user: {
    getProfile: (token) => fetch(`${API_GATEWAY_URL}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }
  // ... 其他 API
};
```

## 📚 相关文档 (Related Documentation)

- [前端部署指南](./RAILWAY_DEPLOYMENT_GUIDE.md)
- [后端 API 文档](https://github.com/v3ai2026/vision-backend/blob/main/API.md)
- [架构说明](./ARCHITECTURE.md)

## 🆘 故障排查 (Troubleshooting)

### CORS 问题:
确保后端 Gateway 配置了正确的 CORS 设置允许前端域名访问。

### API 连接失败:
1. 检查后端服务是否正常运行
2. 验证环境变量中的 API_GATEWAY_URL 是否正确
3. 查看浏览器网络面板的错误信息

---

**注意**: 分离后，确保前后端的 API 接口保持同步，建议维护一份统一的 API 文档。

**更新时间**: 2025-12-26
