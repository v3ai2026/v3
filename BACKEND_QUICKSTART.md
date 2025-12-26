# Quick Start Guide - Vision Commerce Backend

This guide will help you quickly set up and run the Java Spring Boot backend for Vision Commerce.

## 🚀 Quick Start (Docker Compose - Recommended)

The easiest way to get started is using Docker Compose, which will start all services together:

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/v3ai2026/vision-.git
   cd vision-
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` and add your API keys:**
   ```bash
   # Required
   JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-256-bits
   
   # Optional - for payment features
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   STRIPE_PRO_PRICE_ID=price_xxx
   STRIPE_ENTERPRISE_PRICE_ID=price_xxx
   
   # Optional - for AI features
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start all services:**
   ```bash
   docker-compose up -d
   ```

5. **Verify services are running:**
   ```bash
   docker-compose ps
   ```

   You should see:
   - PostgreSQL running on port 5432
   - Backend API running on port 8080
   - Frontend running on port 5173 (optional)

6. **Test the backend API:**
   ```bash
   curl http://localhost:8080/api/auth/login
   ```

## 🛠️ Local Development Setup

For active development, you may want to run the backend locally:

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

### Steps

1. **Start PostgreSQL:**
   ```bash
   docker run -d \
     --name vision-postgres \
     -e POSTGRES_DB=visiondb \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     postgres:15-alpine
   ```

2. **Initialize database schema:**
   ```bash
   psql -h localhost -U postgres -d visiondb -f supabase-schema.sql
   ```

3. **Set environment variables:**
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_NAME=visiondb
   export DB_USERNAME=postgres
   export DB_PASSWORD=postgres
   export JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-256-bits
   export STRIPE_SECRET_KEY=sk_test_dummy
   export STRIPE_WEBHOOK_SECRET=whsec_dummy
   export STRIPE_PRO_PRICE_ID=price_dummy
   export STRIPE_ENTERPRISE_PRICE_ID=price_dummy
   export GEMINI_API_KEY=dummy-api-key
   ```

4. **Run the backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

5. **Run in development mode:**
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

## 📡 API Endpoints

Once the backend is running, you can test these endpoints:

### Authentication
```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (requires JWT token)
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Projects
```bash
# Get all projects (requires authentication)
curl http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create a project
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "projectType": "web",
    "framework": "react"
  }'
```

## 🧪 Testing

Run the test suite:

```bash
cd backend
./mvnw test
```

Run with coverage:

```bash
./mvnw test jacoco:report
```

## 🏗️ Building for Production

Build the JAR file:

```bash
cd backend
./mvnw clean package -DskipTests
```

The JAR will be created at `backend/target/vision-backend-1.0.0.jar`

Run the JAR:

```bash
java -jar backend/target/vision-backend-1.0.0.jar
```

## 🐳 Docker Deployment

Build Docker image:

```bash
cd backend
docker build -t vision-backend:latest .
```

Run the container:

```bash
docker run -d \
  -p 8080:8080 \
  -e DB_HOST=your_db_host \
  -e DB_NAME=visiondb \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your-secret-key \
  --name vision-backend \
  vision-backend:latest
```

## 🔍 Monitoring

Check application logs:

```bash
# Docker Compose
docker-compose logs -f backend

# Docker
docker logs -f vision-backend

# Local development
tail -f backend/logs/application.log
```

Check application health:

```bash
curl http://localhost:8080/actuator/health
```

## 🛠️ Troubleshooting

### Port 8080 already in use
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Database connection failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check database exists
docker exec -it vision-postgres psql -U postgres -l
```

### JWT secret not set
Make sure you set the `JWT_SECRET` environment variable. It must be at least 256 bits (32 characters).

### Stripe errors
For development, you can use dummy keys. For production, get real keys from Stripe dashboard.

## 📚 Next Steps

1. Read the [backend README](backend/README.md) for detailed documentation
2. Check the [API documentation](backend/API.md) for complete endpoint reference
3. Review [deployment guide](DEPLOYMENT_GUIDE.md) for production deployment
4. Join our community for support

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.
