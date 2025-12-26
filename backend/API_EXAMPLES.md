# Vision Backend API Examples

Collection of example API requests for testing the Vision Commerce backend.

## Authentication

### Register a New User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "fullName": "John Doe"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "subscriptionTier": "free",
      "aiCredits": 100
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Current User

```bash
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Refresh Token

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Projects

### Get All Projects

```bash
curl http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Project by ID

```bash
curl http://localhost:8080/api/projects/{PROJECT_ID} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create a New Project

```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Website",
    "description": "Modern e-commerce platform with React",
    "projectType": "web",
    "framework": "react",
    "isPublic": false,
    "tags": ["react", "e-commerce", "typescript"]
  }'
```

### Update a Project

```bash
curl -X PUT http://localhost:8080/api/projects/{PROJECT_ID} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description",
    "status": "completed"
  }'
```

### Delete a Project

```bash
curl -X DELETE http://localhost:8080/api/projects/{PROJECT_ID} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## User Profile

### Get User Profile

```bash
curl http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update User Profile

```bash
curl -X PUT http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "bio": "Full-stack developer passionate about building great products",
    "company": "Tech Corp",
    "website": "https://johnsmith.dev",
    "location": "San Francisco, CA"
  }'
```

### Update Password

```bash
curl -X PUT http://localhost:8080/api/users/password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPass123",
    "newPassword": "NewSecurePass456"
  }'
```

## Subscriptions

### Get Current Subscription

```bash
curl http://localhost:8080/api/subscriptions/current \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Checkout Session

```bash
curl -X POST http://localhost:8080/api/subscriptions/checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planName": "pro",
    "successUrl": "http://localhost:5173/billing?success=true",
    "cancelUrl": "http://localhost:5173/billing?canceled=true"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Checkout session created",
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```

### Cancel Subscription

```bash
curl -X POST http://localhost:8080/api/subscriptions/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Analytics

### Get User Statistics

```bash
curl http://localhost:8080/api/analytics/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "totalProjects": 15,
    "completedProjects": 8,
    "draftProjects": 7
  }
}
```

### Get Usage Trends

```bash
curl http://localhost:8080/api/analytics/trends \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Using with Postman or Insomnia

1. Import this collection
2. Set base URL: `http://localhost:8080`
3. After login, save the JWT token
4. Add token to requests:
   - Header: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  }
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or token invalid
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Testing Tips

1. **Save your JWT token** after login for subsequent requests
2. **Token expires after 24 hours** - use refresh endpoint to get new token
3. **Use environment variables** in tools like Postman for easier testing
4. **Check response status codes** to understand what happened
5. **Review error messages** for debugging information

## WebHook Testing (Stripe)

To test Stripe webhooks locally:

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:8080/api/subscriptions/webhooks/stripe
   ```

4. Use the webhook signing secret provided by CLI in your `.env` file

5. Trigger test events:
   ```bash
   stripe trigger payment_intent.succeeded
   ```
