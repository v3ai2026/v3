# NovaUI 完整后台管理系统 - 设置指南

## 🏗️ 系统架构概览

NovaUI 现已集成完整的企业级后台管理系统，包含：

- ✅ **Supabase Backend** - PostgreSQL 数据库 + 认证系统
- ✅ **Stripe 支付集成** - 订阅和支付管理
- ✅ **Gitee API 集成** - 代码仓库和部署
- ✅ **状态管理** - Zustand
- ✅ **数据获取** - TanStack Query (React Query)
- ✅ **路由系统** - React Router
- ✅ **数据可视化** - Recharts

## 📦 已安装的依赖

```json
{
  "@supabase/supabase-js": "^latest",
  "@stripe/stripe-js": "^latest",
  "zustand": "^latest",
  "@tanstack/react-query": "^latest",
  "react-router-dom": "^latest",
  "recharts": "^latest",
  "date-fns": "^latest",
  "lucide-react": "^latest"
}
```

## 🚀 快速开始

### 1. Supabase 设置

#### 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 创建新项目
3. 获取项目 URL 和 anon key

#### 运行数据库迁移

在 Supabase SQL 编辑器中运行 `supabase-schema.sql` 文件：

```bash
# 文件位置: /supabase-schema.sql
```

这将创建所有必要的表：
- user_profiles (用户资料)
- projects (项目)
- project_files (项目文件)
- deployments (部署记录)
- subscriptions (订阅)
- payments (支付记录)
- usage_metrics (使用统计)
- teams (团队)
- team_members (团队成员)
- api_keys (API密钥)
- activity_logs (活动日志)
- gitee_repos (Gitee仓库)

#### 配置环境变量

创建 `.env` 文件：

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_PRO_PRICE_ID=price_xxx
VITE_STRIPE_ENTERPRISE_PRICE_ID=price_xxx

# Gemini (已有)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 2. Stripe 设置

#### 创建 Stripe 账户

1. 访问 [https://stripe.com](https://stripe.com)
2. 创建账户并获取 API 密钥
3. 创建产品和价格：
   - **Pro Plan**: $29/月
   - **Enterprise Plan**: $99/月

#### 配置 Webhook

1. 在 Stripe Dashboard 中设置 webhook
2. 监听以下事件：
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`

### 3. Gitee 集成

#### 获取 Gitee Access Token

1. 访问 [https://gitee.com/profile/personal_access_tokens](https://gitee.com/profile/personal_access_tokens)
2. 创建新的 Personal Access Token
3. 勾选必要的权限：
   - `projects` - 仓库管理
   - `pull_requests` - PR 管理
   - `hook` - Webhook 管理

用户可以在 Settings 页面中配置 Gitee token。

## 📂 项目结构

```
v3/
├── lib/                      # 核心库
│   ├── supabase.ts          # Supabase 客户端和类型
│   ├── stripe.ts            # Stripe 集成
│   └── gitee.ts             # Gitee API 服务
├── hooks/                    # React Hooks
│   ├── useAuth.ts           # 认证逻辑
│   ├── useAuthStore.ts      # 认证状态
│   ├── useProjects.ts       # 项目管理
│   ├── useSubscription.ts   # 订阅管理
│   └── useAnalytics.ts      # 分析数据
├── pages/                    # 页面组件
│   ├── Dashboard.tsx        # 仪表盘
│   ├── Projects.tsx         # 项目列表
│   ├── Profile.tsx          # 用户资料
│   ├── Billing.tsx          # 账单和订阅
│   └── Settings.tsx         # 设置
├── components/
│   ├── auth/                # 认证组件
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/           # 仪表盘组件
│   ├── projects/            # 项目组件
│   └── billing/             # 账单组件
└── supabase-schema.sql      # 数据库架构
```

## 🔐 安全功能

### Row Level Security (RLS)

所有表都启用了 RLS，确保用户只能访问自己的数据：

```sql
-- 示例：Projects 表 RLS 策略
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);
```

### 数据加密

敏感数据（如 API tokens）在数据库中加密存储。

## 🎨 UI 组件

项目使用自定义的 "Neural" 主题组件：

- `NeuralButton` - 按钮
- `NeuralInput` - 输入框
- `NeuralTextArea` - 文本域
- `NeuralSwitch` - 开关
- `NeuralBadge` - 徽章
- `GlassCard` - 玻璃态卡片
- `NeuralSpinner` - 加载动画
- `NeuralModal` - 模态框

## 📊 功能模块

### 1. 仪表盘 (Dashboard)
- 统计卡片（项目、部署、AI使用）
- 6个月趋势图表
- 最近活动列表
- 快速操作入口

### 2. 项目管理 (Projects)
- 网格/列表视图切换
- 搜索和过滤
- 创建、编辑、删除项目
- 项目状态管理

### 3. 用户资料 (Profile)
- 个人信息编辑
- 头像上传
- 公司和网站信息

### 4. 账单系统 (Billing)
- 当前订阅状态
- 定价方案对比
- 使用量统计
- 升级/降级订阅
- 支付历史

### 5. 设置 (Settings)
- 账户设置
- 集成配置（Gitee/GitHub）
- 通知偏好
- 外观主题
- 危险操作（登出、删除账户）

## 🔄 状态管理

### Zustand Store

```typescript
// 认证状态
const { user, profile, setUser, setProfile } = useAuthStore();
```

### TanStack Query

```typescript
// 数据获取
const { projects, isLoading } = useProjects();
const { subscription } = useSubscription();
const { stats, trends } = useAnalytics();
```

## 🚀 部署

### 环境变量配置

确保在生产环境配置所有必要的环境变量：

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_STRIPE_PRO_PRICE_ID=
VITE_STRIPE_ENTERPRISE_PRICE_ID=
VITE_GEMINI_API_KEY=
```

### 构建

```bash
npm run build
```

### 预览

```bash
npm run preview
```

## 📝 下一步

### 需要实现的功能

1. **API 端点** - 后端 API 处理 Stripe webhook
2. **团队管理** - Team 和 TeamMembers 页面
3. **API 密钥管理** - 生成和管理 API keys
4. **项目详情页** - 文件浏览器和编辑器
5. **实时部署** - Vercel/Gitee Pages 集成
6. **通知系统** - 实时通知和提醒
7. **搜索功能** - 全局搜索
8. **文件上传** - 头像和资产上传到 Supabase Storage

### 可选增强功能

- 📱 移动端 App (React Native)
- 🔔 WebSocket 实时更新
- 📧 邮件服务集成
- 🤖 AI 聊天助手
- 📈 高级分析面板
- 🌐 多语言支持
- 🎨 主题定制
- 📊 导出报告功能

## 🐛 调试

### 查看 Supabase 日志

```bash
# 在 Supabase Dashboard 中查看
- Database > Logs
- Authentication > Logs
```

### 查看 Stripe 事件

```bash
# 在 Stripe Dashboard 中查看
- Developers > Events
- Developers > Webhooks
```

## 📚 文档参考

- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License
