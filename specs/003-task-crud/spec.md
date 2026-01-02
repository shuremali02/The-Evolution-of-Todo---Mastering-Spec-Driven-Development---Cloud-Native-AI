# Feature Specification: Task CRUD Operations

## Overview

Complete CRUD (Create, Read, Update, Delete) operations for task management with user isolation.

## User Stories

### US-1: View All Tasks
**As a** logged-in user
**I want to** view all my tasks
**So that** I can see what I need to do

**Acceptance Criteria**:
- Only authenticated users can view tasks
- User sees only their own tasks (never other users' tasks)
- Tasks displayed with title, description, completion status, timestamps
- Empty state shown if no tasks exist

### US-2: Create Task
**As a** logged-in user
**I want to** create a new task
**So that** I can track something I need to do

**Acceptance Criteria**:
- Title is required (1-200 characters)
- Description is optional (max 1000 characters)
- New tasks default to incomplete (completed=false)
- Task automatically associated with authenticated user
- Timestamps (created_at, updated_at) auto-generated

### US-3: View Single Task
**As a** logged-in user
**I want to** view details of a specific task
**So that** I can see full information

**Acceptance Criteria**:
- User can only view their own tasks
- Attempting to view another user's task returns 404
- Task details include all fields

### US-4: Update Task
**As a** logged-in user
**I want to** edit a task's title, description, or completion status
**So that** I can keep my tasks accurate

**Acceptance Criteria**:
- User can only update their own tasks
- Title, description, and completed status can be updated
- updated_at timestamp refreshed on every update
- Attempting to update another user's task returns 404

### US-5: Toggle Task Completion
**As a** logged-in user
**I want to** quickly mark a task as complete or incomplete
**So that** I can track my progress

**Acceptance Criteria**:
- Dedicated endpoint for toggling completion
- User can only toggle their own tasks
- updated_at timestamp refreshed

### US-6: Delete Task
**As a** logged-in user
**I want to** delete a task
**So that** I can remove tasks I no longer need

**Acceptance Criteria**:
- User can only delete their own tasks
- Deletion is permanent (no soft delete in Phase-2)
- Attempting to delete another user's task returns 404

## Functional Requirements

### FR-1: Get All Tasks
**GET /api/v1/tasks**

- **Auth**: JWT required
- **Response**: Array of task objects
- **Filtering**: By authenticated user_id only
- **Ordering**: By created_at descending (newest first)

### FR-2: Create Task
**POST /api/v1/tasks**

- **Auth**: JWT required
- **Request Body**: `{ "title": "string", "description": "string?" }`
- **Validation**:
  - Title: required, 1-200 characters
  - Description: optional, max 1000 characters
- **Response**: Created task object (201)

### FR-3: Get Task by ID
**GET /api/v1/tasks/{task_id}**

- **Auth**: JWT required
- **URL Param**: task_id (UUID)
- **Authorization**: Must belong to authenticated user
- **Response**: Task object (200) or 404

### FR-4: Update Task
**PUT /api/v1/tasks/{task_id}**

- **Auth**: JWT required
- **URL Param**: task_id (UUID)
- **Request Body**: `{ "title": "string?", "description": "string?", "completed": "boolean?" }`
- **Authorization**: Must belong to authenticated user
- **Validation**: Same as create
- **Response**: Updated task object (200) or 404

### FR-5: Toggle Completion
**PATCH /api/v1/tasks/{task_id}/complete**

- **Auth**: JWT required
- **URL Param**: task_id (UUID)
- **Authorization**: Must belong to authenticated user
- **Behavior**: Sets completed=true
- **Response**: Updated task object (200) or 404

### FR-6: Delete Task
**DELETE /api/v1/tasks/{task_id}**

- **Auth**: JWT required
- **URL Param**: task_id (UUID)
- **Authorization**: Must belong to authenticated user
- **Response**: 204 No Content or 404

## Non-Functional Requirements

### NFR-1: Security
- All endpoints require valid JWT token
- User ID extracted from JWT `sub` claim (never from request)
- Database queries always filter by authenticated user_id
- Return 404 (not 403) for unauthorized access to prevent enumeration

### NFR-2: Performance
- GET /api/v1/tasks should return in <200ms for typical user (< 100 tasks)
- Database index on user_id for fast filtering

### NFR-3: Data Integrity
- UUIDs for task IDs (prevent enumeration)
- Foreign key constraint: task.user_id → users.id
- Timestamps in UTC

## Out of Scope (Future Phases)

- Task filtering/search (Phase-3)
- Task sorting options (Phase-3)
- Task categories/tags (Phase-4)
- Task sharing (Phase-5)
- Task attachments (Phase-6)

## Dependencies

- **Prerequisite**: Authentication (002-authentication) must be complete
- **Database**: Users table must exist
- **Backend**: JWT validation middleware must be implemented
- **Frontend**: AuthGuard component must be working

## Success Criteria

1. ✅ All 6 endpoints implemented and tested
2. ✅ User isolation enforced on all operations
3. ✅ Frontend can create, view, update, and delete tasks
4. ✅ No user can access another user's tasks
5. ✅ All acceptance criteria met for each user story

---

**Related Specs**:
- API Endpoints: `@specs/api/rest-endpoints.md`
- Database Schema: `@specs/database/schema.md`
- Architecture: `@specs/architecture.md`
- Authentication: `@specs/002-authentication/spec.md`
