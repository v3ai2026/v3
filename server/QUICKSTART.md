# 🚀 快速启动指南

## 最小化启动步骤

### 1. 准备工作（5分钟）

**安装要求**:
- Java 17+
- Maven 3.6+
- Docker (用于 Nacos)

**环境配置**:
```bash
# 1. 复制环境配置文件
cd server/
cp .env.example .env

# 2. 编辑 .env 文件，填入必要的配置
# 必须配置: SUPABASE_DB_HOST, SUPABASE_DB_PASSWORD
# 可选配置: STRIPE_SECRET_KEY (支付功能需要)
```

### 2. 启动 Nacos（1分钟）

```bash
# 使用 Docker 启动 Nacos
docker run --name nacos -d \
  -p 8848:8848 \
  -e MODE=standalone \
  nacos/nacos-server:v2.3.0

# 验证 Nacos 是否启动成功
curl http://localhost:8848/nacos
```

### 3. 构建项目（2分钟）

```bash
# 在 server/ 目录下执行
mvn clean package -DskipTests
```

### 4. 启动服务（按顺序启动）

#### 方式一：命令行启动

```bash
# 1. 启动网关 (9999)
cd blade-gateway && mvn spring-boot:run &

# 2. 启动认证服务 (8100)
cd blade-auth && mvn spring-boot:run &

# 3. 启动用户服务 (8101)
cd vision-user && mvn spring-boot:run &

# 4. 启动项目服务 (8102)
cd vision-project && mvn spring-boot:run &

# 5. 启动支付服务 (8103)
cd vision-payment && mvn spring-boot:run &
```

#### 方式二：使用 jar 包启动

```bash
# 1. 网关
java -jar blade-gateway/target/blade-gateway-1.0.0.jar &

# 2. 认证
java -jar blade-auth/target/blade-auth-1.0.0.jar &

# 3. 用户
java -jar vision-user/target/vision-user-1.0.0.jar &

# 4. 项目
java -jar vision-project/target/vision-project-1.0.0.jar &

# 5. 支付
java -jar vision-payment/target/vision-payment-1.0.0.jar &
```

### 5. 验证服务状态

```bash
# 查看 Nacos 服务列表
# 浏览器访问: http://localhost:8848/nacos
# 用户名/密码: nacos/nacos

# 所有服务应该显示为 UP 状态:
# - blade-gateway
# - blade-auth
# - vision-user
# - vision-project
# - vision-payment
```

### 6. 测试 API

#### 注册用户

```bash
curl -X POST http://localhost:9999/blade-auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

#### 登录

```bash
curl -X POST http://localhost:9999/blade-auth/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123"
  }'
```

#### 获取用户信息

```bash
# 使用登录返回的 token
curl -X GET http://localhost:9999/api/user/info \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 创建项目

```bash
curl -X POST http://localhost:9999/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Project",
    "description": "Test project"
  }'
```

## 🐳 使用 Docker Compose 启动（推荐）

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📊 服务端口映射

| 服务 | 端口 | 用途 |
|-----|------|-----|
| Nacos | 8848 | 服务注册中心 |
| Gateway | 9999 | API 网关（统一入口） |
| Auth | 8100 | 认证服务 |
| User | 8101 | 用户服务 |
| Project | 8102 | 项目服务 |
| Payment | 8103 | 支付服务 |

## 🔍 常见问题

### Q: 服务启动失败？
**A**: 
1. 确认 Nacos 是否已启动
2. 检查端口是否被占用: `lsof -i :9999`
3. 查看服务日志排查错误

### Q: 无法连接数据库？
**A**: 
1. 确认 `.env` 文件配置正确
2. 测试数据库连接
3. 检查 Supabase IP 白名单

### Q: Token 验证失败？
**A**: 
1. 确认所有服务使用相同的 `JWT_SECRET`
2. 检查 Token 是否过期
3. 验证请求头格式: `Authorization: Bearer <token>`

## 📖 下一步

- 查看完整 API 文档: [README.md](./README.md)
- 配置 Stripe 支付: [支付配置](#stripe-配置)
- 部署到生产环境: [部署指南](#部署指南)

## 💡 提示

- **开发环境**: 使用 `mvn spring-boot:run` 启动，支持热重载
- **生产环境**: 使用 `java -jar` 启动 jar 包，性能更好
- **日志查看**: 默认输出到控制台，可配置文件日志
- **监控**: 访问 Nacos 控制台查看服务健康状态

---

**总耗时**: 约 10 分钟即可完成所有服务的启动！
