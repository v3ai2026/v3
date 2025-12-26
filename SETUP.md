# 部署配置指南

## GitHub Secrets 配置

### 1. 添加 GitHub Secrets

前往你的 GitHub 仓库：https://github.com/v3ai2026/vision-/settings/secrets/actions

点击 **New repository secret** 添加以下 3 个 secrets：

#### VERCEL_TOKEN
- **获取方式**：访问 https://vercel.com/account/tokens 生成新的 Token
- **权限**：需要有部署权限
- 在 GitHub 中添加：名称填 `VERCEL_TOKEN`，值填你生成的 Token

#### VERCEL_PROJECT_ID
- **获取方式**：
  1. 前往 Vercel 控制台选择你的项目
  2. 进入 Settings → General
  3. 在 "Project ID" 中复制 ID
- 在 GitHub 中添加：名称填 `VERCEL_PROJECT_ID`，值填项目 ID

#### VERCEL_ORG_ID
- **获取方式**：
  1. 在 Vercel 项目的 Settings → General 页面
  2. 找到 "Team ID" 或 "Organization ID"
  3. 复制该 ID
- 在 GitHub 中添加：名称填 `VERCEL_ORG_ID`，值填组织 ID

---

## Vercel 环境变量配置

### 2. 在 Vercel 后台添加环境变量

1. 访问 Vercel 控制台：https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**

### 前端环境变量（根据 .env.example）

添加以下环境变量：

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `VITE_API_URL` | 后端 API 地址 | ✓ |
| `VITE_GEMINI_API_KEY` | Gemini AI API 密钥 | ✓ |
| `VITE_SUPABASE_URL` | Supabase 项目 URL | ✓ |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✓ |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe 可发布密钥 | ✓ |
| `VITE_STRIPE_PRO_PRICE_ID` | Stripe Pro 计划价格 ID | ✓ |
| `VITE_STRIPE_ENTERPRISE_PRICE_ID` | Stripe Enterprise 价格 ID | ✓ |
| `VITE_VERCEL_TOKEN` | Vercel Token（可选） | ✗ |
| `VITE_FIGMA_TOKEN` | Figma 集成 Token（可选） | ✗ |
| `VITE_GITHUB_TOKEN` | GitHub Token（可选） | ✗ |

### 后端环境变量（如果部署后端）

如果你也需要部署 Spring Boot 后端，需要添加：

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `SUPABASE_URL` | Supabase 项目 URL | ✓ |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✓ |
| `SUPABASE_SERVICE_KEY` | Supabase 服务密钥 | ✓ |
| `SUPABASE_DB_HOST` | 数据库主机地址 | ✓ |
| `SUPABASE_DB_PORT` | 数据库端口（默认 5432） | ✓ |
| `SUPABASE_DB_NAME` | 数据库名（默认 postgres） | ✓ |
| `SUPABASE_DB_USER` | 数据库用户名 | ✓ |
| `SUPABASE_DB_PASSWORD` | 数据库密码 | ✓ |
| `JWT_SECRET` | JWT 密钥 | ✓ |
| `JWT_EXPIRATION` | JWT 过期时间（毫秒） | ✓ |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | ✓ |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 密钥 | ✓ |
| `STRIPE_PRO_PRICE_ID` | Pro 计划价格 ID | ✓ |
| `STRIPE_ENTERPRISE_PRICE_ID` | Enterprise 价格 ID | ✓ |
| `FRONTEND_URL` | 前端 URL | ✓ |

---

## 自动部署

配置完成后，当你推送代码到 `main` 分支时，GitHub Actions 会自动：
1. 拉取 Vercel 环境配置
2. 构建项目
3. 部署到 Vercel 生产环境

查看部署状态：https://github.com/v3ai2026/vision-/actions

---

## 常见问题

### Q: 部署失败怎么办？
检查：
1. GitHub Secrets 是否正确配置
2. Vercel 环境变量是否完整
3. GitHub Actions 日志中的错误信息

### Q: 如何获取 Supabase 配置？
1. 访问 https://supabase.com/dashboard
2. 选择你的项目
3. 进入 Settings → API 获取 URL 和密钥
4. 进入 Settings → Database 获取数据库连接信息

### Q: 如何获取 Stripe 密钥？
1. 访问 https://dashboard.stripe.com/
2. 进入 Developers → API keys
3. 复制 Publishable key 和 Secret key
4. 创建产品和价格，获取 Price ID