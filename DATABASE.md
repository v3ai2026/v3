# 数据库配置说明

## Neon PostgreSQL 连接

本项目使用 Neon PostgreSQL 作为数据库。

### 环境变量配置

复制 `.env.example` 到 `.env` 并填写实际的数据库凭据。

### 初始化数据库

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 推送数据库 schema
npx prisma db push

# 或者运行迁移
npx prisma migrate dev --name init
```

### 测试数据库连接

启动开发服务器后访问：
```
http://localhost:3000/api/health
```

应该返回数据库连接状态。

### 使用示例

#### 使用 Neon Serverless SQL
```typescript
import { sql } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const users = await sql`SELECT * FROM users`
  return users
})
```

#### 使用 Prisma
```typescript
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany()
  return users
})
```

**注意**: 使用 `~/server/utils/prisma` 中的 singleton 实例，避免每次创建新的 PrismaClient 导致连接池耗尽。

## 重要提示

⚠️ **请确保在生产环境中使用环境变量而不是硬编码数据库凭据！**

在 Vercel/Netlify 等平台部署时，需要在平台的环境变量设置中添加所有 `DATABASE_URL` 和 `POSTGRES_*` 变量。
