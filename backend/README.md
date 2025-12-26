# Vision Commerce - Java Spring Boot Backend

Enterprise-grade REST API backend for Vision Commerce platform built with Spring Boot 3.2.1 and Java 17.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: Complete user profile and account management
- **Project Management**: CRUD operations for project resources
- **Subscription & Billing**: Stripe integration for payment processing
- **AI Integration**: Gemini API for AI-powered code generation
- **Activity Logging**: Track user actions and system events
- **Security**: BCrypt password encryption, CORS configuration, and Spring Security
- **Database**: PostgreSQL with JPA/Hibernate
- **API Documentation**: RESTful API design with standardized responses

## 📋 Tech Stack

- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- Spring Security
- PostgreSQL
- JWT (JJWT 0.12.3)
- Stripe Java SDK 24.0.0
- Lombok
- Maven

## 🛠️ Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+ (or use Docker Compose)
- Stripe Account (for payment features)
- Gemini API Key (for AI features)

## ⚙️ Environment Variables

Create a `.env` file or set the following environment variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=visiondb
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-256-bits
JWT_EXPIRATION=86400000  # 24 hours in milliseconds
JWT_REFRESH_EXPIRATION=604800000  # 7 days in milliseconds

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
```

## 🏃 Quick Start

### Using Maven

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   ./mvnw clean install
   ```

3. **Run the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

The API will be available at `http://localhost:8080`

### Using Docker Compose (Recommended)

From the project root directory:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8080
- Frontend (optional) on port 5173

## 📚 API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Projects (`/api/projects`)

- `GET /api/projects` - Get user's projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Users (`/api/users`)

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update password

### Subscriptions (`/api/subscriptions`)

- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/checkout` - Create checkout session
- `POST /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/webhooks/stripe` - Stripe webhook handler

### Analytics (`/api/analytics`)

- `GET /api/analytics/stats` - Get user statistics
- `GET /api/analytics/trends` - Get usage trends

## 🔒 Security

- **Authentication**: JWT tokens with RS256 algorithm
- **Password Encryption**: BCrypt with salt
- **CORS**: Configurable allowed origins
- **SQL Injection**: Prevented by JPA/Hibernate
- **XSS**: Input validation and sanitization
- **HTTPS**: Recommended for production

## 🧪 Testing

Run tests with:

```bash
./mvnw test
```

Run with coverage:

```bash
./mvnw test jacoco:report
```

## 📦 Building for Production

```bash
./mvnw clean package -DskipTests
```

The JAR file will be in `target/vision-backend-1.0.0.jar`

Run the JAR:

```bash
java -jar target/vision-backend-1.0.0.jar
```

## 🐳 Docker Deployment

Build Docker image:

```bash
docker build -t vision-backend:latest .
```

Run container:

```bash
docker run -p 8080:8080 \
  -e DB_HOST=your_db_host \
  -e JWT_SECRET=your_secret \
  vision-backend:latest
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/vision/
│   │   │   ├── VisionBackendApplication.java
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── service/         # Business logic
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── model/           # JPA entities
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── security/        # Security components
│   │   │   └── exception/       # Exception handling
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/                    # Test files
├── Dockerfile
├── pom.xml
└── README.md
```

## 🔧 Development

### Running in Development Mode

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Hot Reload with Spring DevTools

Spring DevTools is included for automatic restart on file changes.

### Database Migrations

The application uses Hibernate's `ddl-auto` set to `update` for development.
For production, use Flyway or Liquibase for versioned migrations.

## 🚀 Production Deployment

### Best Practices

1. **Environment Variables**: Use secrets management (AWS Secrets Manager, HashiCorp Vault)
2. **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
3. **Monitoring**: Add Spring Boot Actuator and monitoring tools
4. **Logging**: Configure centralized logging (ELK stack)
5. **SSL/TLS**: Use HTTPS with valid certificates
6. **Rate Limiting**: Implement API rate limiting
7. **Caching**: Add Redis for session and data caching

### Cloud Deployment

#### AWS Elastic Beanstalk
```bash
eb init vision-backend
eb create production-env
eb deploy
```

#### Google Cloud Platform
```bash
gcloud app deploy
```

#### Heroku
```bash
heroku create vision-backend
git push heroku main
```

## 🤝 Integration with Frontend

Update frontend `.env.local`:

```env
VITE_API_URL=http://localhost:8080
```

The backend CORS is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `https://*.vercel.app` (Vercel deployments)

## 📊 Monitoring & Health Checks

Health check endpoint:
```
GET /actuator/health
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials
- Ensure firewall allows connection on port 5432

### JWT Token Issues
- Verify JWT_SECRET is set and matches across services
- Check token expiration settings

### Stripe Webhook Failures
- Verify webhook secret matches Stripe dashboard
- Check webhook URL is publicly accessible

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-org/vision-backend/issues)
- Email: support@vision-commerce.com

## 🔗 Related Projects

- [Vision Frontend](../README.md) - React frontend application
- [Vision Mobile](https://github.com/your-org/vision-mobile) - Mobile application

---

Built with ❤️ using Spring Boot
