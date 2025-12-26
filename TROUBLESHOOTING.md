# 🔧 故障排查指南

## 前端问题：看不到内容

### 问题症状
- 页面空白
- 控制台显示错误
- 功能无法使用

### 解决步骤

#### 1. 检查环境变量

前端需要配置环境变量才能正常工作。

**创建 `.env` 文件**（在项目根目录）：

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，填入真实值
nano .env
```

**必填项**：

```env
# Gemini AI（必需）
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase（必需）
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe（可选，支付功能需要）
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_STRIPE_PRO_PRICE_ID=price_xxx
VITE_STRIPE_ENTERPRISE_PRICE_ID=price_yyy
```

#### 2. 安装依赖

```bash
# 确保已安装所有依赖
npm install

# 如果遇到问题，清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 3. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:5173

#### 4. 检查浏览器控制台

打开浏览器开发者工具（F12），查看：
- **Console** 标签：是否有错误信息？
- **Network** 标签：API 请求是否成功？

常见错误：
- `Missing API key` → 环境变量未配置
- `CORS error` → 后端 CORS 配置问题
- `Failed to fetch` → 后端服务未启动

#### 5. 验证 Supabase 配置

测试 Supabase 连接：

```bash
# 在浏览器控制台运行
fetch('https://your-project.supabase.co/rest/v1/')
  .then(r => r.json())
  .then(console.log)
```

如果返回错误，检查：
- URL 是否正确
- Anon key 是否有效
- Supabase 项目是否激活

---

## 后端问题：部署错误

### 问题症状
- 服务无法启动
- Maven 构建失败
- 端口冲突

### 解决步骤

#### 1. 检查 Java 版本

```bash
java -version
# 需要 Java 17 或更高版本

# 如果版本不对，安装 Java 17
# Ubuntu/Debian:
sudo apt install openjdk-17-jdk

# macOS:
brew install openjdk@17
```

#### 2. 检查 Maven 配置

```bash
cd server/
mvn -version

# 测试构建
mvn clean compile
```

**常见错误**：

**错误：`package javax.annotation does not exist`**
解决：已修复，使用 `jakarta.annotation.PostConstruct`

**错误：`Cannot resolve symbol`**
解决：
```bash
mvn clean install -U
```

**错误：`Port already in use`**
解决：
```bash
# 查找占用端口的进程
lsof -i :9999
lsof -i :8100

# 终止进程
kill -9 <PID>
```

#### 3. 检查数据库连接

在 `server/.env` 中配置：

```env
SUPABASE_DB_HOST=db.your-project.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-password
```

测试连接：
```bash
psql -h db.your-project.supabase.co -U postgres -d postgres
```

#### 4. 启动 Nacos

后端服务需要 Nacos 才能正常工作：

```bash
# 使用 Docker 启动 Nacos
docker run --name nacos -d \
  -p 8848:8848 \
  -e MODE=standalone \
  nacos/nacos-server:v2.3.0

# 验证 Nacos 是否启动
curl http://localhost:8848/nacos/
```

#### 5. 按顺序启动服务

```bash
cd server/

# 1. 启动网关
cd blade-gateway && mvn spring-boot:run &

# 等待 30 秒...

# 2. 启动认证服务
cd ../blade-auth && mvn spring-boot:run &

# 3. 启动其他服务
cd ../vision-user && mvn spring-boot:run &
cd ../vision-project && mvn spring-boot:run &
cd ../vision-payment && mvn spring-boot:run &
```

#### 6. 验证服务状态

访问 Nacos 控制台：http://localhost:8848/nacos
- 用户名：nacos
- 密码：nacos

检查所有服务是否注册成功（显示 UP 状态）。

#### 7. 测试 API

```bash
# 测试网关
curl http://localhost:9999/

# 测试认证服务
curl -X POST http://localhost:9999/blade-auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'
```

---

## Railway 部署问题

### 问题：部署失败

**检查清单**：
1. ✅ 环境变量已配置
2. ✅ `pom.xml` 文件正确
3. ✅ Java 17 运行时
4. ✅ Maven wrapper 存在

**解决方案**：

1. 使用 Nixpacks buildpack
2. 设置构建命令：
   ```
   cd server && mvn clean package -DskipTests
   ```
3. 设置启动命令：
   ```
   cd server/blade-gateway && java -jar target/*.jar
   ```

### 问题：服务无法通信

**原因**：Railway 上每个服务有独立的 URL

**解决**：
- 不要在 Railway 部署所有微服务
- 仅部署 API Gateway
- 其他服务整合到 Gateway 中，或使用单体应用

---

## 前后端联调问题

### 前端无法连接后端

**症状**：
- API 请求失败
- CORS 错误

**解决**：

1. 确认后端地址正确
2. 检查 CORS 配置（`blade-gateway/application.yml`）：
   ```yaml
   spring:
     cloud:
       gateway:
         globalcors:
           corsConfigurations:
             '[/**]':
               allowedOrigins: "http://localhost:5173"
   ```

3. 更新前端 API 基础 URL：
   ```typescript
   // 如果后端在 Railway
   const API_BASE = 'https://your-app.railway.app';
   
   // 如果后端在本地
   const API_BASE = 'http://localhost:9999';
   ```

---

## 快速诊断命令

```bash
# 检查前端
npm run dev  # 启动前端
curl http://localhost:5173  # 测试访问

# 检查后端
cd server/
mvn clean package  # 构建
docker ps  # 检查 Nacos
curl http://localhost:8848/nacos  # 测试 Nacos
curl http://localhost:9999  # 测试 Gateway

# 检查环境变量
cat .env  # 前端环境变量
cat server/.env  # 后端环境变量
```

---

## 需要帮助？

如果以上步骤都无法解决问题：

1. 查看详细错误日志
2. 检查 GitHub Issues
3. 提供以下信息：
   - 操作系统版本
   - Java/Node.js 版本
   - 完整错误信息
   - 相关配置文件
