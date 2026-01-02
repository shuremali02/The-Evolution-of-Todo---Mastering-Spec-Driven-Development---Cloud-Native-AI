# Backend Deployment Guide

## Deploying the Backend API

The backend is ready for deployment using Docker. Here's how to deploy it:

### 1. Environment Variables Setup

Create a `.env` file in the project root with these required variables:

```bash
# Database - Use your Neon PostgreSQL connection string
DATABASE_URL=postgresql+asyncpg://your_username:your_password@ep-xxx.us-east-1.aws.neon.tech/your_db_name

# JWT - Generate a strong secret key
JWT_SECRET_KEY=your-super-secure-random-jwt-secret-key-here

# CORS - Frontend domain(s) that can access the API
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-vercel-domain.vercel.app

# PostgreSQL (for local deployment with docker-compose.backend.yml)
POSTGRES_DB=todo_db
POSTGRES_USER=todo_user
POSTGRES_PASSWORD=todo_password
```

### 2. Production Deployment with Docker Compose

For production deployment, use the backend-specific compose file:

```bash
# Build and start the backend services
docker-compose -f docker-compose.backend.yml up -d --build

# Check the logs
docker-compose -f docker-compose.backend.yml logs -f backend

# Stop the services
docker-compose -f docker-compose.backend.yml down
```

### 3. Single Container Deployment

For simpler deployment, you can run just the backend container:

```bash
# Build the backend image
cd backend
docker build -t hackathon-todo-backend .

# Run with environment variables
docker run -d \
  --name todo-backend \
  -p 8000:8000 \
  -e DATABASE_URL="your_neon_postgres_url" \
  -e JWT_SECRET_KEY="your_jwt_secret" \
  -e ALLOWED_ORIGINS="https://your-frontend.com" \
  hackathon-todo-backend
```

### 4. Database Migrations

The database schema will be automatically managed by Alembic. On first deployment:

```bash
# Run migrations manually if needed
docker exec -it todo-backend alembic upgrade head
```

### 5. Health Check

The backend has a health check endpoint at:
- `GET /health` - Returns service status

### 6. API Documentation

Once deployed, API documentation is available at:
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc documentation

### 7. Vercel Frontend Integration

For your Vercel frontend deployment, set this environment variable:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
```

### 8. Production Considerations

- Use a production-grade PostgreSQL database (Neon is recommended)
- Generate a strong JWT secret key (32+ random characters)
- Set up SSL/TLS for secure connections
- Configure proper logging and monitoring
- Set up backup strategies for the database
- Use a load balancer for high availability if needed

### 9. Scaling

The backend is designed to be stateless and can be scaled horizontally:
- Multiple instances can share the same database
- Session data is stored in JWT tokens (stateless)
- No shared memory or file system dependencies

Your backend is ready for production deployment! 🚀