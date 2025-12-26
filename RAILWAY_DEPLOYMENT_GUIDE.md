# Railway Deployment Guide

This guide provides step-by-step instructions for deploying the Vision Commerce platform (frontend and backend microservices) to Railway.

## 📋 Prerequisites

- Railway account (sign up at https://railway.app)
- GitHub repository access
- PostgreSQL database (can be provisioned on Railway)

## 🏗️ Architecture Overview

The platform consists of:
- **Frontend**: React + Vite application
- **Backend**: 6 Java Spring Boot microservices:
  - `blade-gateway` (API Gateway) - Port 8080
  - `blade-auth` (Authentication) - Port 8081
  - `vision-user` (User Management) - Port 8082
  - `vision-deploy` (Deployment Engine) - Port 8083
  - `vision-project` (Project Management) - Port 8084
  - `vision-payment` (Payment Processing) - Port 8085

## 📦 Deployment Configuration Files

### Frontend Configuration
- **File**: `nixpacks.toml` (root directory)
- **Build**: Node.js 18, npm ci with legacy peer deps
- **Start**: Serves static files from `dist/` directory

### Backend Configuration
Each service has its own `nixpacks.toml` in its directory:
- `server/vision-deploy/nixpacks.toml`
- `server/blade-gateway/nixpacks.toml`
- `server/blade-auth/nixpacks.toml`
- `server/vision-user/nixpacks.toml`
- `server/vision-project/nixpacks.toml`
- `server/vision-payment/nixpacks.toml`

All services:
- Use Java 17 and Maven
- Install `vision-common` dependency first
- Build with `mvn clean package -DskipTests`
- Start with dynamic port binding via `$PORT`

## 🚀 Deployment Steps

### Step 1: Deploy PostgreSQL Database

1. Log in to Railway
2. Create a new project
3. Click "New" → "Database" → "Add PostgreSQL"
4. Note the connection details (automatically set as `DATABASE_URL`)

### Step 2: Deploy Frontend

1. In your Railway project, click "New" → "GitHub Repo"
2. Select your repository
3. Configure the service:
   - **Name**: `vision-frontend`
   - **Root Directory**: `/` (leave empty or set to root)
   - **Build Command**: Automatically detected from `nixpacks.toml`
4. Railway will automatically:
   - Detect the `nixpacks.toml` configuration
   - Install dependencies with `npm ci --legacy-peer-deps`
   - Build with `npm run build`
   - Start with `npx serve -s dist -p $PORT`
5. Note the generated URL (e.g., `https://vision-frontend.railway.app`)

### Step 3: Deploy Backend Services

Deploy each backend service **individually** as separate Railway services:

#### 3.1 Deploy blade-gateway (API Gateway)

1. Click "New" → "GitHub Repo" (select same repository)
2. Configure:
   - **Name**: `blade-gateway`
   - **Root Directory**: `server/blade-gateway`
   - **Environment Variables**:
     ```
     DATABASE_URL=${shared PostgreSQL connection}
     DB_USERNAME=postgres
     DB_PASSWORD=${from PostgreSQL service}
     PORT=${{RAILWAY_PUBLIC_PORT}}
     ```
3. Deploy and note the public URL

#### 3.2 Deploy blade-auth (Authentication)

1. Click "New" → "GitHub Repo"
2. Configure:
   - **Name**: `blade-auth`
   - **Root Directory**: `server/blade-auth`
   - **Environment Variables**:
     ```
     DATABASE_URL=${shared PostgreSQL connection}
     DB_USERNAME=postgres
     DB_PASSWORD=${from PostgreSQL service}
     PORT=${{RAILWAY_PUBLIC_PORT}}
     ```

#### 3.3 Deploy vision-user (User Management)

1. Click "New" → "GitHub Repo"
2. Configure:
   - **Name**: `vision-user`
   - **Root Directory**: `server/vision-user`
   - **Environment Variables**:
     ```
     DATABASE_URL=${shared PostgreSQL connection}
     DB_USERNAME=postgres
     DB_PASSWORD=${from PostgreSQL service}
     PORT=${{RAILWAY_PUBLIC_PORT}}
     ```

#### 3.4 Deploy vision-deploy (Deployment Engine)

1. Click "New" → "GitHub Repo"
2. Configure:
   - **Name**: `vision-deploy`
   - **Root Directory**: `server/vision-deploy`
   - **Environment Variables**:
     ```
     DATABASE_URL=${shared PostgreSQL connection}
     DB_USERNAME=postgres
     DB_PASSWORD=${from PostgreSQL service}
     PORT=${{RAILWAY_PUBLIC_PORT}}
     ```

#### 3.5 Deploy vision-project (Project Management)

1. Click "New" → "GitHub Repo"
2. Configure:
   - **Name**: `vision-project`
   - **Root Directory**: `server/vision-project`
   - **Environment Variables**:
     ```
     DATABASE_URL=${shared PostgreSQL connection}
     DB_USERNAME=postgres
     DB_PASSWORD=${from PostgreSQL service}
     PORT=${{RAILWAY_PUBLIC_PORT}}
     ```

#### 3.6 Deploy vision-payment (Payment Processing)

1. Click "New" → "GitHub Repo"
2. Configure:
   - **Name**: `vision-payment`
   - **Root Directory**: `server/vision-payment`
   - **Environment Variables**:
     ```
     DATABASE_URL=${shared PostgreSQL connection}
     DB_USERNAME=postgres
     DB_PASSWORD=${from PostgreSQL service}
     PORT=${{RAILWAY_PUBLIC_PORT}}
     STRIPE_API_KEY=${your Stripe API key}
     STRIPE_WEBHOOK_SECRET=${your Stripe webhook secret}
     ```

### Step 4: Configure Environment Variables

Railway automatically provides `DATABASE_URL` from the PostgreSQL service. You can reference it in other services:

1. Go to PostgreSQL service → Variables
2. Copy the `DATABASE_URL` value
3. In each backend service, add:
   - `DATABASE_URL`: paste the connection string
   - Or use Railway's variable references: `${{Postgres.DATABASE_URL}}`

### Step 5: Verify Deployments

1. **Frontend**: Visit the frontend URL
   - Should display the application interface
   
2. **Backend Services**: Check health endpoints
   - `https://blade-gateway-xxx.railway.app/actuator/health` (if configured)
   - Or check the logs in Railway dashboard

## 🔧 Environment Variables Reference

### Required for All Backend Services
```
PORT=${{RAILWAY_PUBLIC_PORT}}          # Automatically set by Railway
DATABASE_URL=${{Postgres.DATABASE_URL}} # PostgreSQL connection string
DB_USERNAME=postgres                    # Default: postgres
DB_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
```

### Optional for Specific Services

**vision-payment** (additional):
```
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**blade-auth** (additional):
```
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400000
```

## 📊 Monitoring and Logs

1. **View Logs**: Click on each service → "Logs" tab
2. **Deployments**: Click "Deployments" to see build history
3. **Metrics**: Railway provides basic CPU/Memory metrics

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: Build fails with dependency errors
**Solution**: The configuration uses `--legacy-peer-deps` flag, which should handle React 19 dependencies

**Problem**: Application doesn't load
**Solution**: Check that `npm run build` created the `dist/` directory

### Backend Issues

**Problem**: Build fails with "vision-common not found"
**Solution**: The `nixpacks.toml` installs vision-common first. Ensure the parent `pom.xml` is accessible.

**Problem**: Database connection fails
**Solution**: 
- Verify `DATABASE_URL` environment variable is set
- Check PostgreSQL service is running
- Ensure the URL format is correct: `postgresql://user:password@host:port/database`

**Problem**: Port binding error
**Solution**: Services use `${PORT}` from environment, which Railway provides automatically

### Common Issues

**Service crashes on startup**:
1. Check logs for Java exceptions
2. Verify all environment variables are set
3. Ensure database migrations completed

**502 Bad Gateway**:
1. Service might still be starting (Java apps take 30-60 seconds)
2. Check if the service is listening on `$PORT`

## 📝 Post-Deployment Configuration

### Update Frontend API Endpoints

If needed, update the frontend to use the deployed backend URLs:

1. Set environment variables in Railway frontend service:
   ```
   VITE_API_GATEWAY_URL=https://blade-gateway-xxx.railway.app
   VITE_AUTH_URL=https://blade-auth-xxx.railway.app
   ```

2. Or update the frontend code to use the gateway URL

### Setup Service Discovery (Optional)

If using Nacos for service discovery (as configured in `application.yml`):
1. Deploy Nacos as a separate service on Railway
2. Update `spring.cloud.nacos.discovery.server-addr` in all services

## 🎯 Success Criteria

- ✅ Frontend loads at Railway URL
- ✅ All 6 backend services are running
- ✅ PostgreSQL database is connected
- ✅ API Gateway can route requests to services
- ✅ Authentication service issues JWT tokens
- ✅ No errors in service logs

## 🔄 Continuous Deployment

Railway automatically deploys when you push to your GitHub branch:
1. Make changes to your code
2. Commit and push to GitHub
3. Railway detects changes and redeploys affected services

## 📚 Additional Resources

- Railway Documentation: https://docs.railway.app
- Nixpacks Documentation: https://nixpacks.com
- Spring Boot on Railway: https://docs.railway.app/guides/spring-boot

## 🆘 Support

If you encounter issues:
1. Check Railway logs for each service
2. Review the `application.yml` files for configuration
3. Verify environment variables are correctly set
4. Ensure PostgreSQL database is accessible

---

**Note**: This deployment uses Railway's automatic Nixpacks detection. Each service builds and deploys independently, which allows for:
- Independent scaling
- Isolated logs and metrics
- Service-specific rollbacks
- Better fault isolation
