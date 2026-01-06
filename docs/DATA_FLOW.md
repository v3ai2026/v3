# 数据流和钩子连接

## 🔄 完整数据流

```
用户操作（页面）
    ↓
Composable 钩子（useProjects, useDeployments...）
    ↓ $fetch()
API 路由（/api/projects, /api/deployments...）
    ↓ defineEventHandler
认证中间件（验证 Supabase token）
    ↓
Prisma ORM（prisma.project.findMany()）
    ↓
PostgreSQL 数据库（Neon）
    ↓
返回数据
    ↓
Composable 更新 ref 状态
    ↓
页面自动响应式更新
```

## 📋 具体示例

### 示例 1: 获取项目列表

```typescript
// 1. 页面调用
// pages/projects/index.vue
const { projects, loading, fetchProjects } = useProjects()
await fetchProjects()

// 2. Composable 发起请求
// composables/useProjects.ts
const fetchProjects = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/projects')
    projects.value = data
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    throw error
  } finally {
    loading.value = false
  }
}

// 3. API 处理请求
// server/api/projects/index.get.ts
export default defineEventHandler(async (event) => {
  // 验证用户认证
  const user = await requireAuth(event)
  
  // 获取查询参数
  const query = getQuery(event)
  const { status, search } = query
  
  // 构建查询条件
  const where: any = { userId: user.id }
  if (status) where.status = status
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } }
    ]
  }
  
  // 查询数据库
  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })
  
  return projects
})

// 4. 页面自动更新
// projects 是响应式 ref，页面自动显示数据
<div v-for="project in projects" :key="project.id">
  <ProjectCard :project="project" />
</div>
```

### 示例 2: 创建项目

```typescript
// 1. 页面调用
// pages/projects/new.vue
const { createProject } = useProjects()
const { success, error } = useNotification()

const handleSubmit = async () => {
  try {
    const newProject = await createProject(formData)
    success('项目创建成功')
    navigateTo(`/projects/${newProject.id}`)
  } catch (e) {
    error('创建失败', e.message)
  }
}

// 2. Composable 发起请求
// composables/useProjects.ts
const createProject = async (data: CreateProjectData) => {
  loading.value = true
  try {
    const project = await $fetch('/api/projects', {
      method: 'POST',
      body: data
    })
    
    // 添加到本地列表
    projects.value.unshift(project)
    
    return project
  } catch (error) {
    console.error('Failed to create project:', error)
    throw error
  } finally {
    loading.value = false
  }
}

// 3. API 处理请求
// server/api/projects/index.post.ts
export default defineEventHandler(async (event) => {
  // 验证用户认证
  const user = await requireAuth(event)
  
  // 读取请求体
  const body = await readBody(event)
  
  // 验证输入
  if (!body.name || body.name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Project name is required'
    })
  }
  
  // 创建项目
  const project = await prisma.project.create({
    data: {
      name: body.name.trim(),
      description: body.description?.trim(),
      repository_url: body.repository_url?.trim(),
      status: 'active',
      userId: user.id
    }
  })
  
  return project
})

// 4. 页面跳转到新项目
navigateTo(`/projects/${newProject.id}`)
```

### 示例 3: 创建部署

```typescript
// 1. 页面调用
// pages/projects/[id].vue
const { createDeployment } = useDeployments()
const { success, error } = useNotification()

const handleDeploy = async () => {
  try {
    const deployment = await createDeployment(projectId, {
      commit_hash: latestCommit.hash,
      commit_message: latestCommit.message
    })
    success('部署已启动')
    // 实时更新部署状态
    watchDeploymentStatus(deployment.id)
  } catch (e) {
    error('部署失败', e.message)
  }
}

// 2. Composable 发起请求
// composables/useDeployments.ts
const createDeployment = async (projectId: string, data: CreateDeploymentData) => {
  loading.value = true
  try {
    const deployment = await $fetch('/api/deployments', {
      method: 'POST',
      body: {
        project_id: projectId,
        ...data
      }
    })
    
    // 添加到本地列表
    deployments.value.unshift(deployment)
    
    return deployment
  } catch (error) {
    console.error('Failed to create deployment:', error)
    throw error
  } finally {
    loading.value = false
  }
}

// 3. API 处理请求
// server/api/deployments/index.post.ts
export default defineEventHandler(async (event) => {
  // 验证用户认证
  const user = await requireAuth(event)
  
  // 读取请求体
  const body = await readBody(event)
  
  // 验证项目所有权
  const project = await prisma.project.findFirst({
    where: {
      id: body.project_id,
      userId: user.id
    }
  })
  
  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found'
    })
  }
  
  // 创建部署
  const deployment = await prisma.deployment.create({
    data: {
      projectId: body.project_id,
      status: 'pending',
      commitHash: body.commit_hash,
      commitMessage: body.commit_message
    }
  })
  
  // 触发实际部署流程（异步）
  // triggerDeploymentProcess(deployment.id)
  
  return deployment
})

// 4. 实时监控部署状态
const watchDeploymentStatus = (deploymentId: string) => {
  const interval = setInterval(async () => {
    const deployment = await fetchDeployment(deploymentId)
    if (deployment.status === 'success' || deployment.status === 'failed') {
      clearInterval(interval)
      if (deployment.status === 'success') {
        success('部署成功', `可访问: ${deployment.deployed_url}`)
      } else {
        error('部署失败')
      }
    }
  }, 5000) // 每5秒检查一次
}
```

### 示例 4: 删除项目（带权限验证）

```typescript
// 1. 页面调用
// pages/projects/index.vue
const { deleteProject } = useProjects()
const { success, error } = useNotification()
const { isOpen, open, close } = useModal()

const handleDelete = async (project: Project) => {
  // 先显示确认对话框
  deleteModal.project = project
  deleteModal.isOpen = true
}

const confirmDelete = async () => {
  try {
    await deleteProject(deleteModal.project.id)
    success('项目已删除')
    deleteModal.isOpen = false
  } catch (e) {
    error('删除失败', e.message)
  }
}

// 2. Composable 发起请求
// composables/useProjects.ts
const deleteProject = async (id: string) => {
  loading.value = true
  try {
    await $fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
    
    // 从本地列表移除
    projects.value = projects.value.filter(p => p.id !== id)
  } catch (error) {
    console.error('Failed to delete project:', error)
    throw error
  } finally {
    loading.value = false
  }
}

// 3. API 处理请求
// server/api/projects/[id].delete.ts
export default defineEventHandler(async (event) => {
  // 验证用户认证
  const user = await requireAuth(event)
  
  // 获取项目 ID
  const id = getRouterParam(event, 'id')
  
  // 验证项目所有权
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user.id
    }
  })
  
  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found or unauthorized'
    })
  }
  
  // 删除项目（级联删除相关部署）
  await prisma.project.delete({
    where: { id }
  })
  
  return { success: true }
})

// 4. 页面更新
// projects ref 自动移除已删除项目，页面重新渲染
```

---

## 🎣 所有钩子的使用场景

| Composable | 使用页面 | 主要功能 | 依赖的 API |
|------------|---------|---------|-----------|
| **useAuth** | login, signup, 所有页面 | 登录、注册、获取当前用户 | Supabase Auth |
| **useProjects** | projects/*, dashboard | 项目 CRUD | `/api/projects/*` |
| **useDeployments** | projects/[id], deployments/* | 部署管理 | `/api/deployments/*` |
| **useTeams** | team/* | 团队管理 | `/api/teams/*` |
| **useApiTokens** | settings/tokens | Token 管理 | `/api/tokens/*` |
| **useNotification** | 所有页面 | 消息提示 | 无（纯前端） |
| **useModal** | 需要确认的操作 | 对话框 | 无（纯前端） |
| **useTheme** | 所有页面 | 主题切换 | 无（纯前端） |
| **useForm** | 所有表单页面 | 表单验证 | 无（纯前端） |
| **usePagination** | 列表页面 | 分页 | 无（纯前端） |
| **use3DModel** | products/3d-viewer | 3D 渲染 | 无（Three.js） |
| **useAR** | products/3d-viewer | AR 功能 | 无（WebXR） |

---

## 🔐 认证流程

### 1. 登录流程

```typescript
// 页面: pages/login.vue
const { signIn } = useAuth()
const { success, error } = useNotification()

const handleLogin = async () => {
  try {
    await signIn(email.value, password.value)
    success('登录成功')
    navigateTo('/dashboard')
  } catch (e) {
    error('登录失败', e.message)
  }
}

// Composable: composables/useAuth.ts
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

// 认证后，user 状态自动更新
const user = useSupabaseUser() // 响应式

// 中间件自动保护路由
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  
  if (!user.value) {
    return navigateTo('/login')
  }
})
```

### 2. API 认证

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
  
  // 验证 token 并获取用户
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
  
  return user
}

// 在所有 API 中使用
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // user.id 可用于查询用户资源
})
```

---

## 📊 状态管理模式

### Composable 状态管理

所有 Composables 使用 `useState` 实现全局状态共享：

```typescript
// composables/useProjects.ts
export const useProjects = () => {
  // 全局共享状态
  const projects = useState<Project[]>('projects', () => [])
  const loading = useState<boolean>('projects-loading', () => false)
  
  // 只在需要时获取数据
  const fetchProjects = async () => {
    if (projects.value.length > 0) {
      return // 已有数据，不重复获取
    }
    
    loading.value = true
    try {
      const data = await $fetch('/api/projects')
      projects.value = data
    } finally {
      loading.value = false
    }
  }
  
  return {
    projects: readonly(projects), // 只读，防止直接修改
    loading: readonly(loading),
    fetchProjects,
    // ... 其他方法
  }
}

// 在多个组件中使用相同状态
// pages/dashboard.vue
const { projects, fetchProjects } = useProjects()
await fetchProjects() // 首次获取

// pages/projects/index.vue
const { projects } = useProjects()
// projects 已有数据，无需重新获取
```

---

## 🔄 数据同步策略

### 1. 乐观更新

```typescript
// 立即更新 UI，后台同步
const updateProject = async (id: string, data: UpdateProjectData) => {
  // 1. 保存旧数据
  const oldProjects = [...projects.value]
  
  // 2. 立即更新 UI
  const index = projects.value.findIndex(p => p.id === id)
  if (index !== -1) {
    projects.value[index] = { ...projects.value[index], ...data }
  }
  
  // 3. 发送请求
  try {
    const updated = await $fetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: data
    })
    
    // 4. 使用服务器返回的数据
    projects.value[index] = updated
  } catch (error) {
    // 5. 失败时回滚
    projects.value = oldProjects
    throw error
  }
}
```

### 2. 实时更新（轮询）

```typescript
// 定期检查更新
const startPolling = (projectId: string) => {
  const interval = setInterval(async () => {
    const deployment = await fetchDeployment(deploymentId)
    // 更新状态
    updateDeploymentInList(deployment)
    
    if (deployment.status === 'success' || deployment.status === 'failed') {
      clearInterval(interval)
    }
  }, 5000)
  
  // 组件卸载时清理
  onUnmounted(() => clearInterval(interval))
}
```

### 3. 缓存失效

```typescript
// 创建/删除后使缓存失效
const createProject = async (data: CreateProjectData) => {
  const project = await $fetch('/api/projects', {
    method: 'POST',
    body: data
  })
  
  // 清除缓存，强制重新获取
  projects.value = []
  await fetchProjects()
  
  return project
}
```

---

## 🎯 最佳实践

### 1. 错误处理

```typescript
// 统一错误处理
const { error: showError } = useNotification()

const handleApiError = (error: any) => {
  if (error.statusCode === 401) {
    showError('未授权', '请重新登录')
    navigateTo('/login')
  } else if (error.statusCode === 404) {
    showError('未找到', '请求的资源不存在')
  } else {
    showError('错误', error.message || '发生未知错误')
  }
}

// 在 Composable 中使用
const fetchProjects = async () => {
  try {
    // ...
  } catch (error) {
    handleApiError(error)
    throw error
  }
}
```

### 2. 加载状态

```typescript
// 页面显示加载状态
<LoadingSpinner v-if="loading" />
<div v-else>
  <ProjectCard v-for="project in projects" :key="project.id" />
</div>
```

### 3. 空状态

```typescript
// 空状态处理
<div v-if="!loading && projects.length === 0">
  <EmptyState
    title="没有项目"
    description="创建你的第一个项目开始"
    actionText="创建项目"
    actionLink="/projects/new"
  />
</div>
```

### 4. 防抖和节流

```typescript
// 搜索时使用防抖
import { useDebounceFn } from '@vueuse/core'

const searchQuery = ref('')
const debouncedSearch = useDebounceFn(async (query: string) => {
  await fetchProjects({ search: query })
}, 500)

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})
```

---

## 📝 总结

1. **单向数据流**: 页面 → Composable → API → Database → API → Composable → 页面
2. **响应式更新**: 使用 Vue 3 的 ref/reactive 实现自动更新
3. **全局状态**: 使用 useState 在组件间共享状态
4. **错误处理**: 统一的错误处理和用户提示
5. **加载状态**: 所有异步操作都有加载状态
6. **认证保护**: 所有 API 都需要验证用户身份
7. **权限验证**: 用户只能访问自己的资源
