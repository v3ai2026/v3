package com.vision.paas.deploy.generator;

import com.vision.paas.common.enums.ProjectType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Dockerfile Generator
 * Auto-generates optimized Dockerfiles based on project type
 */
@Slf4j
@Service
public class DockerfileGenerator {
    
    public String generate(ProjectType projectType, String repoPath, int port) {
        log.info("Generating Dockerfile for {} on port {}", projectType, port);
        
        return switch (projectType) {
            case NEXTJS -> generateNextjsDockerfile(port);
            case REACT -> generateReactDockerfile(port);
            case VUE -> generateVueDockerfile(port);
            case ANGULAR -> generateAngularDockerfile(port);
            case SVELTE -> generateSvelteDockerfile(port);
            case NUXT -> generateNuxtDockerfile(port);
            case SPRING_BOOT, SPRING_CLOUD -> generateSpringBootDockerfile(port);
            case MICRONAUT -> generateMicronautDockerfile(port);
            case QUARKUS -> generateQuarkusDockerfile(port);
            case DJANGO -> generateDjangoDockerfile(port);
            case FLASK -> generateFlaskDockerfile(port);
            case FASTAPI -> generateFastAPIDockerfile(port);
            case EXPRESS, NESTJS, KOA -> generateNodeBackendDockerfile(port);
            case GO, GIN -> generateGoDockerfile(port);
            case RAILS -> generateRailsDockerfile(port);
            case LARAVEL -> generateLaravelDockerfile(port);
            case STATIC_HTML -> generateStaticDockerfile(port);
            case GATSBY -> generateGatsbyDockerfile(port);
            case HUGO -> generateHugoDockerfile(port);
            case JEKYLL -> generateJekyllDockerfile(port);
            default -> generateGenericDockerfile(port);
        };
    }
    
    private String generateNextjsDockerfile(int port) {
        return """
                # Next.js Optimized Dockerfile
                FROM node:18-alpine AS base
                
                # Install dependencies only when needed
                FROM base AS deps
                RUN apk add --no-cache libc6-compat
                WORKDIR /app
                
                COPY package*.json ./
                RUN npm ci
                
                # Build the app
                FROM base AS builder
                WORKDIR /app
                COPY --from=deps /app/node_modules ./node_modules
                COPY . .
                
                ENV NEXT_TELEMETRY_DISABLED 1
                RUN npm run build
                
                # Production image
                FROM base AS runner
                WORKDIR /app
                
                ENV NODE_ENV production
                ENV NEXT_TELEMETRY_DISABLED 1
                
                RUN addgroup --system --gid 1001 nodejs
                RUN adduser --system --uid 1001 nextjs
                
                COPY --from=builder /app/public ./public
                COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
                COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
                
                USER nextjs
                
                EXPOSE %d
                ENV PORT %d
                
                CMD ["node", "server.js"]
                """.formatted(port, port);
    }
    
    private String generateReactDockerfile(int port) {
        return """
                # React Build Dockerfile
                FROM node:18-alpine AS build
                WORKDIR /app
                
                COPY package*.json ./
                RUN npm ci
                
                COPY . .
                RUN npm run build
                
                # Production stage with Nginx
                FROM nginx:alpine
                COPY --from=build /app/build /usr/share/nginx/html
                
                # Custom nginx config
                RUN echo 'server { \\
                    listen %d; \\
                    location / { \\
                        root /usr/share/nginx/html; \\
                        index index.html index.htm; \\
                        try_files $uri $uri/ /index.html; \\
                    } \\
                }' > /etc/nginx/conf.d/default.conf
                
                EXPOSE %d
                CMD ["nginx", "-g", "daemon off;"]
                """.formatted(port, port);
    }
    
    private String generateVueDockerfile(int port) {
        return """
                # Vue.js Build Dockerfile
                FROM node:18-alpine AS build
                WORKDIR /app
                
                COPY package*.json ./
                RUN npm ci
                
                COPY . .
                RUN npm run build
                
                # Production stage with Nginx
                FROM nginx:alpine
                COPY --from=build /app/dist /usr/share/nginx/html
                
                # Custom nginx config
                RUN echo 'server { \\
                    listen %d; \\
                    location / { \\
                        root /usr/share/nginx/html; \\
                        index index.html index.htm; \\
                        try_files $uri $uri/ /index.html; \\
                    } \\
                }' > /etc/nginx/conf.d/default.conf
                
                EXPOSE %d
                CMD ["nginx", "-g", "daemon off;"]
                """.formatted(port, port);
    }
    
    private String generateAngularDockerfile(int port) {
        return """
                # Angular Build Dockerfile
                FROM node:18-alpine AS build
                WORKDIR /app
                
                COPY package*.json ./
                RUN npm ci
                
                COPY . .
                RUN npm run build -- --configuration production
                
                # Production stage with Nginx
                FROM nginx:alpine
                COPY --from=build /app/dist /usr/share/nginx/html
                
                RUN echo 'server { \\
                    listen %d; \\
                    location / { \\
                        root /usr/share/nginx/html; \\
                        index index.html; \\
                        try_files $uri $uri/ /index.html; \\
                    } \\
                }' > /etc/nginx/conf.d/default.conf
                
                EXPOSE %d
                CMD ["nginx", "-g", "daemon off;"]
                """.formatted(port, port);
    }
    
    private String generateSvelteDockerfile(int port) {
        return """
                # Svelte Build Dockerfile
                FROM node:18-alpine AS build
                WORKDIR /app
                
                COPY package*.json ./
                RUN npm ci
                
                COPY . .
                RUN npm run build
                
                # Production stage with Nginx
                FROM nginx:alpine
                COPY --from=build /app/public /usr/share/nginx/html
                
                RUN echo 'server { \\
                    listen %d; \\
                    location / { \\
                        root /usr/share/nginx/html; \\
                        index index.html; \\
                        try_files $uri $uri/ /index.html; \\
                    } \\
                }' > /etc/nginx/conf.d/default.conf
                
                EXPOSE %d
                CMD ["nginx", "-g", "daemon off;"]
                """.formatted(port, port);
    }
    
    private String generateNuxtDockerfile(int port) {
        return """
                # Nuxt.js Dockerfile
                FROM node:18-alpine
                WORKDIR /app
                
                COPY package*.json ./
                RUN npm ci
                
                COPY . .
                RUN npm run build
                
                ENV NODE_ENV production
                
                EXPOSE %d
                ENV PORT %d
                
                CMD ["npm", "run", "start"]
                """.formatted(port, port);
    }
    
    private String generateSpringBootDockerfile(int port) {
        return """
                # Spring Boot Multi-stage Dockerfile
                FROM maven:3.9-eclipse-temurin-17 AS build
                WORKDIR /app
                
                COPY pom.xml .
                RUN mvn dependency:go-offline
                
                COPY src ./src
                RUN mvn clean package -DskipTests
                
                # Production stage
                FROM eclipse-temurin:17-jre-alpine
                WORKDIR /app
                
                COPY --from=build /app/target/*.jar app.jar
                
                EXPOSE %d
                
                ENTRYPOINT ["java", "-jar", "-Dserver.port=%d", "app.jar"]
                """.formatted(port, port);
    }
    
    private String generateMicronautDockerfile(int port) {
        return """
                # Micronaut Dockerfile
                FROM gradle:8-jdk17 AS build
                WORKDIR /app
                
                COPY build.gradle settings.gradle ./
                COPY gradle ./gradle
                RUN gradle dependencies
                
                COPY src ./src
                RUN gradle build -x test
                
                FROM eclipse-temurin:17-jre-alpine
                WORKDIR /app
                
                COPY --from=build /app/build/libs/*-all.jar app.jar
                
                EXPOSE %d
                
                ENTRYPOINT ["java", "-jar", "app.jar"]
                """.formatted(port);
    }
    
    private String generateQuarkusDockerfile(int port) {
        return """
                # Quarkus Native Dockerfile
                FROM maven:3.9-eclipse-temurin-17 AS build
                WORKDIR /app
                
                COPY pom.xml .
                RUN mvn dependency:go-offline
                
                COPY src ./src
                RUN mvn package -Pnative -DskipTests
                
                FROM registry.access.redhat.com/ubi8/ubi-minimal
                WORKDIR /app
                
                COPY --from=build /app/target/*-runner /app/application
                
                EXPOSE %d
                
                CMD ["./application"]
                """.formatted(port);
    }
    
    private String generateDjangoDockerfile(int port) {
        return """
                # Django Dockerfile
                FROM python:3.11-slim
                WORKDIR /app
                
                ENV PYTHONUNBUFFERED=1
                ENV PYTHONDONTWRITEBYTECODE=1
                
                COPY requirements.txt .
                RUN pip install --no-cache-dir -r requirements.txt
                
                COPY . .
                
                RUN python manage.py collectstatic --noinput || true
                RUN python manage.py migrate || true
                
                EXPOSE %d
                
                CMD ["gunicorn", "--bind", "0.0.0.0:%d", "wsgi:application"]
                """.formatted(port, port);
    }
    
    private String generateFlaskDockerfile(int port) {
        return """
                # Flask Dockerfile
                FROM python:3.11-slim
                WORKDIR /app
                
                ENV PYTHONUNBUFFERED=1
                
                COPY requirements.txt .
                RUN pip install --no-cache-dir -r requirements.txt
                
                COPY . .
                
                EXPOSE %d
                ENV FLASK_APP=app.py
                
                CMD ["gunicorn", "--bind", "0.0.0.0:%d", "--workers", "4", "app:app"]
                """.formatted(port, port);
    }
    
    private String generateFastAPIDockerfile(int port) {
        return """
                # FastAPI Dockerfile
                FROM python:3.11-slim
                WORKDIR /app
                
                ENV PYTHONUNBUFFERED=1
                
                COPY requirements.txt .
                RUN pip install --no-cache-dir -r requirements.txt
                
                COPY . .
                
                EXPOSE %d
                
                CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "%d"]
                """.formatted(port, port);
    }
    
    private String generateNodeBackendDockerfile(int port) {
        return """
                # Node.js Backend Dockerfile
                FROM node:18-alpine
                WORKDIR /app
                
                COPY package*.json ./
                RUN npm ci --only=production
                
                COPY . .
                
                ENV NODE_ENV=production
                ENV PORT=%d
                
                EXPOSE %d
                
                CMD ["npm", "start"]
                """.formatted(port, port);
    }
    
    private String generateGoDockerfile(int port) {
        return """
                # Go Multi-stage Dockerfile
                FROM golang:1.21-alpine AS build
                WORKDIR /app
                
                COPY go.mod go.sum ./
                RUN go mod download
                
                COPY . .
                RUN CGO_ENABLED=0 GOOS=linux go build -o main .
                
                # Production stage
                FROM alpine:latest
                WORKDIR /app
                
                RUN apk --no-cache add ca-certificates
                
                COPY --from=build /app/main .
                
                EXPOSE %d
                ENV PORT=%d
                
                CMD ["./main"]
                """.formatted(port, port);
    }
    
    private String generateRailsDockerfile(int port) {
        return """
                # Ruby on Rails Dockerfile
                FROM ruby:3.2-alpine
                WORKDIR /app
                
                RUN apk add --no-cache build-base postgresql-dev nodejs yarn
                
                COPY Gemfile Gemfile.lock ./
                RUN bundle install
                
                COPY . .
                
                RUN rails assets:precompile || true
                
                EXPOSE %d
                
                CMD ["rails", "server", "-b", "0.0.0.0", "-p", "%d"]
                """.formatted(port, port);
    }
    
    private String generateLaravelDockerfile(int port) {
        return """
                # Laravel Dockerfile
                FROM php:8.2-fpm-alpine
                WORKDIR /app
                
                RUN apk add --no-cache nginx composer
                
                COPY composer.json composer.lock ./
                RUN composer install --no-scripts --no-autoloader
                
                COPY . .
                RUN composer dump-autoload --optimize
                
                EXPOSE %d
                
                CMD ["php-fpm"]
                """.formatted(port);
    }
    
    private String generateStaticDockerfile(int port) {
        return """
                # Static HTML Dockerfile
                FROM nginx:alpine
                
                COPY . /usr/share/nginx/html
                
                RUN echo 'server { \\
                    listen %d; \\
                    location / { \\
                        root /usr/share/nginx/html; \\
                        index index.html; \\
                    } \\
                }' > /etc/nginx/conf.d/default.conf
                
                EXPOSE %d
                
                CMD ["nginx", "-g", "daemon off;"]
                """.formatted(port, port);
    }
    
    private String generateGatsbyDockerfile(int port) {
        return """
                # Gatsby Build Dockerfile
                FROM node:18-alpine AS build
                WORKDIR /app
                
                COPY package*.json ./
                RUN npm ci
                
                COPY . .
                RUN npm run build
                
                FROM nginx:alpine
                COPY --from=build /app/public /usr/share/nginx/html
                
                RUN echo 'server { \\
                    listen %d; \\
                    location / { \\
                        root /usr/share/nginx/html; \\
                        index index.html; \\
                        try_files $uri $uri/ /index.html; \\
                    } \\
                }' > /etc/nginx/conf.d/default.conf
                
                EXPOSE %d
                CMD ["nginx", "-g", "daemon off;"]
                """.formatted(port, port);
    }
    
    private String generateHugoDockerfile(int port) {
        return """
                # Hugo Build Dockerfile
                FROM alpine:latest AS build
                WORKDIR /app
                
                RUN apk add --no-cache hugo
                
                COPY . .
                RUN hugo
                
                FROM nginx:alpine
                COPY --from=build /app/public /usr/share/nginx/html
                
                RUN echo 'server { \\
                    listen %d; \\
                    location / { \\
                        root /usr/share/nginx/html; \\
                        index index.html; \\
                    } \\
                }' > /etc/nginx/conf.d/default.conf
                
                EXPOSE %d
                CMD ["nginx", "-g", "daemon off;"]
                """.formatted(port, port);
    }
    
    private String generateJekyllDockerfile(int port) {
        return """
                # Jekyll Build Dockerfile
                FROM ruby:3.2-alpine AS build
                WORKDIR /app
                
                RUN apk add --no-cache build-base
                RUN gem install jekyll bundler
                
                COPY Gemfile* ./
                RUN bundle install
                
                COPY . .
                RUN jekyll build
                
                FROM nginx:alpine
                COPY --from=build /app/_site /usr/share/nginx/html
                
                RUN echo 'server { \\
                    listen %d; \\
                    location / { \\
                        root /usr/share/nginx/html; \\
                        index index.html; \\
                    } \\
                }' > /etc/nginx/conf.d/default.conf
                
                EXPOSE %d
                CMD ["nginx", "-g", "daemon off;"]
                """.formatted(port, port);
    }
    
    private String generateGenericDockerfile(int port) {
        return """
                # Generic Dockerfile
                FROM alpine:latest
                WORKDIR /app
                
                COPY . .
                
                EXPOSE %d
                
                CMD ["sh", "-c", "echo 'Application started on port %d'"]
                """.formatted(port, port);
    }
}
