# REST API Endpoints Specification

## Base URL

**Development**: `http://localhost:8000/api/v1`
**Production**: `https://api.yourdomain.com/api/v1`

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Authentication Endpoints

### POST /api/v1/auth/signup

Create a new user account.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Success Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Error Responses**:
- 400: Invalid email or password
- 409: Email already exists
- 422: Validation error

---

### POST /api/v1/auth/login

Authenticate existing user.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Success Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Error Responses**:
- 401: Invalid credentials
- 400: Missing email or password

## Task Endpoints

### GET /api/v1/tasks

Get all tasks for authenticated user.

**Auth Required**: Yes (JWT)

**Query Parameters**: None (filtering out of scope for Phase-2)

**Success Response** (200 OK):
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-01-01T10:00:00Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "title": "Finish project",
    "description": null,
    "completed": true,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-01-01T09:00:00Z",
    "updated_at": "2025-01-01T11:00:00Z"
  }
]
```

**Error Responses**:
- 401: Missing or invalid JWT

---

### POST /api/v1/tasks

Create a new task for authenticated user.

**Auth Required**: Yes (JWT)

**Request Body**:
```json
{
  "title": "New task title",
  "description": "Optional description"
}
```

**Success Response** (201 Created):
```json
{
  "id": "323e4567-e89b-12d3-a456-426614174002",
  "title": "New task title",
  "description": "Optional description",
  "completed": false,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-01-01T12:00:00Z",
  "updated_at": "2025-01-01T12:00:00Z"
}
```

**Error Responses**:
- 401: Missing or invalid JWT
- 400: Title too short/long
- 422: Validation error

---

### GET /api/v1/tasks/{task_id}

Get a specific task by ID (must belong to authenticated user).

**Auth Required**: Yes (JWT)

**URL Parameters**: `task_id` (UUID)

**Success Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

**Error Responses**:
- 401: Missing or invalid JWT
- 404: Task not found or doesn't belong to user

---

### PUT /api/v1/tasks/{task_id}

Update a task (must belong to authenticated user).

**Auth Required**: Yes (JWT)

**URL Parameters**: `task_id` (UUID)

**Request Body**:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Success Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T13:00:00Z"
}
```

**Error Responses**:
- 401: Missing or invalid JWT
- 404: Task not found or doesn't belong to user
- 400: Invalid data
- 422: Validation error

---

### PATCH /api/v1/tasks/{task_id}/complete

Toggle task completion status (must belong to authenticated user).

**Auth Required**: Yes (JWT)

**URL Parameters**: `task_id` (UUID)

**Request Body**: Empty (or optional body for explicit control)

**Success Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T14:00:00Z"
}
```

**Error Responses**:
- 401: Missing or invalid JWT
- 404: Task not found or doesn't belong to user

---

### DELETE /api/v1/tasks/{task_id}

Delete a task (must belong to authenticated user).

**Auth Required**: Yes (JWT)

**URL Parameters**: `task_id` (UUID)

**Success Response** (204 No Content): Empty body

**Error Responses**:
- 401: Missing or invalid JWT
- 404: Task not found or doesn't belong to user

## Security Notes

### User ID Extraction
- `user_id` is ALWAYS extracted from JWT `sub` claim
- Backend NEVER trusts `user_id` from request body or query params
- All queries filter by `WHERE user_id = <jwt_sub>`

### Authorization
- Tasks can only be accessed by their owner
- Attempting to access another user's task returns 404 (not 403) to prevent enumeration

### Rate Limiting (Future)
- Authentication endpoints should be rate-limited
- Out of scope for Phase-2

---

**Related Specs**:
- Architecture: `@specs/architecture.md`
- Database Schema: `@specs/database/schema.md`
- Authentication Feature: `@specs/features/authentication.md`
- Task CRUD Feature: `@specs/features/task-crud.md`
