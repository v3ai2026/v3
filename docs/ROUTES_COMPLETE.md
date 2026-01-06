# 完整路由清单

## 🌐 多页面应用架构

本项目是 **Nuxt 3 多页面应用**，使用文件系统路由自动生成所有路由。

## 📄 所有页面路由（17个）

### 公开路由（无需登录）

#### 1. `/` - 首页/落地页
- **文件**: `pages/index.vue`
- **状态**: ✅ 已实现
- **功能**: 产品介绍、特性展示、注册入口
- **布局**: 无布局（独立页面）
- **数据**: 静态内容

#### 2. `/login` - 登录页
- **文件**: `pages/login.vue`
- **状态**: ✅ 已实现
- **功能**: 用户登录
- **使用的 Composables**: 
  - `useAuth()` - 登录逻辑
  - `useNotification()` - 显示错误/成功消息
- **API 调用**: Supabase Auth
- **跳转**: 成功后跳转到 `/dashboard`

#### 3. `/signup` - 注册页
- **文件**: `pages/signup.vue`
- **状态**: ✅ 已实现
- **功能**: 用户注册
- **使用的 Composables**: 
  - `useAuth()` - 注册逻辑
  - `useNotification()` - 显示消息
- **API 调用**: Supabase Auth
- **跳转**: 成功后跳转到 `/onboarding`

#### 4. `/onboarding` - 新用户引导
- **文件**: `pages/onboarding.vue`
- **状态**: ✅ 已实现
- **功能**: 创建组织/工作区
- **使用的 Composables**: 
  - `useAuth()` - 获取用户信息
  - `useNotification()` - 显示消息
- **跳转**: 完成后跳转到 `/dashboard`

---

### 认证路由（需要登录）

#### 5. `/dashboard` - 控制面板
- **文件**: `pages/dashboard.vue`
- **状态**: ✅ 已实现（使用模拟数据）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 显示项目统计
  - 显示最近部署
  - 快速操作入口
- **需要的 Composables**:
  - ✅ `useAuth()` - 获取当前用户
  - ❌ `useProjects()` - 获取项目列表和统计
  - ❌ `useDeployments()` - 获取最近部署
  - ✅ `useNotification()` - 消息提示
- **需要的 API**:
  - `GET /api/projects` - 获取用户项目
  - `GET /api/deployments?recent=true` - 获取最近部署
  - `GET /api/stats/overview` - 获取统计数据

#### 6. `/projects` - 项目列表
- **文件**: `pages/projects/index.vue`
- **状态**: ✅ 已实现（使用模拟数据）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 显示所有项目
  - 搜索和筛选
  - 创建新项目入口
- **需要的 Composables**:
  - ❌ `useProjects()` - CRUD 操作
  - ✅ `usePagination()` - 分页
  - ✅ `useNotification()` - 消息
- **需要的 API**:
  - `GET /api/projects` - 获取项目列表
  - `DELETE /api/projects/[id]` - 删除项目

#### 7. `/projects/new` - 创建新项目
- **文件**: `pages/projects/new.vue`
- **状态**: ❌ 缺失（需要创建）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 创建新项目表单
  - 连接 Git 仓库
  - 配置构建设置
- **需要的 Composables**:
  - ❌ `useProjects()` - 创建项目
  - ✅ `useForm()` - 表单验证
  - ✅ `useNotification()` - 消息
- **需要的 API**:
  - `POST /api/projects` - 创建项目

#### 8. `/projects/[id]` - 项目详情
- **文件**: `pages/projects/[id].vue`
- **状态**: ✅ 已实现（使用模拟数据）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 显示项目详情
  - 显示部署历史
  - 部署操作
- **需要的 Composables**:
  - ❌ `useProjects()` - 获取项目详情
  - ❌ `useDeployments()` - 获取部署列表、创建部署
  - ✅ `useNotification()` - 消息
- **需要的 API**:
  - `GET /api/projects/[id]` - 获取项目详情
  - `GET /api/deployments?projectId=[id]` - 获取项目部署
  - `POST /api/deployments` - 创建新部署

#### 9. `/projects/[id]/settings` - 项目设置
- **文件**: `pages/projects/[id]/settings.vue`
- **状态**: ✅ 已实现（使用模拟数据）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 编辑项目信息
  - 环境变量配置
  - 域名设置
  - 删除项目
- **需要的 Composables**:
  - ❌ `useProjects()` - 更新/删除项目
  - ✅ `useForm()` - 表单验证
  - ✅ `useModal()` - 确认对话框
  - ✅ `useNotification()` - 消息
- **需要的 API**:
  - `GET /api/projects/[id]` - 获取项目详情
  - `PUT /api/projects/[id]` - 更新项目
  - `DELETE /api/projects/[id]` - 删除项目

#### 10. `/projects/[id]/deployments/[deploymentId]` - 部署详情
- **文件**: `pages/projects/[id]/deployments/[deploymentId].vue`
- **状态**: ✅ 已实现（使用模拟数据）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 显示部署详情
  - 构建日志
  - 部署状态
- **需要的 Composables**:
  - ❌ `useDeployments()` - 获取部署详情
- **需要的 API**:
  - `GET /api/deployments/[id]` - 获取部署详情

#### 11. `/deployments` - 所有部署
- **文件**: `pages/deployments/index.vue`
- **状态**: ❌ 缺失（需要创建）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 显示所有部署历史
  - 筛选和搜索
- **需要的 Composables**:
  - ❌ `useDeployments()` - 获取部署列表
  - ✅ `usePagination()` - 分页
- **需要的 API**:
  - `GET /api/deployments` - 获取所有部署

#### 12. `/activity` - 活动日志
- **文件**: `pages/activity/index.vue`
- **状态**: ❌ 缺失（需要创建）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 显示所有活动记录
  - 时间线视图
- **需要的 Composables**:
  - ❌ `useActivity()` - 获取活动记录
- **需要的 API**:
  - `GET /api/activity` - 获取活动记录

#### 13. `/team` - 团队管理
- **文件**: `pages/team/index.vue`
- **状态**: ❌ 缺失（需要创建）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 显示团队成员
  - 邀请成员
  - 管理角色
- **需要的 Composables**:
  - ❌ `useTeams()` - 团队 CRUD
- **需要的 API**:
  - `GET /api/teams` - 获取团队
  - `POST /api/teams/[id]/members` - 添加成员
  - `DELETE /api/teams/[id]/members/[memberId]` - 移除成员

#### 14. `/settings` - 设置首页
- **文件**: `pages/settings/index.vue`
- **状态**: ❌ 缺失（需要创建）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 设置导航
  - 重定向到子页面

#### 15. `/settings/profile` - 个人资料设置
- **文件**: `pages/settings/profile.vue`
- **状态**: ✅ 已实现（使用模拟数据）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 编辑个人信息
  - 修改密码
  - 头像上传
- **需要的 Composables**:
  - ✅ `useAuth()` - 获取/更新用户信息
  - ✅ `useForm()` - 表单验证
  - ✅ `useNotification()` - 消息
- **需要的 API**:
  - `GET /api/users/profile` - 获取用户信息
  - `PUT /api/users/profile` - 更新用户信息

#### 16. `/settings/tokens` - API Token 管理
- **文件**: `pages/settings/tokens.vue`
- **状态**: ✅ 已实现（使用模拟数据）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 显示 Token 列表
  - 创建新 Token
  - 删除 Token
- **需要的 Composables**:
  - ❌ `useApiTokens()` - Token CRUD
  - ✅ `useModal()` - 创建对话框
  - ✅ `useNotification()` - 消息
- **需要的 API**:
  - `GET /api/tokens` - 获取 Token 列表
  - `POST /api/tokens` - 创建 Token
  - `DELETE /api/tokens/[id]` - 删除 Token

#### 17. `/products/3d-viewer` - 3D 产品查看器
- **文件**: `pages/products/3d-viewer.vue`
- **状态**: ❌ 缺失（需要创建）
- **布局**: `layouts/default.vue`
- **中间件**: `middleware/auth.ts`
- **功能**: 
  - 3D 模型展示
  - AR 支持
  - 产品切换
- **需要的 Composables**:
  - ❌ `use3DModel()` - 3D 模型加载
  - ❌ `useAR()` - AR 功能
- **依赖**: Three.js

---

## 🎣 所有 Composables（钩子）清单

### 已实现的 Composables（6个）

1. ✅ **`composables/useAuth.ts`** - 认证管理
   - `user` - 当前用户 (ref)
   - `signIn(email, password)` - 登录
   - `signUp(email, password, fullName)` - 注册
   - `signOut()` - 登出

2. ✅ **`composables/useNotification.ts`** - 通知消息
   - `notifications` - 通知列表 (ref)
   - `success(title, message?)` - 成功消息
   - `error(title, message?)` - 错误消息
   - `warning(title, message?)` - 警告消息
   - `info(title, message?)` - 信息消息
   - `removeNotification(id)` - 移除通知

3. ✅ **`composables/useModal.ts`** - 模态框
   - `isOpen` - 模态框状态 (ref)
   - `open()` - 打开模态框
   - `close()` - 关闭模态框
   - `toggle()` - 切换模态框

4. ✅ **`composables/useTheme.ts`** - 主题切换
   - `theme` - 当前主题 (ref)
   - `isDark` - 是否暗色主题 (computed)
   - `toggleTheme()` - 切换主题
   - `setTheme(theme)` - 设置主题

5. ✅ **`composables/useForm.ts`** - 表单验证
   - `registerField(name, initialValue, validators)` - 注册字段
   - `setValue(name, value)` - 设置值
   - `validateAll()` - 验证所有字段
   - `getValues()` - 获取所有值
   - `reset()` - 重置表单

6. ✅ **`composables/usePagination.ts`** - 分页
   - `currentPage` - 当前页码 (ref)
   - `totalPages` - 总页数 (computed)
   - `nextPage()` - 下一页
   - `previousPage()` - 上一页
   - `goToPage(page)` - 跳转到指定页

### 需要新增的 Composables（6个）

7. ❌ **`composables/useProjects.ts`** - 项目管理
   - `projects` - 项目列表 (ref)
   - `loading` - 加载状态 (ref)
   - `fetchProjects()` - 获取项目列表
   - `fetchProject(id)` - 获取单个项目
   - `createProject(data)` - 创建项目
   - `updateProject(id, data)` - 更新项目
   - `deleteProject(id)` - 删除项目

8. ❌ **`composables/useDeployments.ts`** - 部署管理
   - `deployments` - 部署列表 (ref)
   - `loading` - 加载状态 (ref)
   - `fetchDeployments(projectId?)` - 获取部署列表
   - `fetchDeployment(id)` - 获取部署详情
   - `createDeployment(projectId, data)` - 创建部署
   - `updateDeploymentStatus(id, status)` - 更新状态

9. ❌ **`composables/useTeams.ts`** - 团队管理
   - `teams` - 团队列表 (ref)
   - `loading` - 加载状态 (ref)
   - `fetchTeams()` - 获取团队列表
   - `createTeam(data)` - 创建团队
   - `addMember(teamId, userId, role)` - 添加成员
   - `removeMember(teamId, memberId)` - 移除成员

10. ❌ **`composables/useApiTokens.ts`** - Token 管理
    - `tokens` - Token 列表 (ref)
    - `loading` - 加载状态 (ref)
    - `fetchTokens()` - 获取 Token 列表
    - `createToken(name)` - 创建 Token
    - `deleteToken(id)` - 删除 Token

11. ❌ **`composables/use3DModel.ts`** - 3D 模型
    - `scene` - Three.js 场景 (ref)
    - `loadModel(url, container)` - 加载 3D 模型
    - `animate()` - 动画循环
    - `dispose()` - 清理资源

12. ❌ **`composables/useAR.ts`** - AR 功能
    - `isARSupported` - AR 支持状态 (ref)
    - `checkARSupport()` - 检测 AR 支持
    - `startARSession(modelUrl)` - 启动 AR

---

## 🔌 后端 API 端点清单（21个）

### 已实现的 API（1个）

1. ✅ **`GET /api/health`** - 健康检查
   - **文件**: `server/api/health.get.ts`
   - **功能**: 检查数据库连接状态
   - **响应**: 
     ```json
     {
       "status": "ok",
       "database": "connected",
       "timestamp": "...",
       "version": "..."
     }
     ```

### 需要实现的 API（20个）

#### Projects API（5个）

2. ❌ **`GET /api/projects`** - 获取用户所有项目
   - **文件**: `server/api/projects/index.get.ts`
   - **认证**: 需要
   - **查询参数**: 
     - `status?` - 按状态筛选
     - `search?` - 搜索关键词
   - **响应**: `Project[]`

3. ❌ **`POST /api/projects`** - 创建新项目
   - **文件**: `server/api/projects/index.post.ts`
   - **认证**: 需要
   - **请求体**: 
     ```typescript
     {
       name: string
       description?: string
       repository_url?: string
     }
     ```
   - **响应**: `Project`

4. ❌ **`GET /api/projects/[id]`** - 获取项目详情
   - **文件**: `server/api/projects/[id].get.ts`
   - **认证**: 需要
   - **响应**: `Project`

5. ❌ **`PUT /api/projects/[id]`** - 更新项目
   - **文件**: `server/api/projects/[id].put.ts`
   - **认证**: 需要
   - **请求体**: `Partial<Project>`
   - **响应**: `Project`

6. ❌ **`DELETE /api/projects/[id]`** - 删除项目
   - **文件**: `server/api/projects/[id].delete.ts`
   - **认证**: 需要
   - **响应**: `{ success: boolean }`

#### Deployments API（4个）

7. ❌ **`GET /api/deployments`** - 获取部署列表
   - **文件**: `server/api/deployments/index.get.ts`
   - **认证**: 需要
   - **查询参数**: 
     - `projectId?` - 按项目筛选
     - `status?` - 按状态筛选
     - `recent?` - 只获取最近的
   - **响应**: `Deployment[]`

8. ❌ **`POST /api/deployments`** - 创建新部署
   - **文件**: `server/api/deployments/index.post.ts`
   - **认证**: 需要
   - **请求体**: 
     ```typescript
     {
       project_id: string
       commit_hash?: string
       commit_message?: string
     }
     ```
   - **响应**: `Deployment`

9. ❌ **`GET /api/deployments/[id]`** - 获取部署详情
   - **文件**: `server/api/deployments/[id].get.ts`
   - **认证**: 需要
   - **响应**: `Deployment`

10. ❌ **`PUT /api/deployments/[id]/status`** - 更新部署状态
    - **文件**: `server/api/deployments/[id]/status.put.ts`
    - **认证**: 需要
    - **请求体**: 
      ```typescript
      {
        status: 'pending' | 'building' | 'success' | 'failed'
      }
      ```
    - **响应**: `Deployment`

#### Users API（2个）

11. ❌ **`GET /api/users/profile`** - 获取用户信息
    - **文件**: `server/api/users/profile.get.ts`
    - **认证**: 需要
    - **响应**: `User`

12. ❌ **`PUT /api/users/profile`** - 更新用户信息
    - **文件**: `server/api/users/profile.put.ts`
    - **认证**: 需要
    - **请求体**: 
      ```typescript
      {
        full_name?: string
        avatar_url?: string
      }
      ```
    - **响应**: `User`

#### Teams API（5个）

13. ❌ **`GET /api/teams`** - 获取用户团队
    - **文件**: `server/api/teams/index.get.ts`
    - **认证**: 需要
    - **响应**: `Team[]`

14. ❌ **`POST /api/teams`** - 创建团队
    - **文件**: `server/api/teams/index.post.ts`
    - **认证**: 需要
    - **请求体**: 
      ```typescript
      {
        name: string
        description?: string
      }
      ```
    - **响应**: `Team`

15. ❌ **`GET /api/teams/[id]/members`** - 获取团队成员
    - **文件**: `server/api/teams/[id]/members.get.ts`
    - **认证**: 需要
    - **响应**: `TeamMember[]`

16. ❌ **`POST /api/teams/[id]/members`** - 添加成员
    - **文件**: `server/api/teams/[id]/members.post.ts`
    - **认证**: 需要（需要管理员权限）
    - **请求体**: 
      ```typescript
      {
        email: string
        role: 'admin' | 'member'
      }
      ```
    - **响应**: `TeamMember`

17. ❌ **`DELETE /api/teams/[id]/members/[memberId]`** - 移除成员
    - **文件**: `server/api/teams/[id]/members/[memberId].delete.ts`
    - **认证**: 需要（需要管理员权限）
    - **响应**: `{ success: boolean }`

#### Tokens API（3个）

18. ❌ **`GET /api/tokens`** - 获取 Token 列表
    - **文件**: `server/api/tokens/index.get.ts`
    - **认证**: 需要
    - **响应**: `ApiToken[]`

19. ❌ **`POST /api/tokens`** - 创建 Token
    - **文件**: `server/api/tokens/index.post.ts`
    - **认证**: 需要
    - **请求体**: 
      ```typescript
      {
        name: string
        expires_at?: string
      }
      ```
    - **响应**: 
      ```typescript
      {
        id: string
        name: string
        token: string // 只在创建时返回
        created_at: string
      }
      ```

20. ❌ **`DELETE /api/tokens/[id]`** - 删除 Token
    - **文件**: `server/api/tokens/[id].delete.ts`
    - **认证**: 需要
    - **响应**: `{ success: boolean }`

#### Stats API（1个）

21. ❌ **`GET /api/stats/overview`** - 获取统计数据
    - **文件**: `server/api/stats/overview.get.ts`
    - **认证**: 需要
    - **响应**: 
      ```typescript
      {
        totalProjects: number
        activeDeployments: number
        successRate: number
        totalDeploys: number
      }
      ```

---

## 🗄️ 数据库模型（Prisma Schema）

### 已有模型（2个）

- ✅ **User** - 用户模型
  ```prisma
  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    name      String?
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")
    projects  Project[]
  }
  ```

- ✅ **Project** - 项目模型
  ```prisma
  model Project {
    id          String   @id @default(cuid())
    name        String
    description String?
    userId      String   @map("user_id")
    user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    createdAt   DateTime @default(now()) @map("created_at")
    updatedAt   DateTime @updatedAt @map("updated_at")
  }
  ```

### 需要添加的模型（4个）

- ❌ **Deployment** - 部署模型
  ```prisma
  model Deployment {
    id             String   @id @default(cuid())
    projectId      String   @map("project_id")
    project        Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
    status         String   // 'pending' | 'building' | 'success' | 'failed'
    commitHash     String?  @map("commit_hash")
    commitMessage  String?  @map("commit_message")
    deployedUrl    String?  @map("deployed_url")
    createdAt      DateTime @default(now()) @map("created_at")
    completedAt    DateTime? @map("completed_at")
    
    @@map("deployments")
  }
  ```

- ❌ **Team** - 团队模型
  ```prisma
  model Team {
    id          String   @id @default(cuid())
    name        String
    description String?
    ownerId     String   @map("owner_id")
    owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
    members     TeamMember[]
    createdAt   DateTime @default(now()) @map("created_at")
    updatedAt   DateTime @updatedAt @map("updated_at")
    
    @@map("teams")
  }
  ```

- ❌ **TeamMember** - 团队成员模型
  ```prisma
  model TeamMember {
    id        String   @id @default(cuid())
    teamId    String   @map("team_id")
    team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
    userId    String   @map("user_id")
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    role      String   // 'admin' | 'member'
    createdAt DateTime @default(now()) @map("created_at")
    
    @@unique([teamId, userId])
    @@map("team_members")
  }
  ```

- ❌ **ApiToken** - API Token 模型
  ```prisma
  model ApiToken {
    id          String    @id @default(cuid())
    userId      String    @map("user_id")
    user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
    name        String
    token       String    @unique
    lastUsedAt  DateTime? @map("last_used_at")
    expiresAt   DateTime? @map("expires_at")
    createdAt   DateTime  @default(now()) @map("created_at")
    
    @@map("api_tokens")
  }
  ```

---

## 🔐 中间件

- ✅ **`middleware/auth.ts`** - 认证中间件
  - 已存在并正常工作
  - 检查用户是否已登录
  - 未登录时重定向到 `/login`

---

## 📊 完成度统计

- **页面路由**: 11/17 完成（65%）
- **Composables**: 6/12 完成（50%）
- **API 端点**: 1/21 完成（5%）
- **数据库模型**: 2/6 完成（33%）

**总体完成度**: 约 40%

---

## 🎯 下一步行动计划

### 优先级 1（核心功能）
1. 扩展 Prisma 数据库模型（添加 Deployment、Team、TeamMember、ApiToken）
2. 实现所有项目相关 API（5个端点）
3. 创建 `useProjects` composable
4. 更新项目相关页面使用真实 API

### 优先级 2（部署功能）
1. 实现部署相关 API（4个端点）
2. 创建 `useDeployments` composable
3. 更新部署相关页面
4. 创建缺失的 `/projects/new` 页面

### 优先级 3（其他功能）
1. 实现团队、Token、用户 API
2. 创建对应 composables（`useTeams`, `useApiTokens`）
3. 创建缺失页面（`/deployments`, `/activity`, `/team`, `/settings`）
4. 添加 3D 功能（低优先级）

---

## 📝 注意事项

1. **认证**: 所有认证路由的 API 都需要验证 Supabase token
2. **权限**: 用户只能访问自己的资源（项目、部署、Token）
3. **数据验证**: 所有 API 输入需要验证
4. **错误处理**: 统一的错误响应格式
5. **分页**: 列表 API 应支持分页
6. **搜索和筛选**: 列表 API 应支持基本的搜索和筛选功能
