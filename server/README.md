# Vision PaaS Platform - Backend Services

🚀 **Complete PaaS Platform Backend** - Vercel/Railway Alternative

## 📋 Overview

Vision PaaS Platform is a complete microservices-based Platform-as-a-Service backend that enables **100% automatic deployment** with zero configuration. Just provide a Git URL and deploy in 2 minutes!

### ✨ Key Features

- **🤖 Automatic Project Detection**: Detects 20+ project types (Next.js, React, Spring Boot, Django, etc.)
- **🐳 Auto Dockerfile Generation**: Optimized Dockerfiles for each project type
- **🔄 Git Integration**: GitHub/GitLab webhooks for automatic deployments
- **🌐 Domain Management**: Auto-assign subdomains with SSL certificates
- **💳 Payment Integration**: Stripe subscriptions (Free/Hobby/Pro/Enterprise)
- **📊 Real-time Monitoring**: Logs, metrics, and resource usage
- **🔐 Authentication**: JWT tokens and API keys
- **⚖️ Load Balancing**: Nginx-based proxy with health checks

## 🏗️ Architecture

### Microservices

| Service | Port | Description |
|---------|------|-------------|
| **blade-gateway** | 8080 | API Gateway - routing, auth, rate limiting |
| **blade-auth** | 8081 | Authentication - JWT, OAuth, sessions |
| **vision-user** | 8082 | User management, API keys, quotas |
| **vision-deploy** ⭐ | 8083 | **Core deployment service** - auto-detection, Docker, Git |
| **vision-project** | 8084 | Project CRUD, configurations, history |
| **vision-payment** | 8085 | Stripe integration, subscriptions, billing |
| **vision-monitor** | 8086 | Logging, metrics, monitoring, alerts |
| **vision-proxy** | 8087 | Domain management, SSL, load balancing |
| **vision-database** | 8088 | Database provisioning (PostgreSQL/MySQL/Redis) |

### Technology Stack

- **Framework**: Spring Boot 3.2 + Spring Cloud
- **Service Discovery**: Nacos
- **Database**: PostgreSQL + Redis
- **Containerization**: Docker Java Client
- **Git Operations**: JGit
- **Payment**: Stripe
- **Authentication**: JWT (jjwt)

## 🚀 Quick Start

### Prerequisites

- JDK 17+
- Maven 3.9+
- Docker
- PostgreSQL
- Nacos (optional, for service discovery)

### 1. Clone Repository

```bash
git clone https://github.com/v3ai2026/vision-.git
cd vision-/server
```

### 2. Setup Database

```sql
CREATE DATABASE vision_paas;
CREATE USER vision_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vision_paas TO vision_user;
```

### 3. Configure Services

Update `application.yml` in each service with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/vision_paas
    username: vision_user
    password: your_password
```

### 4. Build All Services

```bash
mvn clean install
```

### 5. Start Services

```bash
# Start Nacos (optional)
# Download from https://nacos.io/

# Start each service
cd blade-gateway && mvn spring-boot:run &
cd blade-auth && mvn spring-boot:run &
cd vision-user && mvn spring-boot:run &
cd vision-deploy && mvn spring-boot:run &
cd vision-project && mvn spring-boot:run &
cd vision-payment && mvn spring-boot:run &
cd vision-monitor && mvn spring-boot:run &
cd vision-proxy && mvn spring-boot:run &
cd vision-database && mvn spring-boot:run &
```

## 📖 Usage Examples

### Auto Deploy (Zero Config)

```bash
curl -X POST http://localhost:8080/api/deploy/auto \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "my-app-123",
    "gitUrl": "https://github.com/user/nextjs-app.git"
  }'
```

**Response:**
```json
{
  "code": 200,
  "message": "Deployment initiated",
  "data": {
    "projectId": "my-app-123",
    "status": "RUNNING",
    "projectType": "NEXTJS",
    "port": 3000,
    "hostPort": 32768,
    "logs": "✓ Repository cloned\n✓ Detected Next.js\n✓ Image built\n✓ Container started"
  }
}
```

### Custom Deploy (Advanced Mode)

```bash
curl -X POST http://localhost:8080/api/deploy/custom \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "my-app-123",
    "gitUrl": "https://github.com/user/app.git",
    "projectType": "REACT",
    "port": 3000,
    "envVars": {
      "NODE_ENV": "production",
      "API_URL": "https://api.example.com"
    },
    "memoryMB": 1024
  }'
```

### User Registration & Login

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }'
```

## 🎯 Supported Project Types

The platform automatically detects and deploys 20+ project types:

### Frontend Frameworks
- ✅ Next.js
- ✅ React
- ✅ Vue.js
- ✅ Angular
- ✅ Svelte
- ✅ Nuxt.js
- ✅ Gatsby
- ✅ Static HTML

### Backend Frameworks (Java)
- ✅ Spring Boot
- ✅ Spring Cloud
- ✅ Micronaut
- ✅ Quarkus

### Backend Frameworks (Python)
- ✅ Django
- ✅ Flask
- ✅ FastAPI

### Backend Frameworks (Node.js)
- ✅ Express.js
- ✅ NestJS
- ✅ Koa

### Backend Frameworks (Other)
- ✅ Go / Gin
- ✅ Ruby on Rails
- ✅ Laravel
- ✅ Hugo
- ✅ Jekyll

## 🗃️ Database Schema

### Key Tables

```sql
-- Projects
CREATE TABLE projects (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    git_url VARCHAR(512),
    type VARCHAR(32),
    port INT,
    domain VARCHAR(256),
    container_id VARCHAR(128),
    status VARCHAR(32),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Deployments
CREATE TABLE deployments (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    commit_sha VARCHAR(64),
    status VARCHAR(32),
    build_log TEXT,
    deployed_at TIMESTAMP
);

-- API Keys
CREATE TABLE api_keys (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    key_value VARCHAR(128) UNIQUE,
    name VARCHAR(128),
    created_at TIMESTAMP,
    is_active BOOLEAN
);

-- Subscriptions
CREATE TABLE subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    plan VARCHAR(32),
    stripe_customer_id VARCHAR(128),
    stripe_subscription_id VARCHAR(128),
    status VARCHAR(32),
    current_period_end TIMESTAMP
);
```

## 🐳 Docker Deployment

### Build Docker Images

```bash
# Build all services
for service in blade-gateway blade-auth vision-user vision-deploy vision-project vision-payment vision-monitor vision-proxy vision-database; do
  cd $service
  docker build -t vision-paas/$service:latest .
  cd ..
done
```

### Docker Compose

```bash
docker-compose up -d
```

## ☸️ Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vision_paas
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=86400000

# Stripe
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Docker
DOCKER_HOST=unix:///var/run/docker.sock

# Nacos
NACOS_SERVER_ADDR=localhost:8848
```

## 📊 Monitoring

Access monitoring endpoints:

- **Metrics**: `http://localhost:8086/api/monitor/metrics/{projectId}`
- **Logs**: `http://localhost:8086/api/monitor/logs/{projectId}`
- **Health**: `http://localhost:8086/api/monitor/health/{projectId}`

## 🔐 Security

- JWT tokens for user authentication
- API keys for service-to-service communication
- Rate limiting (60 requests/minute per client)
- Row-level security in database
- Environment variable encryption
- HTTPS/SSL automatic certificate management

## 📝 API Documentation

Full API documentation available at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/api-docs`

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](../CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](../LICENSE)

## 🆘 Support

- **Issues**: https://github.com/v3ai2026/vision-/issues
- **Email**: support@vision-paas.com
- **Documentation**: https://docs.vision-paas.com

---

**Made with 💚 by the Vision PaaS Team**
