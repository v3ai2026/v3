# 📋 Code Review 完整指南

> 让代码审查成为团队的核心竞争力

## 目录

- [核心认知](#核心认知)
- [如何有效开展](#如何有效开展)
- [操作规范](#操作规范)
- [开发流程](#开发流程)
- [前端检查清单](#前端检查清单)
- [快速检查清单](#快速检查清单)
- [工具推荐](#工具推荐)

---

## 🎯 核心认知

### Code Review 的核心目的

Code Review 不仅仅是找 Bug，更重要的是：

1. **知识共享** - 让团队成员了解彼此的工作，传播最佳实践
2. **提升质量** - 在代码合并前发现问题，降低线上故障率
3. **统一风格** - 保持代码库的一致性，提高可维护性
4. **团队成长** - 通过互相学习，提升整体技术水平
5. **减少技术债** - 及早发现设计问题，避免未来的重构成本

### 关键收益

- **发现 Bug**: 在代码合并前找出潜在问题
- **提高质量**: 确保代码符合团队标准
- **知识传播**: 让更多人了解业务逻辑和技术实现
- **降低风险**: 减少单点故障和知识孤岛
- **促进协作**: 增强团队凝聚力

### 理想的审查阶段

```
设计阶段 → 编码阶段 → 提交阶段 → 合并阶段
   ↓          ↓          ↓          ↓
设计评审    自我审查    同行评审    最终确认
```

**最佳时机**：代码提交后、合并前（Pre-merge Review）

### 团队文化建设

- **对事不对人** - 评论代码，而不是批评人
- **积极反馈** - 给予正面评价，鼓励好的实践
- **持续学习** - 把 Review 当作学习机会
- **快速响应** - 及时审查和回复，不阻塞开发进度

---

## 📋 如何有效开展

### 1. 明确代码规范

建立清晰的编码规范文档，包括：

- **命名规范**: 变量、函数、组件、文件的命名约定
- **代码风格**: 缩进、空格、换行等格式要求
- **架构规范**: 模块划分、目录结构、状态管理
- **注释规范**: 何时写注释、如何写注释
- **安全规范**: 输入验证、数据转义、权限检查

📝 **示例**: 本项目使用 [ESLint](/.eslintrc.cjs) 和 [Prettier](/.prettierrc) 自动化代码风格检查。

### 2. 制定检视 Checklist

使用标准化的检查清单，确保审查的全面性：

✅ 参考 [CODE_REVIEW_CHECKLIST.md](/CODE_REVIEW_CHECKLIST.md) 快速检查清单

### 3. 评论分级管理

使用明确的标签区分评论的严重程度：

#### 🚫 [blocker] - 必须修改

阻塞性问题，不修复不能合并。包括：
- 明显的 Bug
- 安全漏洞
- 违反核心架构原则
- 会导致系统崩溃的问题

```typescript
// [blocker] 这里会导致内存泄漏，组件销毁时需要清理定时器
let timer: NodeJS.Timeout;

onMounted(() => {
  timer = setInterval(() => {
    fetchData();
  }, 5000);
});

// 应该添加清理逻辑
onUnmounted(() => {
  clearInterval(timer);
});
```

#### ❓ [question] - 需要澄清

需要作者解释或讨论的问题：
- 不清楚的设计意图
- 复杂的业务逻辑
- 可能的替代方案

```typescript
// [question] 为什么这里使用 setTimeout 而不是 requestAnimationFrame？
// 这个函数的具体作用是什么？能否添加注释说明？
```

#### 💡 [optional] - 建议优化

非强制性的改进建议：
- 代码优化
- 性能提升
- 可读性改善
- 最佳实践推荐

```typescript
// [optional] 这里可以使用 computed 缓存计算结果，避免重复计算
const filteredList = computed(() => {
  return list.value.filter(item => item.active);
});
```

#### ✨ [praise] - 正面评价

表扬好的代码和实践：

```typescript
// ✨ 这个错误处理写得很完善！
// 👍 类型定义很清晰，赞！
// 🎯 这个性能优化思路不错！
```

### 4. 纳入流程与激励机制

- **流程集成**: 将 Code Review 纳入正式开发流程
- **时间保障**: 为 Review 预留专门时间（如每天 1-2 小时）
- **质量指标**: 跟踪 Review 覆盖率、发现问题数等指标
- **正向激励**: 表扬优秀的 Reviewer 和高质量的代码

---

## ✅ 操作规范

### 1. 对事不对人的沟通方式

❌ **错误示例**:
```
"你这代码写得什么玩意儿？"
"你怎么连这个都不知道？"
"你是不是没学过编程？"
```

✅ **正确示例**:
```
"这段代码可能存在性能问题，建议使用 computed 缓存"
"这里的类型定义不够准确，可以改为 Type<User>"
"建议添加错误处理，避免接口异常时影响用户体验"
```

**关键原则**:
- 用 **"这段代码"** 而不是 **"你的代码"**
- 用 **"建议"** 而不是 **"必须"**（除非是 blocker）
- 用 **"可能"** 而不是 **"肯定"**
- 提供具体的改进建议，而不是只指出问题

### 2. 给予正面评价

不要吝啬赞美，好的代码值得表扬：

```
✨ 这个组件的封装很优雅！
👍 错误处理很完善，考虑得很周到
🎯 这个性能优化效果明显，赞！
💡 这个设计思路很巧妙
📚 这段注释写得很清楚，方便理解
```

### 3. 控制 PR 大小

**黄金规则**: 单个 PR 代码变更应小于 **300 行**

- **小 PR 的好处**:
  - 更容易审查
  - 更容易理解
  - 更容易发现问题
  - 更容易回滚

- **如何拆分大 PR**:
  - 按功能模块拆分
  - 按重构步骤拆分
  - 先基础后应用
  - 使用 Feature Flag 渐进式上线

### 4. 优先审查原则

当有多个 PR 待审查时，优先级如下：

1. **紧急修复** (Hotfix) - 立即审查
2. **阻塞他人** - 当天审查
3. **新功能** - 24 小时内审查
4. **优化重构** - 48 小时内审查
5. **文档更新** - 一周内审查

### 5. 善用工具

利用自动化工具减轻审查负担：

- **ESLint**: 自动检查代码风格和常见问题
- **Prettier**: 自动格式化代码
- **TypeScript**: 静态类型检查
- **Husky**: Git Hooks 自动化
- **GitHub Actions**: CI/CD 自动化测试

### 6. 明确改进意见

提供清晰、可执行的改进建议：

❌ **模糊的意见**:
```
"这里有问题"
"这样不好"
"需要优化"
```

✅ **明确的意见**:
```typescript
// 问题：这里会导致重复渲染
// 建议：使用 computed 缓存
const sortedList = computed(() => {
  return [...list.value].sort((a, b) => a.name.localeCompare(b.name));
});

// 问题：缺少错误处理
// 建议：添加 try-catch
try {
  const data = await fetchUser(id);
  return data;
} catch (error) {
  console.error('Failed to fetch user:', error);
  return null;
}
```

---

## 🛠️ 开发流程

### GitHub Flow 集成

```
1. 创建分支      git checkout -b feature/xxx
2. 开发功能      编写代码 + 自测
3. 提交代码      git commit -m "feat: xxx"
4. 创建 PR       在 GitHub 创建 Pull Request
5. Code Review   至少一人审查通过
6. 合并代码      Squash and Merge
7. 删除分支      自动或手动删除
```

### 紧急情况处理

对于 **紧急修复** (Hotfix)，可以简化流程：

1. 创建 hotfix 分支
2. 快速修复问题
3. 简化 Review（关注核心逻辑）
4. 快速合并
5. **事后补充** 完整测试和文档

### 先设计后编码

对于复杂功能，建议先进行设计评审：

1. **设计文档** - 写清楚要做什么、为什么、怎么做
2. **技术方案** - API 设计、数据结构、架构图
3. **设计评审** - 团队讨论，统一认识
4. **开始编码** - 按照评审后的方案实施

### 提交前自检清单

在提交 PR 前，开发者应该自己先检查：

```bash
# 1. 代码检查
npm run lint

# 2. 类型检查
npm run type-check

# 3. 运行测试
npm run test

# 4. 代码格式化
npm run format

# 5. 本地运行
npm run dev
```

✅ 详细清单参考 [CODE_REVIEW_CHECKLIST.md](/CODE_REVIEW_CHECKLIST.md)

---

## 🔎 前端检查清单

### 架构与规范

#### 1. 模块划分与状态管理

✅ **好的实践**:
```typescript
// ✅ 组件职责单一，状态管理清晰
// components/UserProfile.vue
<script setup lang="ts">
interface Props {
  userId: string;
}

const props = defineProps<Props>();
const userStore = useUserStore();
const user = computed(() => userStore.getUserById(props.userId));
</script>

// ✅ 状态管理集中化
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  
  const getUserById = (id: string) => {
    return users.value.find(u => u.id === id);
  };
  
  return { users, getUserById };
});
```

❌ **不好的实践**:
```typescript
// ❌ 组件职责混乱，直接操作 DOM
// ❌ 状态散落各处，难以维护
<script setup>
const data = ref();  // ❌ 类型不明确
let userId;          // ❌ 使用 let，应该用 const

onMounted(() => {
  // ❌ 直接操作 DOM
  document.querySelector('.user').innerHTML = 'xxx';
  
  // ❌ 状态管理混乱
  userId = localStorage.getItem('id');
});
</script>
```

#### 2. TypeScript 类型安全

✅ **好的实践**:
```typescript
// ✅ 明确的类型定义
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await $fetch<ApiResponse<User>>(`/api/users/${id}`);
  return response.data;
}
```

❌ **不好的实践**:
```typescript
// ❌ 使用 any 类型
async function fetchUser(id: any): Promise<any> {
  const response: any = await $fetch(`/api/users/${id}`);
  return response.data;
}

// ❌ 隐式 any
function processData(data) {  // ❌ 参数缺少类型
  return data.map(item => item.value);  // ❌ 不确定 item 的结构
}
```

#### 3. 命名一致性

✅ **好的实践**:
```typescript
// ✅ 组件名: PascalCase
UserProfile.vue
UserList.vue
UserEditForm.vue

// ✅ 变量名: camelCase
const userName = ref('');
const isLoading = ref(false);
const userList = ref<User[]>([]);

// ✅ 常量名: UPPER_SNAKE_CASE
const API_BASE_URL = '/api';
const MAX_RETRY_COUNT = 3;

// ✅ 函数名: 动词开头
function fetchUserData() {}
function handleSubmit() {}
function validateForm() {}

// ✅ 布尔值: is/has/should 开头
const isVisible = ref(false);
const hasPermission = computed(() => user.value?.role === 'admin');
const shouldShowModal = ref(false);
```

❌ **不好的实践**:
```typescript
// ❌ 命名不一致
const UserName = ref('');      // ❌ 变量应该用 camelCase
const is_loading = ref(false); // ❌ 应该用 camelCase，不是 snake_case
const list = ref([]);          // ❌ 名称不够具体

// ❌ 函数名不清晰
function handle() {}           // ❌ handle 什么？
function do() {}               // ❌ do 什么？
function process(data) {}      // ❌ process 什么？
```

### 性能优化

#### 1. 组件渲染效率

✅ **好的实践**:
```vue
<script setup lang="ts">
// ✅ 使用 computed 缓存计算结果
const filteredUsers = computed(() => {
  return users.value.filter(user => user.active);
});

// ✅ 使用 useMemo 避免重复计算
const sortedUsers = computed(() => {
  return [...filteredUsers.value].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
});
</script>

<template>
  <!-- ✅ 使用 v-memo 优化列表渲染 -->
  <div
    v-for="user in sortedUsers"
    :key="user.id"
    v-memo="[user.name, user.status]"
  >
    {{ user.name }}
  </div>
</template>
```

❌ **不好的实践**:
```vue
<script setup>
// ❌ 直接在方法中过滤，每次渲染都会执行
function getFilteredUsers() {
  return users.value.filter(user => user.active);
}

// ❌ 在模板中进行复杂计算
</script>

<template>
  <!-- ❌ 每次渲染都会重新排序 -->
  <div
    v-for="user in users.filter(u => u.active).sort((a, b) => a.name > b.name)"
    :key="user.id"
  >
    {{ user.name }}
  </div>
</template>
```

#### 2. 资源加载优化

✅ **好的实践**:
```vue
<script setup lang="ts">
// ✅ 路由懒加载
const routes = [
  {
    path: '/user',
    component: () => import('~/pages/user/index.vue')
  }
];

// ✅ 组件懒加载
const HeavyComponent = defineAsyncComponent(() => 
  import('~/components/HeavyComponent.vue')
);

// ✅ 图片懒加载
</script>

<template>
  <!-- ✅ 使用 loading="lazy" -->
  <img src="/large-image.jpg" loading="lazy" alt="描述" />
  
  <!-- ✅ 异步组件加载 -->
  <Suspense>
    <template #default>
      <HeavyComponent />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>
```

❌ **不好的实践**:
```vue
<script setup>
// ❌ 同步导入大型组件
import HeavyComponent from '~/components/HeavyComponent.vue';
import AnotherHeavyComponent from '~/components/AnotherHeavyComponent.vue';

// ❌ 一次性加载所有数据
onMounted(async () => {
  const allData = await $fetch('/api/all-data');  // ❌ 数据量可能很大
});
</script>

<template>
  <!-- ❌ 立即加载所有图片 -->
  <img v-for="img in images" :src="img.url" />
</template>
```

#### 3. 虚拟滚动

✅ **好的实践**:
```vue
<script setup lang="ts">
// ✅ 大列表使用虚拟滚动
import { useVirtualList } from '@vueuse/core';

const allItems = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})));

const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  {
    itemHeight: 50,
  }
);
</script>

<template>
  <div v-bind="containerProps" style="height: 400px">
    <div v-bind="wrapperProps">
      <div v-for="{ data, index } in list" :key="index">
        {{ data.name }}
      </div>
    </div>
  </div>
</template>
```

❌ **不好的实践**:
```vue
<template>
  <!-- ❌ 直接渲染大列表 -->
  <div v-for="item in allItems" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

### 安全性

#### 1. XSS 防护

✅ **好的实践**:
```vue
<script setup lang="ts">
import DOMPurify from 'dompurify';

const userInput = ref('');
const sanitizedHtml = computed(() => {
  return DOMPurify.sanitize(userInput.value);
});
</script>

<template>
  <!-- ✅ 默认使用文本插值，自动转义 -->
  <div>{{ userInput }}</div>
  
  <!-- ✅ 必须使用 HTML 时，先消毒 -->
  <div v-html="sanitizedHtml"></div>
</template>
```

❌ **不好的实践**:
```vue
<script setup>
const userInput = ref('');
</script>

<template>
  <!-- ❌ 直接使用 v-html，存在 XSS 风险 -->
  <div v-html="userInput"></div>
  
  <!-- ❌ 直接拼接 HTML -->
  <div v-html="`<p>${userInput}</p>`"></div>
</template>
```

#### 2. CSRF 防护

✅ **好的实践**:
```typescript
// ✅ 使用 CSRF Token
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'csrf-token');
  const headerToken = getHeader(event, 'x-csrf-token');
  
  if (token !== headerToken) {
    throw createError({
      statusCode: 403,
      message: 'Invalid CSRF token'
    });
  }
  
  // 处理请求...
});
```

#### 3. 用户输入验证和转义

✅ **好的实践**:
```typescript
// ✅ 前端验证
const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(100);

function validateForm() {
  try {
    emailSchema.parse(email.value);
    passwordSchema.parse(password.value);
    return true;
  } catch (error) {
    showError(error.message);
    return false;
  }
}

// ✅ 后端验证
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // 验证输入
  if (!body.email || !isValidEmail(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email'
    });
  }
  
  // 转义输入
  const sanitizedInput = escapeHtml(body.content);
  
  // 处理请求...
});
```

❌ **不好的实践**:
```typescript
// ❌ 只在前端验证
function submitForm() {
  // ❌ 简单的客户端验证可以被绕过
  if (email.value && password.value) {
    $fetch('/api/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    });
  }
}

// ❌ 后端不验证
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // ❌ 直接使用用户输入，没有验证
  await db.insert({ email: body.email, content: body.content });
});
```

### 错误处理

#### 1. API 调用错误处理

✅ **好的实践**:
```typescript
// ✅ 完整的错误处理
const { data, error, pending } = await useFetch('/api/users', {
  onResponseError({ response }) {
    if (response.status === 401) {
      navigateTo('/login');
    } else if (response.status === 403) {
      showError('没有权限');
    } else {
      showError('请求失败，请稍后重试');
    }
  }
});

// ✅ 使用 try-catch
async function fetchUserData() {
  try {
    const data = await $fetch('/api/users');
    return data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    showNotification('加载失败', 'error');
    return [];
  }
}
```

❌ **不好的实践**:
```typescript
// ❌ 没有错误处理
const data = await $fetch('/api/users');

// ❌ 只打印错误，不处理
async function fetchUserData() {
  try {
    const data = await $fetch('/api/users');
    return data;
  } catch (error) {
    console.log(error);  // ❌ 只打印，用户看不到
  }
}
```

#### 2. 加载状态管理

✅ **好的实践**:
```vue
<script setup lang="ts">
const isLoading = ref(false);
const error = ref<string | null>(null);
const data = ref<User[]>([]);

async function loadData() {
  isLoading.value = true;
  error.value = null;
  
  try {
    data.value = await $fetch('/api/users');
  } catch (e) {
    error.value = '加载失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div v-if="isLoading">加载中...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <UserList :users="data" />
  </div>
</template>
```

❌ **不好的实践**:
```vue
<script setup>
const data = ref([]);

// ❌ 没有加载状态
async function loadData() {
  data.value = await $fetch('/api/users');
}
</script>

<template>
  <!-- ❌ 数据加载时显示空白 -->
  <UserList :users="data" />
</template>
```

#### 3. 错误上报

✅ **好的实践**:
```typescript
// ✅ 统一错误上报
function reportError(error: Error, context: string) {
  // 上报到监控平台
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket 等
    console.error(`[${context}]`, error);
    // sentryCapture(error);
  }
}

// ✅ 全局错误处理
app.config.errorHandler = (error, instance, info) => {
  reportError(error as Error, info);
};
```

### 可维护性

#### 1. 注释规范

✅ **好的实践**:
```typescript
/**
 * 获取用户信息
 * @param userId 用户 ID
 * @returns 用户信息，如果不存在返回 null
 * @throws {ApiError} 当网络请求失败时
 */
async function getUserInfo(userId: string): Promise<User | null> {
  // 先从缓存获取
  const cached = cache.get(userId);
  if (cached) return cached;
  
  // 缓存未命中，从 API 获取
  const user = await $fetch(`/api/users/${userId}`);
  cache.set(userId, user);
  return user;
}

// ✅ 复杂逻辑添加注释
// 计算折扣：VIP 用户 8 折，普通用户 9 折，首次购买额外 5% 优惠
const discount = computed(() => {
  let rate = user.value.isVip ? 0.8 : 0.9;
  if (user.value.isFirstOrder) {
    rate *= 0.95;
  }
  return rate;
});
```

❌ **不好的实践**:
```typescript
// ❌ 没有注释，不知道函数用途
async function getData(id) {
  const x = cache.get(id);
  if (x) return x;
  const y = await $fetch(`/api/users/${id}`);
  cache.set(id, y);
  return y;
}

// ❌ 过度注释
const userName = ref('');  // ❌ 定义用户名变量
userName.value = 'Tom';    // ❌ 设置用户名为 Tom
```

#### 2. 文档说明

✅ **好的实践**:
```vue
<!--
  UserProfile 组件
  
  显示用户的基本信息和操作按钮
  
  Props:
  - userId: 用户 ID (必填)
  - showActions: 是否显示操作按钮 (默认: true)
  
  Events:
  - edit: 点击编辑按钮时触发
  - delete: 点击删除按钮时触发
  
  示例:
  <UserProfile :user-id="123" @edit="handleEdit" />
-->
<script setup lang="ts">
// ...
</script>
```

#### 3. 常量提取

✅ **好的实践**:
```typescript
// ✅ 提取常量
const API_ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
  COMMENTS: '/api/comments',
} as const;

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
```

❌ **不好的实践**:
```typescript
// ❌ 魔法数字和字符串
if (role === 'admin') {  // ❌ 硬编码字符串
  // ...
}

if (fileSize > 5242880) {  // ❌ 魔法数字，不知道是什么
  // ...
}
```

#### 4. 单元测试

✅ **好的实践**:
```typescript
// ✅ 编写测试
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UserProfile from './UserProfile.vue';

describe('UserProfile', () => {
  it('renders user name', () => {
    const wrapper = mount(UserProfile, {
      props: {
        user: { id: '1', name: 'Tom' }
      }
    });
    expect(wrapper.text()).toContain('Tom');
  });
  
  it('emits edit event when edit button clicked', async () => {
    const wrapper = mount(UserProfile, {
      props: {
        user: { id: '1', name: 'Tom' }
      }
    });
    await wrapper.find('.edit-btn').trigger('click');
    expect(wrapper.emitted('edit')).toBeTruthy();
  });
});
```

---

## 🚀 快速检查清单

### 提交前自检清单（开发者）

- [ ] 代码通过 `npm run lint` 检查
- [ ] 代码通过 `npm run type-check` 检查
- [ ] 代码通过 `npm run format` 格式化
- [ ] 所有测试用例通过 `npm run test`
- [ ] 本地运行正常 `npm run dev`
- [ ] 变量、函数、组件命名清晰且符合规范
- [ ] 所有 Props 和函数参数有 TypeScript 类型定义
- [ ] 复杂逻辑有注释说明
- [ ] 没有 `console.log`、`debugger` 等调试代码
- [ ] 用户输入经过验证和转义

### 审查者检查清单（Reviewer）

- [ ] 代码逻辑正确且易于理解
- [ ] 没有明显的 Bug 或逻辑错误
- [ ] 边界情况处理完善
- [ ] 错误处理机制完整
- [ ] 符合项目编码规范
- [ ] 命名准确且一致
- [ ] 代码结构清晰
- [ ] 没有重复代码（DRY 原则）
- [ ] 组件职责单一（单一职责原则）
- [ ] 没有明显的性能问题

---

## 🛠️ 工具推荐

### 自动化工具

#### ESLint
```bash
# 安装
npm install -D eslint @nuxtjs/eslint-config-typescript

# 检查代码
npm run lint

# 自动修复
npm run lint:fix
```

配置文件：[.eslintrc.cjs](/.eslintrc.cjs)

#### Prettier
```bash
# 安装
npm install -D prettier

# 格式化代码
npm run format
```

配置文件：[.prettierrc](/.prettierrc)

#### TypeScript
```bash
# 类型检查
npm run type-check
```

配置文件：[tsconfig.json](/tsconfig.json)

#### Husky + lint-staged

Git Hooks 自动化：

```bash
# 安装
npm install -D husky lint-staged

# 初始化
npm run prepare
```

配置文件：
- [.husky/pre-commit](/.husky/pre-commit)
- [.lintstagedrc.cjs](/.lintstagedrc.cjs)

#### Vitest

单元测试：

```bash
# 运行测试
npm run test

# 测试 UI
npm run test:ui
```

### 浏览器插件

- **Vue Devtools** - 调试 Vue 应用
- **React Developer Tools** - 调试 React 应用（如果使用）
- **Lighthouse** - 性能分析
- **axe DevTools** - 无障碍检查

### IDE 插件

- **ESLint** - 实时代码检查
- **Prettier** - 代码格式化
- **Volar** - Vue 3 支持
- **TypeScript Vue Plugin** - Vue 类型支持

---

## 📚 参考资源

- [Google Engineering Practices](https://google.github.io/eng-practices/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Vue.js Style Guide](https://vuejs.org/style-guide/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

## 💬 反馈与改进

如果你有任何建议或发现文档中的问题，欢迎：

1. 创建 Issue 讨论
2. 提交 PR 改进文档
3. 在团队会议中提出

让我们一起把 Code Review 做得更好！🚀
