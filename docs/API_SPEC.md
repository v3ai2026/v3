# API 规范文档

完整的后端 API 规范，包括所有端点的详细说明、请求/响应格式、认证要求和错误处理。

---

## 📋 目录

- [通用规范](#通用规范)
- [认证](#认证)
- [错误处理](#错误处理)
- [Projects API](#projects-api)
- [Deployments API](#deployments-api)
- [Users API](#users-api)
- [Teams API](#teams-api)
- [Tokens API](#tokens-api)
- [Stats API](#stats-api)

---

## 通用规范

### Base URL

```
开发环境: http://localhost:3000/api
生产环境: https://your-domain.com/api
```

### 响应格式

所有响应使用 JSON 格式：

```typescript
// 成功响应
{
  // 直接返回数据或数据对象
}

// 错误响应
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request" // 可选
}
```

### HTTP 状态码

| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 认证

所有需要认证的 API 通过 Supabase 进行认证。

### 认证方式

客户端通过 Supabase Auth 登录后，token 会自动存储在 cookie 中（`sb-access-token`）。

### 服务器端验证

```typescript
// server/utils/auth.ts
export async function requireAuth(event: H3Event) {
  const token = getCookie(event, 'sb-access-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
  
  return user
}
```

### 使用示例

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  // user.id 可用于后续操作
})
```

---

## 错误处理

### 标准错误格式

```typescript
{
  "statusCode": 400,
  "message": "具体错误信息",
  "error": "Bad Request"
}
```

### 常见错误

```typescript
// 401 未认证
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// 404 资源不存在
{
  "statusCode": 404,
  "message": "Project not found"
}

// 400 参数错误
{
  "statusCode": 400,
  "message": "Project name is required"
}

// 403 权限不足
{
  "statusCode": 403,
  "message": "Forbidden - You don't have access to this resource"
}
```

---

## Projects API

### 1. 获取项目列表

**端点**: `GET /api/projects`

**认证**: 需要

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| status | string | 否 | 筛选状态: `active`, `paused`, `error` |
| search | string | 否 | 搜索关键词（名称或描述） |
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页数量，默认 20 |

**请求示例**:
```http
GET /api/projects?status=active&search=web&page=1&limit=10
```

**响应**:
```json
[
  {
    "id": "clx1234567890",
    "name": "my-web-app",
    "slug": "my-web-app",
    "description": "My awesome web application",
    "repository_url": "https://github.com/user/repo",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

**实现文件**: `server/api/projects/index.get.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  
  const { status, search, page = 1, limit = 20 } = query
  
  const where: any = { userId: user.id }
  
  if (status) {
    where.status = status
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }
  
  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  })
  
  return projects
})
```

---

### 2. 创建项目

**端点**: `POST /api/projects`

**认证**: 需要

**请求体**:
```typescript
{
  name: string        // 必填，项目名称
  description?: string // 可选，项目描述
  repository_url?: string // 可选，Git 仓库地址
}
```

**请求示例**:
```json
{
  "name": "my-new-project",
  "description": "A new exciting project",
  "repository_url": "https://github.com/user/my-new-project"
}
```

**响应**:
```json
{
  "id": "clx1234567890",
  "name": "my-new-project",
  "slug": "my-new-project",
  "description": "A new exciting project",
  "repository_url": "https://github.com/user/my-new-project",
  "status": "active",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**实现文件**: `server/api/projects/index.post.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  
  // 验证
  if (!body.name || body.name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Project name is required'
    })
  }
  
  // 生成 slug
  const slug = body.name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
  
  // 创建项目
  const project = await prisma.project.create({
    data: {
      name: body.name.trim(),
      slug,
      description: body.description?.trim(),
      repository_url: body.repository_url?.trim(),
      status: 'active',
      userId: user.id
    }
  })
  
  return project
})
```

---

### 3. 获取单个项目

**端点**: `GET /api/projects/[id]`

**认证**: 需要

**路径参数**:
- `id`: 项目 ID

**请求示例**:
```http
GET /api/projects/clx1234567890
```

**响应**:
```json
{
  "id": "clx1234567890",
  "name": "my-web-app",
  "slug": "my-web-app",
  "description": "My awesome web application",
  "repository_url": "https://github.com/user/repo",
  "status": "active",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**实现文件**: `server/api/projects/[id].get.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user.id
    }
  })
  
  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found'
    })
  }
  
  return project
})
```

---

### 4. 更新项目

**端点**: `PUT /api/projects/[id]`

**认证**: 需要

**路径参数**:
- `id`: 项目 ID

**请求体**:
```typescript
{
  name?: string
  description?: string
  repository_url?: string
  status?: 'active' | 'paused' | 'error'
}
```

**请求示例**:
```json
{
  "name": "updated-project-name",
  "description": "Updated description",
  "status": "active"
}
```

**响应**:
```json
{
  "id": "clx1234567890",
  "name": "updated-project-name",
  "slug": "updated-project-name",
  "description": "Updated description",
  "repository_url": "https://github.com/user/repo",
  "status": "active",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T11:00:00.000Z"
}
```

**实现文件**: `server/api/projects/[id].put.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // 验证所有权
  const existingProject = await prisma.project.findFirst({
    where: {
      id,
      userId: user.id
    }
  })
  
  if (!existingProject) {
    throw createError({
      statusCode: 404,
      message: 'Project not found'
    })
  }
  
  // 更新数据
  const updateData: any = {}
  
  if (body.name) {
    updateData.name = body.name.trim()
    updateData.slug = body.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }
  
  if (body.description !== undefined) {
    updateData.description = body.description?.trim()
  }
  
  if (body.repository_url !== undefined) {
    updateData.repository_url = body.repository_url?.trim()
  }
  
  if (body.status) {
    updateData.status = body.status
  }
  
  const project = await prisma.project.update({
    where: { id },
    data: updateData
  })
  
  return project
})
```

---

### 5. 删除项目

**端点**: `DELETE /api/projects/[id]`

**认证**: 需要

**路径参数**:
- `id`: 项目 ID

**请求示例**:
```http
DELETE /api/projects/clx1234567890
```

**响应**:
```json
{
  "success": true
}
```

**实现文件**: `server/api/projects/[id].delete.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  
  // 验证所有权
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user.id
    }
  })
  
  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found'
    })
  }
  
  // 删除项目（级联删除相关部署）
  await prisma.project.delete({
    where: { id }
  })
  
  return { success: true }
})
```

---

## Deployments API

### 1. 获取部署列表

**端点**: `GET /api/deployments`

**认证**: 需要

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| projectId | string | 否 | 按项目筛选 |
| status | string | 否 | 按状态筛选 |
| recent | boolean | 否 | 只获取最近的（最多10条） |
| page | number | 否 | 页码 |
| limit | number | 否 | 每页数量 |

**请求示例**:
```http
GET /api/deployments?projectId=clx123&status=success
```

**响应**:
```json
[
  {
    "id": "dep_abc123",
    "project_id": "clx1234567890",
    "status": "success",
    "commit_hash": "a1b2c3d4",
    "commit_message": "Fix login bug",
    "deployed_url": "https://my-app-abc123.vercel.app",
    "created_at": "2024-01-15T10:30:00.000Z",
    "completed_at": "2024-01-15T10:35:00.000Z"
  }
]
```

**实现文件**: `server/api/deployments/index.get.ts`

---

### 2. 创建部署

**端点**: `POST /api/deployments`

**认证**: 需要

**请求体**:
```typescript
{
  project_id: string      // 必填
  commit_hash?: string    // 可选
  commit_message?: string // 可选
}
```

**响应**:
```json
{
  "id": "dep_abc123",
  "project_id": "clx1234567890",
  "status": "pending",
  "commit_hash": "a1b2c3d4",
  "commit_message": "Deploy new version",
  "deployed_url": null,
  "created_at": "2024-01-15T10:30:00.000Z",
  "completed_at": null
}
```

**实现文件**: `server/api/deployments/index.post.ts`

---

### 3. 获取部署详情

**端点**: `GET /api/deployments/[id]`

**认证**: 需要

**响应**:
```json
{
  "id": "dep_abc123",
  "project_id": "clx1234567890",
  "status": "success",
  "commit_hash": "a1b2c3d4",
  "commit_message": "Fix login bug",
  "deployed_url": "https://my-app-abc123.vercel.app",
  "created_at": "2024-01-15T10:30:00.000Z",
  "completed_at": "2024-01-15T10:35:00.000Z"
}
```

**实现文件**: `server/api/deployments/[id].get.ts`

---

### 4. 更新部署状态

**端点**: `PUT /api/deployments/[id]/status`

**认证**: 需要

**请求体**:
```typescript
{
  status: 'pending' | 'building' | 'success' | 'failed'
  deployed_url?: string // 成功时提供
}
```

**响应**:
```json
{
  "id": "dep_abc123",
  "project_id": "clx1234567890",
  "status": "success",
  "deployed_url": "https://my-app-abc123.vercel.app",
  "completed_at": "2024-01-15T10:35:00.000Z"
}
```

**实现文件**: `server/api/deployments/[id]/status.put.ts`

---

## Users API

### 1. 获取用户信息

**端点**: `GET /api/users/profile`

**认证**: 需要

**响应**:
```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**实现文件**: `server/api/users/profile.get.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // 从 Supabase 获取用户信息
  const { data, error } = await supabase.auth.getUser(user.id)
  
  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user profile'
    })
  }
  
  return {
    id: data.user.id,
    email: data.user.email,
    full_name: data.user.user_metadata?.full_name,
    avatar_url: data.user.user_metadata?.avatar_url,
    created_at: data.user.created_at
  }
})
```

---

### 2. 更新用户信息

**端点**: `PUT /api/users/profile`

**认证**: 需要

**请求体**:
```typescript
{
  full_name?: string
  avatar_url?: string
}
```

**响应**:
```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "full_name": "John Doe Updated",
  "avatar_url": "https://...",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**实现文件**: `server/api/users/profile.put.ts`

---

## Teams API

### 1. 获取团队列表

**端点**: `GET /api/teams`

**认证**: 需要

**响应**: `Team[]`

**实现文件**: `server/api/teams/index.get.ts`

---

### 2. 创建团队

**端点**: `POST /api/teams`

**认证**: 需要

**请求体**:
```typescript
{
  name: string
  description?: string
}
```

**实现文件**: `server/api/teams/index.post.ts`

---

### 3-5. 团队成员管理

详见 ROUTES_COMPLETE.md

---

## Tokens API

### 1. 获取 Token 列表

**端点**: `GET /api/tokens`

**认证**: 需要

**响应**:
```json
[
  {
    "id": "tok_123",
    "name": "CI/CD Token",
    "last_used_at": "2024-01-15T10:00:00.000Z",
    "expires_at": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

注意：响应中**不包含** token 值，只在创建时返回一次。

**实现文件**: `server/api/tokens/index.get.ts`

---

### 2. 创建 Token

**端点**: `POST /api/tokens`

**认证**: 需要

**请求体**:
```typescript
{
  name: string
  expires_at?: string // ISO 8601 格式
}
```

**响应**:
```json
{
  "id": "tok_123",
  "name": "CI/CD Token",
  "token": "nova_abc123def456...", // 只在创建时返回！
  "expires_at": null,
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

**实现文件**: `server/api/tokens/index.post.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  
  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Token name is required'
    })
  }
  
  // 生成随机 token
  const tokenValue = 'nova_' + randomBytes(32).toString('hex')
  
  // 存储加密后的 token
  const hashedToken = await hash(tokenValue)
  
  const token = await prisma.apiToken.create({
    data: {
      userId: user.id,
      name: body.name,
      token: hashedToken,
      expiresAt: body.expires_at ? new Date(body.expires_at) : null
    }
  })
  
  return {
    ...token,
    token: tokenValue // 只在这里返回明文 token
  }
})
```

---

### 3. 删除 Token

**端点**: `DELETE /api/tokens/[id]`

**认证**: 需要

**响应**:
```json
{
  "success": true
}
```

**实现文件**: `server/api/tokens/[id].delete.ts`

---

## Stats API

### 获取统计概览

**端点**: `GET /api/stats/overview`

**认证**: 需要

**响应**:
```json
{
  "totalProjects": 24,
  "activeDeployments": 8,
  "successRate": 98.5,
  "totalDeploys": 342
}
```

**实现文件**: `server/api/stats/overview.get.ts`

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // 获取项目总数
  const totalProjects = await prisma.project.count({
    where: { userId: user.id }
  })
  
  // 获取活跃部署数
  const activeDeployments = await prisma.deployment.count({
    where: {
      project: { userId: user.id },
      status: { in: ['pending', 'building'] }
    }
  })
  
  // 获取总部署数
  const totalDeploys = await prisma.deployment.count({
    where: {
      project: { userId: user.id }
    }
  })
  
  // 计算成功率
  const successfulDeploys = await prisma.deployment.count({
    where: {
      project: { userId: user.id },
      status: 'success'
    }
  })
  
  const successRate = totalDeploys > 0 
    ? (successfulDeploys / totalDeploys) * 100 
    : 0
  
  return {
    totalProjects,
    activeDeployments,
    successRate: Math.round(successRate * 10) / 10,
    totalDeploys
  }
})
```

---

## 📝 实现优先级

### 高优先级（必须实现）

1. ✅ `GET /api/health` - 已实现
2. ❌ `GET /api/projects`
3. ❌ `POST /api/projects`
4. ❌ `GET /api/projects/[id]`
5. ❌ `PUT /api/projects/[id]`
6. ❌ `DELETE /api/projects/[id]`
7. ❌ `GET /api/deployments`
8. ❌ `POST /api/deployments`
9. ❌ `GET /api/deployments/[id]`
10. ❌ `GET /api/stats/overview`

### 中优先级

11. ❌ `GET /api/users/profile`
12. ❌ `PUT /api/users/profile`
13. ❌ `GET /api/tokens`
14. ❌ `POST /api/tokens`
15. ❌ `DELETE /api/tokens/[id]`

### 低优先级

16. ❌ Teams API（5个端点）
17. ❌ `PUT /api/deployments/[id]/status`

---

## 🔒 安全注意事项

1. **认证**: 所有 API 必须验证用户身份
2. **授权**: 验证用户只能访问自己的资源
3. **输入验证**: 验证所有用户输入
4. **SQL 注入**: 使用 Prisma ORM 防止 SQL 注入
5. **速率限制**: 考虑添加 API 速率限制（未来）
6. **Token 安全**: API Token 使用加密存储
7. **敏感数据**: 密码、token 等敏感数据不应出现在日志中

---

## 📊 数据库关系

```
User (1) ─── (N) Project
Project (1) ─── (N) Deployment
User (1) ─── (N) ApiToken
User (1) ─── (N) Team
Team (1) ─── (N) TeamMember
```

---

## 🎯 测试建议

### 单元测试

- 测试认证中间件
- 测试数据验证
- 测试错误处理

### 集成测试

- 测试完整的 CRUD 流程
- 测试权限验证
- 测试边界情况

### 测试工具

- Vitest
- Supertest
- Prisma Test Helpers
