<div align="center">

# 🌟 NovaUI

**Enterprise-grade AI-powered Full-Stack Development Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-67%25-blue)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-24.1%25-orange)](https://www.oracle.com/java/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-orange)](https://ai.google.dev/)

[Live Demo](#) | [Documentation](./docs) | [Deployment Guide](./DEPLOYMENT_CHECKLIST.md) | [API Docs](#)

</div>

---

## ✨ What is NovaUI?

NovaUI is a revolutionary platform that combines AI-driven code generation with enterprise-level project management, enabling developers to build full-stack applications **10x faster**.

### Key Features

- 🤖 **AI Code Generation** - Powered by Gemini AI with deep reasoning
- 💻 **Monaco Editor** - Professional code editing experience
- 🏗️ **Microservices Backend** - Spring Boot + Cloud Gateway
- 🎨 **Beautiful UI** - Luxury dark theme with Nuxt green accent
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **Enterprise Auth** - JWT + OAuth integration with Supabase
- 💳 **Payment Integration** - Stripe subscriptions
- 🚀 **One-Click Deploy** - Railway, Vercel, Docker support
- 📊 **Admin Dashboard** - Complete project and team management
- 🎯 **AI Ads System** - Intelligent marketing automation

---

## 🚀 快速开始 (Quick Start)

### Prerequisites

- Node.js 18+
- Java 17+ (for backend - optional)
- PostgreSQL (optional, for full features)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/v3ai2026/vision-.git
cd vision-
npm install
```

### 2️⃣ Configure Environment

Create `.env.local` file:

```bash
# Required - AI功能
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional - 后端功能
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

**Get your Gemini API key:** https://ai.google.dev

### 3️⃣ Start Development Server

```bash
npm run dev
```

**✅ 完成! Visit:**
- 🌐 **Local**: http://localhost:3000
- 🎨 **AI Studio**: Default landing page
- 🎛️ **Admin Dashboard**: Click "Admin" button in top-right

---

## 📂 Project Structure

### Main Entry Files

| File | Description | Purpose |
|------|-------------|---------|
| `index.tsx` | Application entry | React app mount point |
| `RootApp.tsx` | App router | Switches between Studio and Admin |
| `App.tsx` | AI Studio | AI code generation, Monaco editor |
| `AdminApp.tsx` | Admin panel | Dashboard, projects, billing |

### Architecture

```
NovaUI
├── Frontend (React + Vite)
│   ├── AI Studio - Code generation
│   └── Admin Dashboard - Project management
│
├── Backend (Spring Boot Microservices)
│   ├── API Gateway
│   ├── Auth Service
│   ├── User Service
│   ├── Project Service
│   ├── Payment Service
│   └── Deploy Service
│
└── Database (PostgreSQL + Supabase)
```

---

## 🌐 部署到生产环境 (Deployment)

### Option 1: Railway (Recommended)

See [Complete Deployment Guide](./DEPLOYMENT_CHECKLIST.md)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Deploy on Railway**
   - Visit https://railway.app
   - Click "New Project"
   - Connect your GitHub repository
   - Add environment variables from `.env.example`

3. **✅ Done!** Your app is live at `https://your-app.railway.app`

### Option 2: Vercel (Frontend Only)

1. **Push to GitHub**
```bash
git push origin main
```

2. **在Vercel导入项目 (Import on Vercel)**
   - Visit https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository

3. **配置构建 (Configure Build)** - Auto-detected from vercel.json
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **设置环境变量 (Set Environment Variables)**
   - Add `VITE_GEMINI_API_KEY` in Vercel Dashboard

5. **✅ Deployed!**
   - Your domain: `https://your-project.vercel.app`
   - Auto-deploy on push to main

### Option 3: Manual Build

```bash
# Build production version
npm run build

# Preview build
npm run preview

# Deploy with Vercel CLI
npx vercel --prod
```

---

## 📦 Complete Feature Set

### ✅ Included (No Extra Downloads)

| Category | Content | Files |
|----------|---------|-------|
| 🎨 UI Components | Shadcn UI + Custom | 50+ |
| ✨ Effects System | Animations + Particles | 19 |
| 🎮 3D/AR | 3D Viewer + AR Try-on | 6 |
| 📊 Admin Pages | Dashboard, Projects, Billing | 7 |
| 🎣 Hooks | Auth, State, Animation | 8 |
| 📚 Documentation | Deploy, Brand, Setup | 12 |
| 🔧 Scripts | Automation Scripts | 3 |
| ⚙️ CI/CD | GitHub Actions | 3 |

**Total: 108+ core files, all in this repo!**

---

## 🌟 About NovaUI

NovaUI is a revolutionary platform that combines AI-powered code generation with enterprise-level project management. Built with React 19, TypeScript, Spring Boot, and cutting-edge AI technologies.

**Perfect for:**
- 💻 Development teams building full-stack applications
- 🏢 Enterprises requiring AI-powered SaaS solutions
- 🚀 Startups needing rapid prototyping
- 📊 Businesses needing intelligent automation
- 🎨 Creators wanting advanced UI/UX systems

---

## ✨ 核心功能 (Core Features)

### 🤖 AI Studio & Code Generation
- **Gemini AI Integration** - Advanced code generation with deep reasoning
- **Monaco Editor** - Professional code editing experience
- **Multi-Agent System** - Collaborative AI agent orchestration
- **Real-time Preview** - Live code preview

### 📊 Admin Dashboard
- **Project Management** - Complete project lifecycle management
- **Team Collaboration** - Multi-user team workspace
- **Billing & Subscriptions** - Stripe integration for payments
- **API Key Management** - Secure API key handling
- **Analytics** - Real-time usage metrics

### 🎨 Modern UI/UX Framework
- **Shadcn UI Components** - 16+ beautiful Radix UI components
- **Framer Motion** - Smooth animations and transitions
- **Particle Effects** - Canvas particle effect system
- **Glassmorphism Design** - Luxury dark theme + Nuxt green accent

### 🏗️ Enterprise Backend (Optional)
- **Spring Boot Microservices** - Scalable backend architecture
- **Supabase Integration** - PostgreSQL backend database
- **Stripe Payments** - Complete subscription and payment system
- **User Management** - User authentication and authorization
- **JWT Security** - Secure token-based authentication

### 📢 AI Marketing Automation
- **Multi-Platform Ads** - Google, Facebook, TikTok support
- **AI Copywriting** - Gemini-powered ad copy generation
- **Campaign Management** - Unified marketing campaign management
- **Performance Analytics** - Real-time performance metrics

---

## 🛠️ Tech Stack

### Frontend
- **Core:** React 19, TypeScript 5.8, Vite 6
- **UI/UX:** Shadcn UI, Tailwind CSS 4, Framer Motion, Lucide Icons
- **3D/AR:** Three.js, @react-three/fiber, MediaPipe, TensorFlow.js
- **State:** TanStack Query, Zustand
- **Editor:** Monaco Editor

### Backend (Optional)
- **Framework:** Spring Boot 3, Spring Cloud Gateway
- **Database:** PostgreSQL, Supabase
- **Auth:** JWT, OAuth
- **Payments:** Stripe
- **Deploy:** Docker, Railway, Kubernetes

### AI & ML
- **AI:** Google Gemini AI (Flash & Pro models)
- **ML:** TensorFlow.js, MediaPipe
- **Code Gen:** Structured JSON responses with schema validation

---

## 🏗️ Project Structure

```
novaui/
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── effects/       # Animations & particles
│   │   ├── 3d/            # 3D viewers
│   │   ├── ar/            # AR components
│   │   ├── auth/          # Authentication
│   │   ├── ads/           # Ad system
│   │   └── UIElements.tsx # Core UI elements
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   ├── NotFound.tsx
│   │   └── ...
│   ├── services/          # Business logic & APIs
│   │   ├── ads/           # Ad platform services
│   │   ├── geminiService.ts
│   │   └── githubService.ts
│   ├── lib/               # Utilities & helpers
│   │   └── env.ts         # Environment validation
│   ├── hooks/             # Custom React hooks
│   ├── App.tsx            # AI Studio app
│   ├── AdminApp.tsx       # Admin dashboard
│   ├── RootApp.tsx        # App router
│   └── types.ts           # TypeScript types
│
├── server/                # Backend services (optional)
│   ├── blade-gateway/     # API Gateway
│   ├── blade-auth/        # Authentication
│   ├── vision-user/       # User management
│   ├── vision-project/    # Project management
│   ├── vision-payment/    # Payment service
│   └── vision-deploy/     # Deployment service
│
├── docs/                  # Documentation
├── public/                # Static assets
└── tests/                 # Test files
```

---

## 🔧 Configuration

Create `.env.local` from `.env.example`:

```env
# Required
VITE_GEMINI_API_KEY=your_key_here

# Optional - Backend
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_GATEWAY_URL=http://localhost:8080

# Optional - Payments
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_STRIPE_PRO_PRICE_ID=
VITE_STRIPE_ENTERPRISE_PRICE_ID=
```

---

## 📚 Documentation

### Quick Links
- **[Complete Documentation Index](./docs/README.md)** - All documentation in one place
- **[Installation Guide](./SETUP.md)** - Detailed setup instructions
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment verification
- **[Contributing Guide](./CONTRIBUTING.md)** - Development workflow and guidelines
- **[Code Review Guide](./CODE_REVIEW.md)** - Code review standards and best practices
- **[Merge Complete](./MERGE_COMPLETE.md)** - Nova repository merge documentation

### Technical Documentation
- **[API Specification](./docs/API_SPEC.md)** - Complete REST API docs (21 endpoints)
- **[Data Flow](./docs/DATA_FLOW.md)** - Data flow diagrams and state management
- **[Routes Complete](./docs/ROUTES_COMPLETE.md)** - All page routes and composables
- **[Database Setup](./DATABASE.md)** - Database configuration and setup
- **[Database Migration](./docs/DATABASE_MIGRATION.md)** - Database consolidation strategy
- **[Components Library](./COMPONENTS.md)** - Component documentation and usage

### Feature Documentation
- **[3D Model Guide](./docs/3D_MODEL_GUIDE.md)** - 3D integration and optimization
- **[AR & 3D Store](./docs/AR_3D_STORE.md)** - AR features implementation
- **[Ads System](./ADS_SYSTEM_README.md)** - Marketing automation platform
- **[Automation Guide](./docs/AUTOMATION.md)** - CI/CD and automation workflows
- **[Brand Guidelines](./docs/BRAND_GUIDELINES.md)** - Design system and visual identity

### Backend Documentation
- **[Backend Setup](./BACKEND_SETUP.md)** - Microservices architecture setup
- **[Backend Quickstart](./BACKEND_QUICKSTART.md)** - Quick backend setup guide
- **[Backend Separation](./BACKEND_SEPARATION_GUIDE.md)** - Microservices guide

---

## 🧪 Code Quality

This project uses automated tools to ensure code quality and consistency:

### Available Commands

```bash
# Linting
npm run lint           # Check code for issues
npm run lint:fix       # Auto-fix linting issues

# Formatting
npm run format         # Format all code with Prettier
npm run format:check   # Check formatting without changes

# Development
npm run dev            # Start dev server with hot reload
npm run build          # Build for production
npm run preview        # Preview production build
```

### Automated Quality Checks

- **ESLint** - JavaScript/TypeScript linting with React rules
- **Prettier** - Consistent code formatting
- **TypeScript** - Type checking and inference
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files only

### Pre-Commit Hook

Every commit automatically runs:
1. ESLint on staged `.js`, `.ts`, `.tsx` files
2. Prettier formatting on all staged files
3. Type checking via TypeScript

This ensures all committed code meets quality standards.

### Code Review

All pull requests require:
- ✅ Passing lint checks
- ✅ Passing build
- ✅ Code review approval
- ✅ All conversations resolved

See [CODE_REVIEW.md](./CODE_REVIEW.md) and [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md) for detailed guidelines.

---

## 🗑️ Repository Management

### Batch Delete Repositories

For managing large numbers of repositories, see:
- 📖 [Batch Delete Guide](./docs/BATCH_DELETE_GUIDE.md)
- 🪟 Windows Script: `scripts/delete-repos.ps1`
- 🍎 Mac/Linux Script: `scripts/delete-repos.sh`

**Quick Start:**
```bash
# Windows PowerShell
.\scripts\delete-repos.ps1

# Mac/Linux
chmod +x scripts/delete-repos.sh
./scripts/delete-repos.sh
```

**Features:**
- ✅ Safe deletion with double confirmation
- ✅ Keep specified repositories (vision- + 4 others)
- ✅ Detailed progress tracking
- ✅ Error handling and recovery

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Google Gemini AI
- Vercel & Railway
- Supabase
- Stripe
- The open source community

---

## 📞 Support

- 📧 Email: support@novaui.dev
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/v3ai2026/vision-/issues)
- 📖 Docs: [Full Documentation](./docs)

---

<div align="center">

**Made with ❤️ by the NovaUI Team**

[Website](#) | [Twitter](#) | [Discord](#) | [Blog](#)

⭐ **Star us on GitHub — it helps!**

</div>
