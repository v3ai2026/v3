# 路由系统文档 (Routes Documentation)

本文档列出了系统中所有可用的页面路由。

## 路由架构 (Routing Architecture)

系统使用 React Router v7.11.0 实现真正的多页面路由，分为两大模块：

1. **AI Studio** - AI 项目生成和管理系统
2. **Admin System** - 用户管理和后台系统

---

## 🎨 AI Studio 路由 (Studio Routes)

### 主页面
- **路径**: `/` 或 `/studio`
- **组件**: `App.tsx`
- **描述**: AI Studio 主界面，包含以下功能标签：
  - 📝 Creation Builder (创建构建器)
  - 🎨 Figma Design Import (Figma 设计导入)
  - 🌐 Vercel Deploy (Vercel 部署)
  - ☁️ GCS Storage (GCS 存储)
  - 📊 Ads Manager (广告管理)
  - 🚀 Batch Deploy (批量部署)
  - 🤖 AI Agents (AI 代理)
  - 🎯 Ad Creator (广告创建器)
- **访问**: 公开访问

---

## 🎛️ Admin System 路由 (Admin Routes)

所有 Admin 路由都以 `/admin/` 为前缀。

### 认证页面 (Authentication Pages)

#### 登录页面
- **路径**: `/admin/login`
- **组件**: `LoginForm` (在 `components/auth/LoginForm`)
- **描述**: 用户登录界面
- **访问**: 公开访问（已登录用户会被重定向到 `/admin/dashboard`）

#### 注册页面
- **路径**: `/admin/register`
- **组件**: `RegisterForm` (在 `components/auth/RegisterForm`)
- **描述**: 新用户注册界面
- **访问**: 公开访问（已登录用户会被重定向到 `/admin/dashboard`）

---

### 受保护的页面 (Protected Pages)

所有以下页面都需要用户登录才能访问。未登录用户会被重定向到 `/admin/login`。

#### 仪表板
- **路径**: `/admin/dashboard` (默认页面)
- **组件**: `Dashboard` (在 `pages/Dashboard`)
- **图标**: 📊
- **描述**: 管理系统主仪表板，显示概览数据和统计信息
- **访问**: 需要认证

#### 项目管理
- **路径**: `/admin/projects`
- **组件**: `Projects` (在 `pages/Projects`)
- **图标**: 📁
- **描述**: 查看和管理所有项目
- **访问**: 需要认证

#### 团队管理
- **路径**: `/admin/teams`
- **组件**: `Teams` (在 `pages/Teams`)
- **图标**: 👥
- **描述**: 团队成员管理和协作设置
- **访问**: 需要认证

#### 账单中心
- **路径**: `/admin/billing`
- **组件**: `Billing` (在 `pages/Billing`)
- **图标**: 💳
- **描述**: 订阅管理、账单历史、升级套餐
- **访问**: 需要认证

#### API 密钥管理
- **路径**: `/admin/api-keys`
- **组件**: `ApiKeys` (在 `pages/ApiKeys`)
- **图标**: 🔑
- **描述**: 创建和管理 API 密钥
- **访问**: 需要认证

#### 个人资料
- **路径**: `/admin/profile`
- **组件**: `Profile` (在 `pages/Profile`)
- **图标**: 👤
- **描述**: 用户个人信息和设置
- **访问**: 需要认证

#### 系统设置
- **路径**: `/admin/settings`
- **组件**: `Settings` (在 `pages/Settings`)
- **图标**: ⚙️
- **描述**: 系统配置和偏好设置
- **访问**: 需要认证

---

## 🔄 路由切换 (Route Switching)

### 切换按钮
系统在右上角提供一个固定的切换按钮（z-index: 9999）：
- 在 Studio 模式时显示: **🎛️ Admin** - 点击跳转到 `/admin`
- 在 Admin 模式时显示: **✨ Studio** - 点击跳转到 `/studio`

### 导航逻辑
```typescript
const isStudioMode = location.pathname === '/' || location.pathname === '/studio';

const toggleMode = () => {
  if (isStudioMode) {
    navigate('/admin');
  } else {
    navigate('/studio');
  }
};
```

---

## 🔀 重定向规则 (Redirect Rules)

### Admin System 重定向
- `/admin` → `/admin/dashboard` (默认重定向到仪表板)
- `/admin/*` (未匹配路由) → `/admin/dashboard`
- 未登录用户访问受保护页面 → `/admin/login`
- 已登录用户访问认证页面 → `/admin/dashboard`

### Studio 重定向
- `/*` (未匹配路由) → `/` (回退到 AI Studio)

---

## 🌐 Vercel 部署配置 (Vercel SPA Configuration)

为了支持客户端路由和防止刷新时出现 404，`vercel.json` 配置了 SPA 回退：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

这确保所有路由都会被服务器正确处理，刷新页面不会导致 404 错误。

---

## 📋 完整路由列表 (Complete Route List)

| 路径 | 组件 | 类型 | 访问权限 | 描述 |
|------|------|------|----------|------|
| `/` | App | Studio | 公开 | AI Studio 主页 |
| `/studio` | App | Studio | 公开 | AI Studio (同首页) |
| `/admin/login` | LoginForm | Admin | 公开 | 登录页面 |
| `/admin/register` | RegisterForm | Admin | 公开 | 注册页面 |
| `/admin/dashboard` | Dashboard | Admin | 需认证 | 管理仪表板 |
| `/admin/projects` | Projects | Admin | 需认证 | 项目管理 |
| `/admin/teams` | Teams | Admin | 需认证 | 团队管理 |
| `/admin/billing` | Billing | Admin | 需认证 | 账单中心 |
| `/admin/api-keys` | ApiKeys | Admin | 需认证 | API 密钥 |
| `/admin/profile` | Profile | Admin | 需认证 | 个人资料 |
| `/admin/settings` | Settings | Admin | 需认证 | 系统设置 |
| `/*` | App | Studio | 公开 | 回退到 Studio |

---

## 🔧 技术实现 (Technical Implementation)

### 路由器层级结构
```
index.tsx
  └─ <BrowserRouter>
       └─ <RootApp>
            └─ <Routes>
                 ├─ / → <App />
                 ├─ /studio → <App />
                 ├─ /admin/* → <AdminApp>
                 │              └─ <Routes> (嵌套路由)
                 │                   ├─ /login
                 │                   ├─ /register
                 │                   ├─ /dashboard
                 │                   ├─ /projects
                 │                   ├─ /teams
                 │                   ├─ /billing
                 │                   ├─ /api-keys
                 │                   ├─ /profile
                 │                   └─ /settings
                 └─ /* → <App />
```

### 关键文件
- **`index.tsx`**: 根入口，包裹 `<BrowserRouter>`
- **`RootApp.tsx`**: 顶层路由定义，处理 Studio/Admin 切换
- **`AdminApp.tsx`**: Admin 系统的嵌套路由和认证逻辑
- **`App.tsx`**: AI Studio 主应用（单页应用，内部使用标签切换）
- **`vercel.json`**: Vercel 部署配置，SPA 回退规则

---

## 📚 相关文档
- React Router v7 文档: https://reactrouter.com/
- Vercel 配置文档: https://vercel.com/docs/projects/project-configuration

---

**最后更新**: 2025-12-28
**版本**: 1.0.0
