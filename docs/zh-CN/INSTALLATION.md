# 📦 详细安装指南

本指南将帮助你从零开始安装和配置 AI 全栈开发与营销自动化平台。

## 目录

- [系统要求](#系统要求)
- [安装步骤](#安装步骤)
- [环境变量配置](#环境变量配置)
- [验证安装](#验证安装)
- [常见问题](#常见问题)

## 系统要求

### 必需条件

- **Node.js**: 18.0.0 或更高版本
- **npm**: 9.0.0 或更高版本（或 yarn 1.22.0+）
- **操作系统**: Windows 10+, macOS 10.15+, 或 Linux (Ubuntu 20.04+)
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, 或 Edge 90+

### 推荐配置

- **RAM**: 8GB 或更多
- **磁盘空间**: 至少 2GB 可用空间
- **网络**: 稳定的互联网连接（用于 AI 服务和广告平台 API）

## 安装步骤

### 1. 检查 Node.js 版本

```bash
node --version
npm --version
```

如果未安装 Node.js 或版本过低，请访问 [Node.js 官网](https://nodejs.org/) 下载安装最新 LTS 版本。

### 2. 克隆仓库

使用 Git 克隆项目仓库：

```bash
git clone https://github.com/v3ai2026/vision-.git
cd vision-
```

或者，如果你使用 SSH：

```bash
git clone git@github.com:v3ai2026/vision-.git
cd vision-
```

### 3. 安装依赖

使用 npm 安装项目依赖：

```bash
npm install
```

或者使用 yarn：

```bash
yarn install
```

这将安装所有必需的依赖包，包括：
- React 19
- TypeScript
- Vite
- Monaco Editor
- Google Gemini SDK
- 各种广告平台 SDK

### 4. 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
# 如果没有 .env.example，直接创建 .env.local
touch .env.local
```

编辑 `.env.local` 文件，添加以下配置：

```env
# ===========================================
# 核心 AI 配置（必需）
# ===========================================
GEMINI_API_KEY=your_gemini_api_key_here

# ===========================================
# Vercel 部署配置（可选）
# ===========================================
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here
VERCEL_ORG_ID=your_org_id_here

# ===========================================
# Google Cloud 配置（可选）
# ===========================================
GCS_BUCKET_NAME=your_bucket_name
GCS_PROJECT_ID=your_gcs_project_id
GCS_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# ===========================================
# 广告平台 API 配置（可选）
# ===========================================

# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id

# Facebook Ads
FACEBOOK_ADS_ACCESS_TOKEN=your_facebook_access_token
FACEBOOK_ADS_APP_ID=your_app_id
FACEBOOK_ADS_APP_SECRET=your_app_secret
FACEBOOK_ADS_ACCOUNT_ID=act_your_account_id

# TikTok Ads
TIKTOK_ADS_ACCESS_TOKEN=your_tiktok_access_token
TIKTOK_ADS_APP_ID=your_tiktok_app_id
TIKTOK_ADS_SECRET=your_tiktok_secret
TIKTOK_ADS_ADVERTISER_ID=your_advertiser_id

# 抖音广告（国内）
DOUYIN_ACCESS_TOKEN=your_douyin_token
DOUYIN_ADVERTISER_ID=your_douyin_advertiser_id

# 快手广告
KUAISHOU_ACCESS_TOKEN=your_kuaishou_token
KUAISHOU_ADVERTISER_ID=your_kuaishou_advertiser_id

# 小红书广告
XIAOHONGSHU_ACCESS_TOKEN=your_xiaohongshu_token
XIAOHONGSHU_ACCOUNT_ID=your_xiaohongshu_account_id

# 微信广告
WECHAT_ACCESS_TOKEN=your_wechat_token
WECHAT_ACCOUNT_ID=your_wechat_account_id

# 百度推广
BAIDU_ACCESS_TOKEN=your_baidu_token
BAIDU_ACCOUNT_ID=your_baidu_account_id

# 腾讯广告
TENCENT_ACCESS_TOKEN=your_tencent_token
TENCENT_ACCOUNT_ID=your_tencent_account_id

# 阿里妈妈
ALIMAMA_ACCESS_TOKEN=your_alimama_token
ALIMAMA_ACCOUNT_ID=your_alimama_account_id
```

### 5. 获取 API 密钥

#### Gemini API Key（必需）

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录你的 Google 账号
3. 点击 "Get API Key" 创建新的 API 密钥
4. 复制密钥并粘贴到 `.env.local` 的 `GEMINI_API_KEY` 中

#### Vercel Token（可选，用于部署）

1. 访问 [Vercel Dashboard](https://vercel.com/account/tokens)
2. 创建新的 Token
3. 复制 Token 并粘贴到 `.env.local`

#### 广告平台 API（可选，用于广告功能）

各广告平台的 API 密钥获取方式：

- **Google Ads**: [Google Ads API 文档](https://developers.google.com/google-ads/api/docs/start)
- **Facebook Ads**: [Facebook Marketing API](https://developers.facebook.com/docs/marketing-apis)
- **TikTok Ads**: [TikTok for Business API](https://ads.tiktok.com/marketing_api/docs)
- **中国平台**: 需要分别在各平台的开发者中心申请

### 6. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:5173` 启动。

看到以下输出表示启动成功：

```
VITE v6.2.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### 7. 访问应用

打开浏览器，访问 `http://localhost:5173`

你应该能看到应用的主界面，包括：
- 侧边栏导航（Build、Ads、Settings 等）
- AI 代码生成器
- 广告营销系统

## 环境变量配置

### 核心配置

| 变量名 | 必需 | 描述 | 示例 |
|--------|------|------|------|
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API 密钥 | `AIzaSy...` |

### 部署配置

| 变量名 | 必需 | 描述 | 示例 |
|--------|------|------|------|
| `VERCEL_TOKEN` | ❌ | Vercel 部署令牌 | `abc123...` |
| `VERCEL_PROJECT_ID` | ❌ | Vercel 项目 ID | `prj_...` |
| `VERCEL_ORG_ID` | ❌ | Vercel 组织 ID | `team_...` |

### 云存储配置

| 变量名 | 必需 | 描述 | 示例 |
|--------|------|------|------|
| `GCS_BUCKET_NAME` | ❌ | Google Cloud Storage 桶名称 | `my-bucket` |
| `GCS_PROJECT_ID` | ❌ | GCS 项目 ID | `my-project-123` |
| `GCS_SERVICE_ACCOUNT` | ❌ | GCS 服务账号 JSON | `{"type":"service_account",...}` |

### 广告平台配置

每个广告平台都需要特定的认证信息。详细配置请参考各平台的开发者文档。

## 验证安装

### 1. 检查服务启动

确保开发服务器正常运行：

```bash
curl http://localhost:5173
```

应该返回 HTML 内容。

### 2. 测试 AI 功能

1. 打开应用
2. 点击 "Build" 菜单
3. 输入简单的项目描述，如 "创建一个 Hello World 网站"
4. 点击 "生成" 按钮
5. 如果 Gemini API 配置正确，应该能看到生成的代码

### 3. 检查浏览器控制台

按 `F12` 打开浏览器开发者工具，检查控制台是否有错误信息。

正常情况下不应该有红色的错误提示。

### 4. 测试广告功能（可选）

如果配置了广告平台 API：

1. 点击 "Ads" 菜单
2. 尝试创建测试广告
3. 检查是否能正常连接到广告平台

## 常见问题

### 安装失败

**问题**: `npm install` 失败

**解决方案**:
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 端口占用

**问题**: 端口 5173 已被占用

**解决方案**:
```bash
# 方法 1: 指定其他端口
npm run dev -- --port 3000

# 方法 2: 结束占用端口的进程（macOS/Linux）
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Gemini API 错误

**问题**: API 调用失败，提示 "Invalid API Key"

**解决方案**:
1. 检查 `.env.local` 中的 `GEMINI_API_KEY` 是否正确
2. 确认 API Key 已启用且有配额
3. 重启开发服务器（`Ctrl+C` 然后 `npm run dev`）

### 依赖版本冲突

**问题**: 安装依赖时出现版本冲突

**解决方案**:
```bash
# 使用 legacy peer deps
npm install --legacy-peer-deps

# 或强制安装
npm install --force
```

### 构建失败

**问题**: `npm run build` 失败

**解决方案**:
1. 检查 TypeScript 错误: `npm run type-check`
2. 确保所有依赖已正确安装
3. 查看完整错误日志并根据提示修复

### 环境变量未生效

**问题**: 修改 `.env.local` 后没有效果

**解决方案**:
1. 确保文件名是 `.env.local` 而不是 `.env.local.txt`
2. 重启开发服务器
3. 检查变量名是否正确（区分大小写）
4. 确认变量值没有多余的引号或空格

### 广告平台连接失败

**问题**: 无法连接到广告平台 API

**解决方案**:
1. 检查 API 密钥和令牌是否有效
2. 确认账户有足够的权限
3. 检查网络连接和防火墙设置
4. 查看广告平台的 API 状态页面

## 下一步

安装完成后，你可以：

1. 📚 阅读 [API 参考文档](API_REFERENCE.md)
2. 📢 查看 [广告系统使用指南](ADVERTISING_GUIDE.md)
3. ❓ 遇到问题？查看 [常见问题解答](TROUBLESHOOTING.md)
4. 🚀 开始构建你的第一个 AI 项目！

## 获取帮助

如果遇到其他问题：

1. 查看项目的 [GitHub Issues](https://github.com/v3ai2026/vision-/issues)
2. 搜索现有问题或创建新的 Issue
3. 提供详细的错误信息和环境配置
4. 包含复现问题的步骤

---

**祝你使用愉快！有问题随时反馈！** 🎉
