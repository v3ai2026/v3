# 前端部署到服务器指南

## 📋 部署选项

### 选项 1: Nginx 静态部署（推荐）

#### 1.1 构建前端
```bash
# 在本地或CI/CD中构建
cd vision-
npm install
npm run build

# 构建产物在 dist/ 目录
```

#### 1.2 部署到服务器
```bash
# 方法A: 使用 SCP 上传
scp -r dist/* user@your-server:/var/www/vision-paas/

# 方法B: 使用 rsync
rsync -avz dist/ user@your-server:/var/www/vision-paas/
```

#### 1.3 Nginx 配置
在服务器上创建 `/etc/nginx/sites-available/vision-paas`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/vision-paas;
    index index.html;
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理到后端
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
}
```

启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/vision-paas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 1.4 SSL/HTTPS 配置（Let's Encrypt）
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 自动配置 SSL
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 选项 2: Docker 容器部署

#### 2.1 创建前端 Dockerfile
在项目根目录创建 `Dockerfile.frontend`:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 2.2 创建 nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://blade-gateway:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

#### 2.3 更新 docker-compose.yml
添加前端服务到现有的 docker-compose.yml:

```yaml
services:
  # ... 现有服务 ...
  
  frontend:
    build:
      context: ../
      dockerfile: Dockerfile.frontend
    container_name: vision-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - blade-gateway
    networks:
      - vision-network
    volumes:
      - ./ssl:/etc/nginx/ssl  # SSL 证书（如需要）
```

#### 2.4 部署
```bash
cd server
docker-compose up -d frontend
```

### 选项 3: 与后端一起的完整部署

#### 3.1 完整的 docker-compose.yml
```yaml
version: '3.8'

services:
  # 数据库
  postgres:
    image: postgres:15-alpine
    container_name: vision-postgres
    environment:
      POSTGRES_DB: vision_paas
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - vision-network

  # Redis
  redis:
    image: redis:7-alpine
    container_name: vision-redis
    ports:
      - "6379:6379"
    networks:
      - vision-network

  # 前端
  frontend:
    build:
      context: ../
      dockerfile: Dockerfile.frontend
    container_name: vision-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - blade-gateway
    networks:
      - vision-network
    restart: unless-stopped

  # API 网关
  blade-gateway:
    build: ./blade-gateway
    container_name: blade-gateway
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/vision_paas
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD:-postgres}
    depends_on:
      - postgres
      - redis
    networks:
      - vision-network
    restart: unless-stopped

  # ... 其他后端服务 ...

volumes:
  postgres_data:

networks:
  vision-network:
    driver: bridge
```

#### 3.2 一键部署
```bash
# 1. 设置环境变量
echo "DB_PASSWORD=your_secure_password" > .env

# 2. 构建并启动所有服务
docker-compose up -d

# 3. 查看状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f frontend
```

## 🚀 CI/CD 自动化部署

### GitHub Actions 工作流

创建 `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
    paths:
      - '**.tsx'
      - '**.ts'
      - '**.jsx'
      - '**.js'
      - 'package.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: https://api.your-domain.com
      
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/var/www/vision-paas/"
      
      - name: Reload Nginx
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            sudo nginx -t
            sudo systemctl reload nginx
```

## 🔧 环境变量配置

### 生产环境 .env
```env
# API 后端地址
VITE_API_URL=https://api.your-domain.com

# 前端域名
VITE_APP_URL=https://your-domain.com

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Gemini AI
VITE_GEMINI_API_KEY=your_key
```

### 构建时注入
```bash
# 使用环境变量构建
VITE_API_URL=https://api.production.com npm run build
```

## 📊 性能优化

### 1. CDN 加速
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    
    # 如果使用 CDN
    # add_header X-CDN-Cache "HIT";
}
```

### 2. 启用 Brotli 压缩
```bash
# 安装 Brotli
sudo apt install libnginx-mod-http-brotli

# 在 nginx.conf 添加
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript;
```

### 3. HTTP/2 支持
```nginx
server {
    listen 443 ssl http2;
    # ... 其他配置
}
```

## 🔍 监控和日志

### Nginx 访问日志
```bash
# 实时查看
tail -f /var/log/nginx/access.log

# 分析流量
sudo apt install goaccess
goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED
```

### 前端错误监控
集成 Sentry 或其他监控工具:
```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

## 🛡️ 安全最佳实践

### 1. 安全 Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;" always;
```

### 2. 限流
```nginx
limit_req_zone $binary_remote_addr zone=frontend:10m rate=10r/s;

location / {
    limit_req zone=frontend burst=20 nodelay;
    # ... 其他配置
}
```

### 3. 防火墙
```bash
# UFW 配置
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📞 故障排查

### 常见问题

#### 1. 404 错误（SPA 路由）
确保 Nginx 配置了 `try_files`:
```nginx
try_files $uri $uri/ /index.html;
```

#### 2. API 连接失败
检查代理配置和防火墙:
```bash
curl http://localhost:8080/health
sudo ufw status
```

#### 3. SSL 证书问题
```bash
sudo certbot renew --dry-run
sudo certbot certificates
```

## 🚀 快速部署脚本

```bash
#!/bin/bash
# deploy-frontend.sh

echo "🚀 部署前端..."

# 1. 构建
echo "📦 构建中..."
npm run build

# 2. 上传
echo "📤 上传到服务器..."
rsync -avz --delete dist/ user@server:/var/www/vision-paas/

# 3. 重启 Nginx
echo "🔄 重启 Nginx..."
ssh user@server "sudo nginx -t && sudo systemctl reload nginx"

echo "✅ 部署完成！"
echo "🌐 访问: https://your-domain.com"
```

使用:
```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

---

**需要帮助？** 查看完整文档或提交 Issue！
