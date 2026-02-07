# API Contract: Todo Chatbot in Kubernetes

## Overview
This contract defines the API endpoints that remain available after the Todo Chatbot application is deployed to Kubernetes. The containerization and orchestration process preserves all existing functionality.

## Base URL
The API is accessible via the Kubernetes service at:
`http://<frontend-service>:3000/api/v1/` or through ingress at `https://<hostname>/api/v1/`

## Authentication
All protected endpoints continue to require JWT tokens in the Authorization header:
`Authorization: Bearer <jwt-token>`

## Endpoints

### Health Check
```
GET /api/v1/health
```
**Description**: Verify application health in Kubernetes environment
**Response**: 200 OK with health status

### User Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/register
GET /api/v1/auth/profile
POST /api/v1/auth/logout
```
**Description**: User authentication endpoints remain unchanged
**Headers**: Content-Type: application/json
**Response**: 200 OK with user/session data

### Task Management
```
GET /api/v1/tasks
POST /api/v1/tasks
PUT /api/v1/tasks/{task_id}
DELETE /api/v1/tasks/{task_id}
PATCH /api/v1/tasks/{task_id}/complete
```
**Description**: Task CRUD operations remain unchanged
**Headers**: Authorization: Bearer <token>
**Response**: 200 OK with task data

### Chatbot Endpoints
```
POST /api/v1/chat
GET /api/v1/chat/conversations
GET /api/v1/chat/conversations/{conversation_id}/messages
```
**Description**: AI chatbot functionality remains unchanged
**Headers**: Authorization: Bearer <token>
**Response**: 200 OK with conversation/chat data

## Configuration Requirements

### Environment Variables
The Kubernetes deployment must provide these environment variables to containers:

**Backend:**
- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET_KEY: JWT signing key
- BETTER_AUTH_SECRET: Better Auth secret
- MCP_SERVER_HOST: Internal host for MCP server

**Frontend:**
- NEXT_PUBLIC_API_BASE_URL: Base URL for API calls (typically `http://localhost:3000/api/v1` in development or the service URL in Kubernetes)

## Network Configuration

### Service Discovery
- Frontend service name: `todo-frontend-svc`
- Backend service name: `todo-backend-svc`
- Backend port: 8000
- Frontend port: 3000

### Inter-service Communication
The frontend must reach the backend at:
`http://todo-backend-svc:8000/api/v1/`

## Security Requirements

### Ingress Configuration
- TLS termination (if using HTTPS)
- Rate limiting
- Authentication passthrough

### Pod Security
- Minimal required privileges
- ReadOnlyRootFilesystem where possible
- RunAsNonRoot user
- SeccompProfile: runtime/default

## Scaling Requirements

### Resource Limits
- Backend: Minimum 256Mi memory, 250m CPU
- Frontend: Minimum 128Mi memory, 100m CPU

### Horizontal Pod Autoscaling
Configure HPA for both frontend and backend deployments based on CPU utilization.

## Monitoring Endpoints

### Metrics
Both services should expose Prometheus metrics at `/metrics`.

### Health Checks
- Liveness probe: `/api/v1/health/liveness`
- Readiness probe: `/api/v1/health/readiness`