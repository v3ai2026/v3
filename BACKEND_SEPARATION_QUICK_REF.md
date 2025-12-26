# 后端分离快速参考 (Backend Separation Quick Reference)

## 🎯 目标

将后端代码从前端仓库分离到独立的后端仓库。

## 📋 分离方式选择

### 方式 1: 自动化脚本 (推荐)

**Linux/Mac:**
```bash
./separate-backend.sh
```

**Windows:**
```cmd
separate-backend.bat
```

### 方式 2: 手动分离

参见详细指南: [BACKEND_SEPARATION_GUIDE.md](./BACKEND_SEPARATION_GUIDE.md)

## 🚀 快速步骤

### 1. 准备工作

在 GitHub 创建新仓库:
- 仓库名: `vision-backend`
- URL: `https://github.com/v3ai2026/vision-backend.git`

### 2. 运行分离脚本

```bash
# Linux/Mac
chmod +x separate-backend.sh
./separate-backend.sh

# Windows
separate-backend.bat
```

### 3. 输入信息

脚本会提示输入:
- 新后端仓库的 GitHub URL
- 临时目录路径（可选）

### 4. 自动完成

脚本会自动:
- ✅ 复制所有后端代码
- ✅ 创建必要的配置文件
- ✅ 初始化 Git 仓库
- ✅ 提交并推送到新仓库

## 📦 迁移内容清单

### 复制到新仓库的内容:

**微服务:**
- blade-gateway
- blade-auth
- vision-user
- vision-deploy
- vision-project
- vision-payment
- vision-monitor
- vision-database
- vision-proxy

**通用模块:**
- vision-common
- blade-common

**配置文件:**
- pom.xml
- docker-compose.yml
- .gitignore
- .env.example
- nixpacks.toml (每个服务)
- railway.json (每个服务)

**文档:**
- README.md
- ARCHITECTURE.md
- QUICKSTART.md
- IMPLEMENTATION_SUMMARY.md
- RAILWAY_DEPLOYMENT.md

**CI/CD:**
- .github/workflows/railway-deploy.yml

## 🔄 分离后的操作

### 在前端仓库:

1. **删除后端代码:**
   ```bash
   cd vision-
   git checkout -b remove-backend
   git rm -r server/
   git commit -m "Remove backend code - moved to vision-backend repository"
   git push origin remove-backend
   ```

2. **更新 README.md:**
   添加后端仓库链接:
   ```markdown
   ## 后端服务
   后端代码在独立仓库: [vision-backend](https://github.com/v3ai2026/vision-backend)
   ```

3. **更新环境变量:**
   创建 `.env.example`:
   ```bash
   VITE_API_GATEWAY_URL=https://gateway.railway.app
   VITE_GEMINI_API_KEY=your_key
   ```

### 在后端仓库:

1. **验证代码:**
   ```bash
   git clone https://github.com/v3ai2026/vision-backend.git
   cd vision-backend
   ls -la
   ```

2. **测试构建:**
   ```bash
   cd vision-common
   mvn clean install -DskipTests
   cd ../blade-gateway
   mvn clean package -DskipTests
   ```

## 🚂 Railway 部署配置

### 前端项目 (vision-frontend):

1. 在 Railway 创建项目: "Vision Frontend"
2. 连接仓库: `v3ai2026/vision-`
3. Root Directory: `/`
4. 环境变量:
   ```
   VITE_API_GATEWAY_URL=https://your-gateway.railway.app
   ```

### 后端项目 (vision-backend):

1. 在 Railway 创建项目: "Vision Backend"
2. 连接仓库: `v3ai2026/vision-backend`
3. 添加 PostgreSQL 数据库
4. 为每个服务创建 Service:

| Service | Root Directory | 端口 |
|---------|----------------|------|
| blade-gateway | `blade-gateway` | 8080 |
| blade-auth | `blade-auth` | 8081 |
| vision-user | `vision-user` | 8082 |
| vision-deploy | `vision-deploy` | 8083 |
| vision-project | `vision-project` | 8084 |
| vision-payment | `vision-payment` | 8085 |

5. 配置环境变量:
   ```bash
   PORT=${{RAILWAY_PUBLIC_PORT}}
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   DB_USERNAME=postgres
   DB_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
   ```

## ✅ 验证清单

### 后端仓库:
- [ ] 代码已成功推送到 GitHub
- [ ] 所有服务目录存在
- [ ] 配置文件完整
- [ ] README.md 存在
- [ ] GitHub Actions 工作流存在

### 前端仓库:
- [ ] server/ 目录已删除
- [ ] README.md 已更新
- [ ] 环境变量配置已更新
- [ ] API 地址已配置

### Railway:
- [ ] 前端项目已创建
- [ ] 后端项目已创建
- [ ] 所有后端服务已配置
- [ ] 数据库已添加
- [ ] 环境变量已设置
- [ ] 部署成功

## 🔗 前后端通信

### 前端配置:

```typescript
// .env.local
VITE_API_GATEWAY_URL=https://gateway.railway.app
```

### API 调用示例:

```typescript
const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

// 登录
fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

// 获取用户信息
fetch(`${API_URL}/api/user/profile`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 后端 CORS 配置:

确保 blade-gateway 的 `application.yml` 配置了 CORS:

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: 
              - "https://your-frontend.railway.app"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true
```

## 🐛 常见问题

**Q: 分离脚本失败?**
A: 检查是否在仓库根目录运行，确保有 `server/` 目录

**Q: 推送失败?**
A: 确保新仓库已创建且 URL 正确，检查 Git 权限

**Q: 前端无法连接后端?**
A: 验证 VITE_API_GATEWAY_URL 配置正确，检查 CORS 设置

**Q: 后端服务无法启动?**
A: 检查 DATABASE_URL 等环境变量是否正确设置

## 📚 详细文档

- 📖 [完整分离指南](./BACKEND_SEPARATION_GUIDE.md)
- 🚂 [Railway 部署指南](./RAILWAY_DEPLOYMENT_GUIDE.md)
- 🤖 [自动部署配置](./RAILWAY_AUTO_DEPLOY.md)

## 🎯 分离的优势

1. **独立部署** - 前后端独立发布
2. **团队协作** - 不同团队维护不同仓库
3. **权限管理** - 细粒度的访问控制
4. **CI/CD** - 独立的构建流程
5. **版本管理** - 独立的版本号和发布周期

---

**注意**: 分离后请确保前后端 API 接口保持同步，建议维护统一的 API 文档。

**更新时间**: 2025-12-26
