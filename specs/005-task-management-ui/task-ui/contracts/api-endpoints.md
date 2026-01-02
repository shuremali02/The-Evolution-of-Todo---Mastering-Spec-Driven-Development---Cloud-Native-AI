# API Contracts: Task Management UI Enhancements

## Overview

These contracts extend the existing task API with new fields and endpoints for the UI enhancements.

## Base URL

```
/api/v1
```

## Task Endpoints

### GET /tasks

Get all tasks with optional filtering, sorting, and search.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | "" | Search in title and description |
| `filter` | string | No | "all" | Filter by status: "all", "active", "completed" |
| `sort` | string | No | "newest" | Sort order: "newest", "oldest", "title_asc", "title_desc", "priority", "due_date" |
| `limit` | int | No | 100 | Max results |
| `offset` | int | No | 0 | Pagination offset |

**Response:**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "user_id": "uuid",
      "priority": "medium",
      "due_date": "2026-01-15T10:00:00Z",
      "position": 0,
      "created_at": "2026-01-02T10:00:00Z",
      "updated_at": "2026-01-02T10:00:00Z"
    }
  ],
  "total": 10,
  "limit": 100,
  "offset": 0
}
```

### POST /tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Optional description",
  "priority": "high",
  "due_date": "2026-01-15T10:00:00Z"
}
```

**Response:** Same as GET task object, with `position` auto-assigned.

### GET /tasks/{task_id}

Get single task by ID.

**Response:** Single task object.

### PUT /tasks/{task_id}

Update an existing task.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "low",
  "due_date": "2026-01-20T10:00:00Z"
}
```

**Response:** Updated task object.

### PATCH /tasks/{task_id}/complete

Toggle task completion.

**Response:** Updated task object with `completed` toggled.

### DELETE /tasks/{task_id}

Delete a task.

**Response:** `204 No Content`

### PATCH /tasks/reorder

Reorder tasks via drag and drop.

**Request Body:**
```json
{
  "task_ids": ["id1", "id2", "id3", "id4", "id5"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tasks reordered successfully"
}
```

## Error Responses

All endpoints use standard error format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized (invalid/missing JWT)
- `404` - Not found
- `422` - Validation error
- `500` - Server error

## Authentication

All endpoints (except POST /auth/*) require:
```
Authorization: Bearer <jwt_token>
```

## Priority Enum

```typescript
type TaskPriority = 'low' | 'medium' | 'high'
```

## Date Format

All dates use ISO 8601 format:
```
YYYY-MM-DDTHH:mm:ssZ
```
