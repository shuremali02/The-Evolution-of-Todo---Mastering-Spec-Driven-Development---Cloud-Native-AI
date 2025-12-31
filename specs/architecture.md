# System Architecture - Phase-2 Web Application

## Architecture Overview

This system follows a **three-tier architecture** with strict separation between presentation, application, and data layers.

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND TIER                         │
│         Next.js App Router (TypeScript + Tailwind)          │
│                    Port: 3000 (dev)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ REST API over HTTP
                       │ (JSON payloads)
                       │ JWT in Authorization header
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                       BACKEND TIER                           │
│            FastAPI + SQLModel (Python 3.11+)                │
│                    Port: 8000 (dev)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  JWT Middleware (validates all protected requests) │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │     API Routes (/api/v1/*)                         │    │
│  │     - /auth/signup, /auth/login                    │    │
│  │     - /tasks (CRUD operations)                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │     SQLModel ORM (database abstraction)            │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ SQL over TLS
                       │ (asyncpg driver)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                        DATA TIER                             │
│              Neon Serverless PostgreSQL                      │
│                  (Cloud-hosted)                              │
│                                                              │
│  Tables: users, tasks                                        │
│  Indexes: user_id (tasks)                                   │
└──────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Frontend (Next.js)

**Responsibilities**:
- Render UI pages and components
- Capture user input and validate client-side
- Call backend API for data operations
- Manage JWT token storage and attachment
- Handle routing and navigation

**Does NOT**:
- Access database directly
- Implement business logic
- Store sensitive data
- Validate user ownership (trust backend)

### Backend (FastAPI)

**Responsibilities**:
- Validate JWT tokens on protected routes
- Extract user context from JWT
- Enforce user data isolation (filter by `user_id`)
- Implement business logic
- Validate input via Pydantic schemas
- Query database via SQLModel
- Return JSON responses with proper status codes

**Does NOT**:
- Serve HTML or static assets (except API docs)
- Trust client-provided user IDs
- Allow cross-user data access

### Database (Neon PostgreSQL)

**Responsibilities**:
- Persist user and task data
- Enforce foreign key constraints
- Provide indexed queries
- Handle concurrent connections via pooling

**Does NOT**:
- Implement authorization logic
- Generate JWTs
- Validate user input

## Authentication Flow

### Registration Flow
```
User → Frontend Form → POST /api/v1/auth/signup
                              ↓
                        Backend validates input
                              ↓
                        Hash password (bcrypt)
                              ↓
                        Insert into users table
                              ↓
                        Generate JWT
                              ↓
Frontend ← 201 Created + JWT token
    ↓
Store JWT securely
```

### Login Flow
```
User → Frontend Form → POST /api/v1/auth/login
                              ↓
                        Backend validates credentials
                              ↓
                        Query user by email
                              ↓
                        Verify password hash
                              ↓
                        Generate JWT (sub=user_id)
                              ↓
Frontend ← 200 OK + JWT token
    ↓
Store JWT securely
```

### Protected Request Flow
```
User → Frontend Action → GET /api/v1/tasks
                         (Header: Authorization: Bearer <jwt>)
                              ↓
                        JWT Middleware validates token
                              ↓
                        Extract user_id from token.sub
                              ↓
                        Pass user_id to route handler
                              ↓
                        Query tasks WHERE user_id = <extracted_id>
                              ↓
Frontend ← 200 OK + JSON tasks array
```

## Data Isolation Strategy

**Principle**: User ID is the source of truth for ownership, extracted from JWT (NEVER from request body).

### Enforcement Points

1. **JWT Middleware**: Validates token signature and expiration
2. **Dependency Injection**: `get_current_user_id()` extracts user_id from token
3. **Query Filters**: Every database query includes `WHERE user_id = <authenticated_user_id>`
4. **Response Filtering**: Only return data owned by authenticated user

### Example Flow

```python
# CORRECT PATTERN
@router.get("/api/v1/tasks/{task_id}")
async def get_task(
    task_id: str,
    user_id: str = Depends(get_current_user_id)  # From JWT
):
    task = await db.get(Task, id=task_id, user_id=user_id)
    # Can only get task if user_id matches
    return task

# WRONG PATTERN (SECURITY VIOLATION)
@router.get("/api/v1/tasks/{task_id}")
async def get_task(task_id: str, user_id: str):
    # user_id from query param - ATTACKER CAN FORGE
    task = await db.get(Task, id=task_id, user_id=user_id)
    return task
```

## API Design Principles

### 1. Versioning
- All routes prefixed with `/api/v1/`
- Future versions: `/api/v2/` (breaking changes)

### 2. RESTful Conventions
- `GET` for read operations
- `POST` for create operations
- `PUT` for full updates
- `PATCH` for partial updates
- `DELETE` for delete operations

### 3. Status Codes
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing/invalid JWT
- `403 Forbidden`: Valid JWT but insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `422 Unprocessable Entity`: Validation error

### 4. Response Format
```json
{
  "id": "uuid-string",
  "title": "Task title",
  "description": "Optional description",
  "completed": false,
  "user_id": "owner-uuid",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### 5. Error Format
```json
{
  "detail": "Human-readable error message"
}
```

## Database Schema

See `@specs/database/schema.md` for complete schema. Key points:

**users table**:
- `id` (UUID, primary key)
- `email` (unique, indexed)
- `hashed_password`

**tasks table**:
- `id` (UUID, primary key)
- `user_id` (foreign key → users.id, indexed)
- `title`, `description`, `completed`
- `created_at`, `updated_at`

## Security Architecture

### JWT Token Structure
```json
{
  "sub": "user-uuid",           // Subject (user ID)
  "exp": 1735689600,            // Expiration timestamp
  "iat": 1735686000             // Issued at timestamp
}
```

### Token Validation
1. Verify signature using `JWT_SECRET_KEY`
2. Check expiration (`exp` claim)
3. Extract `sub` (user_id)
4. Pass user_id to route handler

### Secrets Management
- `JWT_SECRET_KEY`: Environment variable, NOT in code
- `DATABASE_URL`: Environment variable with credentials
- `BETTER_AUTH_SECRET`: Environment variable for Better Auth

### CORS Policy
- Allowed origins from `ALLOWED_ORIGINS` env variable
- Allow credentials (for httpOnly cookies)
- Allow all HTTP methods
- Allow all headers

## Deployment Architecture (Local Development)

```yaml
# docker-compose.yml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}  # Neon cloud
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
```

**Note**: Neon database is cloud-hosted; no local PostgreSQL container needed.

## Non-Functional Requirements

### Performance
- API response time: < 500ms (p95)
- Database query time: < 200ms
- Frontend page load: < 2s (client-side navigation < 200ms)

### Scalability
- Support 100 concurrent users (Phase-2 target)
- Database connection pooling enabled
- Stateless backend (scales horizontally)

### Reliability
- Database foreign key constraints prevent orphaned tasks
- JWT expiration prevents stale sessions
- Error handling at every layer

### Observability
- FastAPI auto-generates OpenAPI docs at `/docs`
- Structured logging (JSON format)
- Database query logging in development

## Technology Decisions

### Why Next.js App Router?
- Server Components reduce client bundle size
- Built-in routing and layouts
- Industry-standard React framework
- Excellent TypeScript support

### Why FastAPI?
- Automatic OpenAPI documentation
- Built-in Pydantic validation
- Async/await support
- Fast and modern Python framework

### Why SQLModel?
- Combines SQLAlchemy (ORM) + Pydantic (validation)
- Type-safe database models
- Seamless integration with FastAPI

### Why Neon PostgreSQL?
- Serverless (no infrastructure management)
- Auto-scaling and connection pooling
- Fully PostgreSQL-compatible
- Generous free tier for development

### Why Better Auth?
- JWT token generation and validation
- Industry-standard authentication library
- Well-documented and maintained

## Future Considerations (Phase-3+)

- **Chatbot Integration**: API endpoints for conversational interface
- **WebSocket Support**: Real-time updates (deferred to Phase-4)
- **File Uploads**: Task attachments (out of Phase-2 scope)
- **Email Notifications**: Password reset, task reminders (Phase-5+)

---

**Related Specs**:
- API Contracts: `@specs/api/rest-endpoints.md`
- Database Schema: `@specs/database/schema.md`
- Authentication: `@specs/features/authentication.md`
