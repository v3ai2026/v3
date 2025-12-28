# IntelliBuild Studio - 完整系统架构总览 (Complete System Architecture Overview)

**项目名称**: IntelliBuild Studio  
**版本**: v1.0.0  
**架构类型**: 前后端分离的全栈 AI 平台  
**日期**: 2025-12-28

---

## 🏗️ 系统整体架构 (System Architecture as a Whole)

IntelliBuild Studio 是一个**统一的全栈 AI 平台**，整合了以下核心系统：

```
┌─────────────────────────────────────────────────────────────────┐
│                   IntelliBuild Studio Platform                  │
│                         (统一前端应用)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐              ┌───────────────────────┐ │
│  │   AI Studio        │◄────────────►│   Admin System        │ │
│  │   (创作系统)        │   路由切换     │   (管理系统)           │ │
│  │                    │              │                       │ │
│  │  • AI 项目生成     │              │  • 用户管理            │ │
│  │  • Figma 导入      │              │  • 项目管理            │ │
│  │  • Vercel 部署     │              │  • 团队协作            │ │
│  │  • GCS 存储        │              │  • 账单订阅            │ │
│  │  • 广告管理        │              │  • API 密钥            │ │
│  │  • 批量部署        │              │  • 系统设置            │ │
│  │  • AI 代理         │              │                       │ │
│  └────────────────────┘              └───────────────────────┘ │
│           ▲                                    ▲                │
│           │                                    │                │
│           └────────────────┬───────────────────┘                │
│                            │                                    │
│                   React Router v7.11.0                          │
│                   (统一路由系统)                                  │
└─────────────────────────────────────────────────────────────────┘
                             ▲
                             │
                    ┌────────┴─────────┐
                    │                  │
              前端技术栈              后端服务
         React 19 + Vite         Spring Boot
         TypeScript 5.8          Java 微服务
```

---

## 📂 完整项目结构 (Complete Project Structure)

### 根目录结构概览

```
vision-/
│
├── 🎨 前端核心文件 (Frontend Core)
│   ├── index.tsx              # 应用入口 (BrowserRouter)
│   ├── RootApp.tsx            # 路由根组件 (Routes定义)
│   ├── App.tsx                # AI Studio 主应用
│   ├── AdminApp.tsx           # Admin 系统主应用
│   ├── index.html             # HTML 模板
│   ├── types.ts               # TypeScript 类型定义
│   └── vite.config.ts         # Vite 构建配置
│
├── 📁 页面组件 (Pages - Admin System)
│   └── pages/
│       ├── Dashboard.tsx      # 📊 仪表板
│       ├── Projects.tsx       # 📁 项目管理
│       ├── Teams.tsx          # 👥 团队管理
│       ├── Billing.tsx        # 💳 账单中心
│       ├── ApiKeys.tsx        # 🔑 API 密钥
│       ├── Profile.tsx        # 👤 个人资料
│       └── Settings.tsx       # ⚙️ 系统设置
│
├── 🧩 组件库 (Components)
│   └── components/
│       ├── auth/              # 认证组件
│       │   ├── LoginForm.tsx  # 登录表单
│       │   └── RegisterForm.tsx # 注册表单
│       ├── ads/               # 广告系统组件
│       │   ├── AdsDashboard.tsx
│       │   └── AIAdCreator.tsx
│       ├── 3d/                # 3D 组件
│       ├── ar/                # AR 组件
│       ├── ai/                # AI 组件
│       ├── effects/           # 特效组件
│       ├── social/            # 社交组件
│       ├── ui/                # UI 组件库
│       ├── UIElements.tsx     # 神经元UI组件
│       ├── NeuralModal.tsx    # 神经元模态框
│       └── EnhancedUI.tsx     # 增强UI组件
│
├── 🎣 Hooks (Custom Hooks)
│   └── hooks/
│       ├── useAuth.ts         # 认证Hook
│       ├── useAuthStore.ts    # 认证状态管理
│       ├── useProjects.ts     # 项目管理Hook
│       ├── useSubscription.ts # 订阅管理Hook
│       ├── useAnalytics.ts    # 分析Hook
│       ├── useInView.ts       # 视图检测Hook
│       ├── useScrollProgress.ts # 滚动进度Hook
│       └── useMousePosition.ts # 鼠标位置Hook
│
├── 🔧 服务层 (Services)
│   └── services/
│       ├── geminiService.ts   # Google Gemini AI 服务
│       ├── figmaService.ts    # Figma API 集成
│       ├── vercelService.ts   # Vercel 部署服务
│       ├── gcsService.ts      # Google Cloud Storage
│       ├── githubService.ts   # GitHub API 服务
│       ├── tmdbService.ts     # TMDB API 服务
│       ├── scraperService.ts  # 网页爬虫服务
│       ├── extensionService.ts # 扩展服务
│       └── ads/               # 广告服务
│           ├── unifiedAdsService.ts
│           └── aiCopywritingService.ts
│
├── 📚 工具库 (Libraries)
│   └── lib/
│       ├── supabase.ts        # Supabase 客户端
│       ├── stripe.ts          # Stripe 支付集成
│       ├── gitee.ts           # Gitee API
│       ├── utils.ts           # 工具函数
│       ├── 3d/                # 3D 工具
│       └── ar/                # AR 工具
│
├── 🎨 样式配置 (Styling)
│   ├── tailwind.config.ts     # Tailwind CSS 配置
│   ├── postcss.config.js      # PostCSS 配置
│   └── index.html             # (包含 Tailwind CDN)
│
├── 🔧 工具脚本 (Utils)
│   └── utils/
│       └── sparkConfig.ts     # Spark 配置
│
├── 🚀 部署配置 (Deployment)
│   ├── vercel.json            # Vercel 部署配置 (SPA路由)
│   ├── railway.json           # Railway 部署配置
│   ├── docker-compose.yml     # Docker Compose
│   ├── Dockerfile.frontend    # 前端 Dockerfile
│   └── nginx.conf             # Nginx 配置
│
├── 📖 文档系统 (Documentation)
│   ├── README.md              # 项目主文档
│   ├── ROUTES_DOCUMENTATION.md # 路由系统文档
│   ├── ROUTES_CHECK_REPORT.md # 路由检查报告
│   ├── SETUP.md               # 安装指南
│   ├── DEPLOYMENT_GUIDE.md    # 部署指南
│   ├── ADS_SYSTEM_README.md   # 广告系统文档
│   └── docs/                  # 详细文档目录
│       ├── 3D_MODEL_GUIDE.md
│       ├── AR_3D_STORE.md
│       ├── AUTOMATION.md
│       ├── BRAND_GUIDELINES.md
│       └── DEPLOYMENT.md
│
└── ⚙️ 后端服务 (Backend Services - 独立微服务)
    ├── backend/               # Spring Boot 单体应用
    │   └── src/
    └── server/                # 微服务架构
        ├── blade-auth/        # 认证服务
        ├── blade-gateway/     # API 网关
        ├── vision-user/       # 用户服务
        ├── vision-project/    # 项目服务
        ├── vision-payment/    # 支付服务
        └── vision-database/   # 数据库服务
```

---

## 🛣️ 统一路由系统 (Unified Routing System)

### 路由层级结构

```
应用入口: index.tsx
    └─ <BrowserRouter> (React Router v7.11.0)
         └─ <RootApp> (根路由组件)
              ├─ 路由切换按钮 (固定右上角 z-index: 9999)
              │   • Studio模式: 显示 "🎛️ Admin" → 导航到 /admin
              │   • Admin模式: 显示 "✨ Studio" → 导航到 /studio
              │
              └─ <Routes> (路由定义)
                   │
                   ├─ "/" ──────────────────► App (AI Studio)
                   │                          • 📝 Creation Builder
                   │                          • 🎨 Figma Design Import
                   │                          • 🌐 Vercel Deploy
                   │                          • ☁️ GCS Storage
                   │                          • 📊 Ads Manager
                   │                          • 🚀 Batch Deploy
                   │                          • 🤖 AI Agents
                   │                          • 🎯 Ad Creator
                   │
                   ├─ "/studio" ─────────────► App (AI Studio)
                   │
                   ├─ "/admin/*" ────────────► AdminApp (嵌套路由)
                   │                          │
                   │                          ├─ "/login" → LoginForm (公开)
                   │                          ├─ "/register" → RegisterForm (公开)
                   │                          ├─ "/dashboard" → Dashboard (受保护)
                   │                          ├─ "/projects" → Projects (受保护)
                   │                          ├─ "/teams" → Teams (受保护)
                   │                          ├─ "/billing" → Billing (受保护)
                   │                          ├─ "/api-keys" → ApiKeys (受保护)
                   │                          ├─ "/profile" → Profile (受保护)
                   │                          ├─ "/settings" → Settings (受保护)
                   │                          └─ 重定向规则
                   │
                   └─ "/*" (catch-all) ──────► App (回退到 Studio)
```

### 完整路由清单 (11个路由)

| # | 路由路径 | 组件 | 类型 | 访问权限 | 功能描述 |
|---|---------|------|------|----------|---------|
| 1 | `/` | App.tsx | Studio | 公开 | AI Studio 主页 |
| 2 | `/studio` | App.tsx | Studio | 公开 | AI Studio (同主页) |
| 3 | `/admin/login` | LoginForm | Admin | 公开 | 用户登录 |
| 4 | `/admin/register` | RegisterForm | Admin | 公开 | 用户注册 |
| 5 | `/admin/dashboard` | Dashboard | Admin | 需认证 | 管理仪表板 |
| 6 | `/admin/projects` | Projects | Admin | 需认证 | 项目管理 |
| 7 | `/admin/teams` | Teams | Admin | 需认证 | 团队管理 |
| 8 | `/admin/billing` | Billing | Admin | 需认证 | 账单中心 |
| 9 | `/admin/api-keys` | ApiKeys | Admin | 需认证 | API 密钥管理 |
| 10 | `/admin/profile` | Profile | Admin | 需认证 | 个人资料 |
| 11 | `/admin/settings` | Settings | Admin | 需认证 | 系统设置 |

---

## 🎯 核心功能模块 (Core Feature Modules)

### 1️⃣ AI Studio 系统 (App.tsx)

**功能标签系统**:
```typescript
enum TabType {
  CREATION_BUILDER,    // 📝 AI 项目创建
  FIGMA_IMPORT,        // 🎨 Figma 设计导入
  VERCEL_DEPLOY,       // 🌐 Vercel 部署
  GCS_STORAGE,         // ☁️ Google Cloud Storage
  ADS_MANAGER,         // 📊 广告系统管理
  BATCH_DEPLOY,        // 🚀 批量部署
  AI_AGENTS,           // 🤖 AI 代理编排
  AD_CREATOR           // 🎯 AI 广告创建
}
```

**主要服务集成**:
- Google Gemini AI (深度推理 + Flash 模式)
- Figma API (设计文件导入)
- Vercel API (自动部署)
- Google Cloud Storage (文件存储)
- GitHub API (代码仓库)

### 2️⃣ Admin 管理系统 (AdminApp.tsx)

**功能模块**:

| 模块 | 页面 | 核心功能 |
|------|------|---------|
| **仪表板** | Dashboard | 数据概览、统计图表、活动动态 |
| **项目管理** | Projects | CRUD 操作、项目状态、协作管理 |
| **团队协作** | Teams | 成员管理、权限分配、团队邀请 |
| **账单中心** | Billing | 订阅管理、支付历史、套餐升级 |
| **API 密钥** | ApiKeys | 密钥生成、权限配置、使用统计 |
| **个人资料** | Profile | 用户信息、头像上传、偏好设置 |
| **系统设置** | Settings | 全局配置、通知设置、安全选项 |

**认证系统**:
- Supabase Auth (身份验证)
- JWT Token (会话管理)
- OAuth 集成 (Google, GitHub)
- AuthWrapper (路由保护)
- AuthPage (登录页面包装)

---

## 🧰 技术栈详情 (Technology Stack)

### 前端技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | React | 19.2.3 | UI 框架 |
| **路由** | React Router | 7.11.0 | 客户端路由 |
| **语言** | TypeScript | 5.8.2 | 类型安全 |
| **构建** | Vite | 6.2.0 | 构建工具 |
| **样式** | Tailwind CSS | 4.1.18 | 样式框架 |
| **状态** | Zustand | 5.0.9 | 状态管理 |
| **查询** | TanStack Query | 5.90.12 | 数据查询 |
| **动画** | Framer Motion | 12.23.26 | 动画库 |
| **3D** | Three.js + R3F | 0.160.0 / 8.15.12 | 3D 渲染 |
| **AI** | Google Gemini | 1.34.0 | AI 服务 |
| **支付** | Stripe | 8.6.0 | 支付集成 |
| **数据库** | Supabase | 2.89.0 | 后端服务 |
| **图表** | Recharts | 3.6.0 | 数据可视化 |

### 后端技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| **语言** | Java | Spring Boot 微服务 |
| **框架** | Spring Cloud | 微服务框架 |
| **网关** | Blade Gateway | API 网关 |
| **认证** | Blade Auth | 认证服务 |
| **数据库** | PostgreSQL | 关系型数据库 (Supabase) |
| **部署** | Docker + K8s | 容器化部署 |

---

## 🔐 安全与认证 (Security & Authentication)

### 认证流程

```
用户访问 → 检查认证状态 → 已登录? 
                            ├─ 是 → 访问受保护资源
                            └─ 否 → 重定向到 /admin/login

登录成功 → 获取 JWT Token → 存储到本地 → 更新用户状态
```

### 路由保护机制

```typescript
// AuthWrapper: 保护需要登录的路由
- 检查用户登录状态
- 未登录 → 重定向到 /admin/login
- 已登录 → 渲染子组件

// AuthPage: 认证页面包装
- 检查用户登录状态
- 已登录 → 重定向到 /admin/dashboard
- 未登录 → 渲染登录/注册表单
```

---

## 📦 构建与部署 (Build & Deployment)

### 构建配置

```json
{
  "scripts": {
    "dev": "vite",                    // 开发服务器
    "build": "vite build",            // 生产构建
    "preview": "vite preview",        // 构建预览
    "start": "npx serve -s dist -p $PORT" // 生产运行
  }
}
```

### Vercel 部署配置

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**SPA 路由支持**: 所有路由请求都重定向到 `index.html`，确保刷新页面不会 404。

---

## 🌐 环境变量配置 (Environment Variables)

```env
# AI 服务
VITE_GEMINI_API_KEY=            # Google Gemini API Key

# 数据库与认证
VITE_SUPABASE_URL=              # Supabase 项目 URL
VITE_SUPABASE_ANON_KEY=         # Supabase 匿名密钥

# 支付系统
VITE_STRIPE_PUBLISHABLE_KEY=    # Stripe 公钥
VITE_STRIPE_PRO_PRICE_ID=       # Pro 套餐价格 ID
VITE_STRIPE_ENTERPRISE_PRICE_ID= # Enterprise 套餐价格 ID

# 第三方集成 (可选)
VITE_VERCEL_TOKEN=              # Vercel 部署令牌
VITE_FIGMA_TOKEN=               # Figma API 令牌
VITE_GITHUB_TOKEN=              # GitHub API 令牌

# 后端 API
VITE_API_URL=http://localhost:8080 # 后端服务地址
```

---

## 📊 系统统计 (System Statistics)

### 代码规模

| 类别 | 数量 |
|------|------|
| 总文件数 | 137+ |
| 总目录数 | 35+ |
| 组件数 | 30+ |
| 页面数 | 7 |
| 服务数 | 10+ |
| Hooks数 | 8 |
| 路由数 | 11 |

### 依赖包

| 类别 | 数量 |
|------|------|
| 生产依赖 | 35 |
| 开发依赖 | 10 |
| 总依赖 | 45 |

---

## 🎯 系统特点 (System Features)

### ✨ 核心优势

1. **统一架构**: 前端作为一个整体，Studio 和 Admin 无缝集成
2. **真实路由**: React Router v7 提供真正的多页面体验
3. **认证保护**: 完善的路由守卫和权限控制
4. **AI 驱动**: 集成 Google Gemini 提供深度推理能力
5. **全栈集成**: 
   - 前端: React + TypeScript + Vite
   - 后端: Spring Boot 微服务
   - 数据库: Supabase (PostgreSQL)
   - 部署: Vercel / Railway / Docker
6. **响应式设计**: 移动端优先，完全响应式UI
7. **3D/AR 支持**: Three.js + WebXR 实现沉浸式体验
8. **实时协作**: 团队管理和项目协作功能

---

## 🔄 数据流向 (Data Flow)

```
用户界面 (UI)
    ↕
React Components
    ↕
Custom Hooks (useAuth, useProjects...)
    ↕
Services Layer (geminiService, figmaService...)
    ↕
APIs (Supabase, Stripe, Vercel, GitHub...)
    ↕
Backend Services (Spring Boot 微服务)
    ↕
Database (PostgreSQL via Supabase)
```

---

## 🚀 快速启动 (Quick Start)

### 开发环境

```bash
# 1. 克隆项目
git clone https://github.com/v3ai2026/vision-.git
cd vision-

# 2. 安装依赖
npm install --legacy-peer-deps

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入必要的 API 密钥

# 4. 启动开发服务器
npm run dev

# 5. 访问应用
# Studio: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### 生产构建

```bash
# 构建
npm run build

# 预览构建结果
npm run preview

# 部署到 Vercel
vercel --prod
```

---

## 📈 未来规划 (Future Roadmap)

1. **Redux 集成**: 添加 Redux 状态管理（如评论中提到的 useDashboardData）
2. **实时通信**: WebSocket 支持实时协作
3. **离线支持**: PWA 功能和离线缓存
4. **国际化**: i18n 多语言支持
5. **性能优化**: 代码分割、懒加载、缓存策略
6. **测试覆盖**: 单元测试、集成测试、E2E 测试
7. **AI 增强**: 更多 AI 功能和模型集成
8. **社交功能**: 用户社区、评论系统、分享功能

---

## 📚 相关文档

- **完整路由文档**: [ROUTES_DOCUMENTATION.md](./ROUTES_DOCUMENTATION.md)
- **路由检查报告**: [ROUTES_CHECK_REPORT.md](./ROUTES_CHECK_REPORT.md)
- **部署指南**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **设置指南**: [SETUP.md](./SETUP.md)
- **广告系统**: [ADS_SYSTEM_README.md](./ADS_SYSTEM_README.md)

---

## 🏆 总结

IntelliBuild Studio 是一个**功能完整、架构清晰、技术先进**的现代化全栈 AI 平台。通过统一的路由系统和模块化的组件架构，实现了 Studio 创作系统和 Admin 管理系统的无缝集成，为用户提供了一体化的开发和管理体验。

**系统状态**: 🟢 **生产就绪** (Production Ready)

---

**最后更新**: 2025-12-28  
**维护者**: @v3ai2026  
**授权**: MIT License
