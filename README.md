<div align="center">

# 🛍️ VisionCommerce

### 让购物看得见真实 | See Before You Buy

**完整的AI+3D/AR电商平台 - 所有组件都在这个仓库，直接可用！**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-orange)](https://ai.google.dev/)

</div>

---

## 🚀 快速开始（3步上手）

### 1️⃣ 克隆并安装

```bash
git clone https://github.com/v3ai2026/vision-.git
cd vision-
npm install --legacy-peer-deps
```

### 2️⃣ 配置环境变量

创建 `.env.local` 文件：

```bash
# 必需 - AI功能
VITE_GEMINI_API_KEY=你的_Gemini_API_密钥

# 可选 - 后端功能
VITE_SUPABASE_URL=你的_Supabase_URL
VITE_SUPABASE_ANON_KEY=你的_Supabase_密钥
VITE_STRIPE_PUBLISHABLE_KEY=你的_Stripe_密钥
```

### 3️⃣ 启动开发服务器

```bash
npm run dev
```

**✅ 完成！访问：**
- 🌐 **本地地址**: http://localhost:5173
- 📱 **局域网地址**: http://你的IP:5173
- 🎨 **默认端口**: 5173 (Vite默认)

---

## 📂 项目入口说明

### 主要入口文件

| 文件 | 说明 | 用途 |
|------|------|------|
| `index.tsx` | 应用总入口 | React应用挂载点 |
| `App.tsx` | AI Studio主应用 | AI代码生成、Monaco编辑器 |
| `AdminApp.tsx` | 管理后台 | Dashboard、项目管理、账单等 |
| `RootApp.tsx` | 双模式切换器 | 在AI Studio和Admin之间切换 |

### 访问路径

- **AI Studio**: http://localhost:5173/ （默认首页）
- **管理后台**: 通过RootApp切换或直接访问对应路由

---

## 🌐 部署到生产环境

### Vercel一键部署

1. **推送到GitHub**
```bash
git push origin main
```

2. **在Vercel导入项目**
   - 访问 https://vercel.com
   - 点击 "Import Project"
   - 选择这个GitHub仓库

3. **配置构建命令**（Vercel会自动读取vercel.json）
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

4. **设置环境变量**
   - 在Vercel Dashboard添加 `VITE_GEMINI_API_KEY`

5. **部署完成！**
   - 获得域名：`https://你的项目.vercel.app`
   - 每次推送到main分支自动重新部署

### 手动部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 使用Vercel CLI部署
npx vercel --prod
```

---

## 📦 项目包含的完整功能

### ✅ 已集成（无需额外下载）

| 分类 | 内容 | 文件数 |
|------|------|--------|
| 🎨 UI组件 | Shadcn UI (16个) + 自定义组件 | 50+ |
| ✨ 特效系统 | 动画(11个) + 粒子特效(8个) | 19 |
| 🎮 3D/AR | 3D查看器 + AR试戴 + AI分析 | 6 |
| 📊 管理页面 | Dashboard, Projects, Billing等 | 7 |
| 🎣 Hooks | 认证、状态管理、动画等 | 8 |
| 📚 文档 | 部署、品牌、自动化指南 | 12 |
| 🔧 脚本 | 自动化部署和检查 | 3 |
| ⚙️ CI/CD | GitHub Actions工作流 | 3 |

**总计：108个核心文件，全部在这个仓库！**

---

## 🌟 About VisionCommerce

VisionCommerce is a revolutionary platform that merges AI-powered development tools with immersive 3D/AR shopping experiences and enterprise-grade infrastructure. Built with React 19, TypeScript, and cutting-edge AI technologies.

**Perfect for:**
- 🛒 E-commerce platforms needing AR/3D visualization
- 💻 Development teams building AI-powered applications  
- 🏢 Enterprises requiring full-stack SaaS solutions
- 📊 Businesses needing intelligent marketing automation
- 🎨 Creators wanting advanced UI/UX systems

---

## ✨ 核心功能

### 🤖 AI Studio & Code Generation
- **Gemini AI Integration** - 高级代码生成和AI辅助
- **Monaco Editor** - 专业代码编辑体验
- **Multi-Agent System** - 多智能体协作系统
- **Real-time Preview** - 实时代码预览

### 🎮 3D/AR Commerce System
- **360° Product Viewer** - Three.js交互式3D产品查看
- **AR Try-On** - MediaPipe面部追踪虚拟试戴
- **Virtual Store** - 沉浸式3D虚拟商店
- **AI Body Analysis** - AI智能身体分析和尺码推荐

### 🎨 Modern UI/UX Framework
- **Shadcn UI Components** - 16个精美Radix UI组件
- **Framer Motion** - 流畅动画和过渡效果
- **Particle Effects** - Canvas粒子特效系统
- **Glassmorphism Design** - 高级暗色主题 + Nuxt绿色强调色

### 📊 Enterprise Backend
- **Supabase Integration** - PostgreSQL后端数据库
- **Stripe Payments** - 完整订阅和支付系统
- **User Management** - 用户认证和权限管理
- **Analytics Dashboard** - 业务数据分析面板

### 📢 AI Marketing Automation
- **Multi-Platform Ads** - 支持Google、Facebook、TikTok、抖音等
- **AI Copywriting** - Gemini驱动的广告文案生成
- **Campaign Management** - 统一营销活动管理
- **Performance Analytics** - 实时性能指标

---

## 📦 技术栈

**核心框架:** React 19, TypeScript 5.8, Vite 6  
**UI/UX:** Shadcn UI, Tailwind CSS 4, Framer Motion, Lucide Icons  
**3D/AR:** Three.js, @react-three/fiber, MediaPipe, TensorFlow.js  
**后端服务:** Supabase, Stripe, TanStack Query, Zustand  
**AI工具:** Google Gemini, Monaco Editor, Recharts  

---

## 🏗️ 项目结构

```
vision-/
├── components/         # React组件
│   ├── ui/            # 16个Shadcn UI组件
│   ├── effects/       # 动画和粒子特效
│   ├── 3d/            # 3D产品查看器
│   ├── ar/            # AR试戴组件
│   ├── auth/          # 认证组件
│   └── ads/           # 广告系统组件
│   └── UIElements.tsx # Core UI elements
├── services/          # Business logic & APIs
│   ├── ads/           # Ad platform services
│   ├── geminiService.ts
│   └── githubService.ts
├── lib/               # Utilities
├── App.tsx            # Main app
└── types.ts           # TypeScript types
```

---

## 🔧 Configuration

Create `.env.local` from `.env.example`:

```env
# Required
VITE_GEMINI_API_KEY=your_key_here

# Optional
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

---

## 🤝 Contributing

Contributions welcome! Please check [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

<div align="center">

**Made with 💚 by the VisionCommerce Team**

[Website](https://vision-.vercel.app) • [Issues](https://github.com/v3ai2026/vision-/issues)

</div>
