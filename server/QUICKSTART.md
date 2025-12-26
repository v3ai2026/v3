# Quick Start Guide - Vision PaaS Platform

## 🚀 Get Started in 5 Minutes

### Option 1: Docker Compose (Recommended)

The fastest way to run the entire platform:

```bash
# 1. Clone the repository
git clone https://github.com/v3ai2026/vision-.git
cd vision-/server

# 2. Set environment variables
export STRIPE_API_KEY=sk_test_your_key_here

# 3. Start all services
docker-compose up -d

# 4. Wait for services to start (~2 minutes)
docker-compose ps

# 5. Test the deployment API
curl http://localhost:8080/health
```

**Services will be available at:**
- API Gateway: http://localhost:8080
- Auth Service: http://localhost:8081
- User Service: http://localhost:8082
- Deploy Service: http://localhost:8083
- Project Service: http://localhost:8084
- Payment Service: http://localhost:8085
- Monitor Service: http://localhost:8086
- Proxy Service: http://localhost:8087
- Database Service: http://localhost:8088

### Option 2: Local Development

For development and testing:

#### Prerequisites

```bash
# Install JDK 17
sudo apt install openjdk-17-jdk  # Ubuntu/Debian
brew install openjdk@17          # macOS

# Install Maven 3.9+
sudo apt install maven           # Ubuntu/Debian
brew install maven              # macOS

# Install PostgreSQL
sudo apt install postgresql      # Ubuntu/Debian
brew install postgresql         # macOS

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### Setup

```bash
# 1. Setup PostgreSQL
sudo -u postgres psql
CREATE DATABASE vision_paas;
CREATE USER vision_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE vision_paas TO vision_user;
\q

# 2. Build all services
cd vision-/server
mvn clean install

# 3. Start services (in separate terminals)
cd blade-gateway && mvn spring-boot:run
cd blade-auth && mvn spring-boot:run
cd vision-deploy && mvn spring-boot:run
# ... etc
```

## 🎯 First Deployment

Deploy your first application:

### 1. Register a User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo123",
    "name": "Demo User"
  }'
```

**Response:**
```json
{
  "code": 200,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "abc123...",
      "email": "demo@example.com",
      "name": "Demo User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Deploy a Next.js App

```bash
curl -X POST http://localhost:8080/api/deploy/auto \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "projectId": "my-nextjs-app",
    "gitUrl": "https://github.com/vercel/next.js/tree/canary/examples/blog-starter"
  }'
```

**Response:**
```json
{
  "code": 200,
  "message": "Deployment initiated",
  "data": {
    "projectId": "my-nextjs-app",
    "status": "RUNNING",
    "projectType": "NEXTJS",
    "port": 3000,
    "hostPort": 32768,
    "logs": "✓ Repository cloned successfully\n✓ Detected project type: Next.js\n✓ Detected port: 3000\n✓ Dockerfile generated\n✓ Image built successfully: sha256:abc123\n✓ Container started: abc123456789\n✓ Container accessible on port: 32768\n✓ Deployment successful! Application is running"
  }
}
```

### 3. Access Your Deployed App

```bash
# Your app is now running at:
http://localhost:32768
```

## 📊 Example Deployments

### Deploy a React App

```bash
curl -X POST http://localhost:8080/api/deploy/auto \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "my-react-app",
    "gitUrl": "https://github.com/facebook/create-react-app"
  }'
```

### Deploy a Spring Boot App

```bash
curl -X POST http://localhost:8080/api/deploy/auto \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "my-spring-app",
    "gitUrl": "https://github.com/spring-projects/spring-boot/tree/main/spring-boot-samples/spring-boot-sample-simple"
  }'
```

### Deploy a Django App

```bash
curl -X POST http://localhost:8080/api/deploy/auto \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "my-django-app",
    "gitUrl": "https://github.com/django/django"
  }'
```

### Deploy with Custom Configuration

```bash
curl -X POST http://localhost:8080/api/deploy/custom \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "my-custom-app",
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

## 🔍 Monitoring & Logs

### View Container Logs

```bash
# View logs for a deployed project
docker logs vision-my-nextjs-app
```

### Check Service Health

```bash
# Check all services
for port in 8080 8081 8082 8083 8084 8085 8086 8087 8088; do
  echo "Port $port:"
  curl -s http://localhost:$port/health || echo "Not available"
done
```

## 🛠️ Troubleshooting

### Services Not Starting

```bash
# Check logs
docker-compose logs -f

# Restart specific service
docker-compose restart vision-deploy

# Rebuild and restart
docker-compose up -d --build
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Connect to database
docker exec -it vision-postgres psql -U postgres -d vision_paas
```

### Port Conflicts

If ports are already in use, edit `docker-compose.yml`:

```yaml
services:
  blade-gateway:
    ports:
      - "9080:8080"  # Change from 8080 to 9080
```

## 📚 Next Steps

1. **Explore the API**: Read the full [API Documentation](./API.md)
2. **Custom Deployments**: Learn about [Advanced Configuration](./ADVANCED.md)
3. **Production Setup**: Follow the [Production Deployment Guide](./PRODUCTION.md)
4. **Monitor Applications**: Setup [Monitoring & Alerts](./MONITORING.md)

## 🆘 Getting Help

- **Documentation**: https://docs.vision-paas.com
- **Issues**: https://github.com/v3ai2026/vision-/issues
- **Community**: https://discord.gg/vision-paas

---

**🎉 Congratulations! You're now running your own PaaS platform!**
