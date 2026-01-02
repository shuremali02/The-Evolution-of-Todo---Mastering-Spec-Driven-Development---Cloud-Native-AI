# Feature Specification: Task CRUD

## Overview

Users can create, read, update, and delete tasks through a web interface. All tasks are private to the authenticated user.

## User Stories

### US-1: Create Task
**As a** logged-in user
**I want to** create a new task with a title and optional description
**So that** I can track things I need to do

**Acceptance Criteria**:
- Task creation requires authentication (JWT)
- Title is mandatory (1-200 characters)
- Description is optional (max 1000 characters)
- New tasks default to `completed = false`
- Task automatically associated with authenticated user
- Cannot create tasks for other users

### US-2: View Task List
**As a** logged-in user
**I want to** see all my tasks
**So that** I know what I need to do

**Acceptance Criteria**:
- Only shows tasks owned by authenticated user
- Tasks ordered by creation date (newest first)
- Shows task ID, title, description, completion status
- Empty state shown when user has no tasks

### US-3: View Task Details
**As a** logged-in user
**I want to** view details of a specific task
**So that** I can see all information about it

**Acceptance Criteria**:
- Can only view own tasks (404 for others' tasks)
- Shows full task information
- Shows timestamps (created, updated)

### US-4: Update Task
**As a** logged-in user
**I want to** edit my task's title and description
**So that** I can keep information current

**Acceptance Criteria**:
- Can only update own tasks
- Can modify title and/or description
- Cannot modify user_id or id
- `updated_at` timestamp automatically updated

### US-5: Mark Task Complete
**As a** logged-in user
**I want to** mark a task as complete
**So that** I can track my progress

**Acceptance Criteria**:
- Toggle completion status
- Can mark complete or incomplete
- Can only modify own tasks

### US-6: Delete Task
**As a** logged-in user
**I want to** delete tasks I no longer need
**So that** my list stays clean

**Acceptance Criteria**:
- Permanent deletion (no soft delete)
- Can only delete own tasks
- Confirmation required in UI

## Functional Requirements

### FR-1: Task Data Model
Tasks MUST have:
- `id` (UUID, auto-generated, immutable)
- `user_id` (UUID, foreign key to users, immutable)
- `title` (string, 1-200 chars, required)
- `description` (string, max 1000 chars, optional)
- `completed` (boolean, default false)
- `created_at` (timestamp, auto-generated)
- `updated_at` (timestamp, auto-updated)

### FR-2: Ownership Rules
- Tasks are ALWAYS owned by exactly one user
- Ownership cannot be transferred
- Users can ONLY access their own tasks
- Backend MUST filter all queries by authenticated `user_id`

### FR-3: Validation Rules
- Title: required, 1-200 characters
- Description: optional, max 1000 characters
- Completed: boolean only (true/false)
- All other fields managed by system

### FR-4: API Endpoints
See `@specs/api/rest-endpoints.md` for complete API contracts:
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks` - List user's tasks
- `GET /api/v1/tasks/{id}` - Get task details
- `PUT /api/v1/tasks/{id}` - Update task
- `PATCH /api/v1/tasks/{id}/complete` - Toggle completion
- `DELETE /api/v1/tasks/{id}` - Delete task

### FR-5: UI Components
See `@specs/ui/components.md` and `@specs/ui/pages.md`:
- Task list page
- Task creation form
- Task detail view
- Task edit form
- Completion toggle button
- Delete confirmation

## Security Requirements

### SR-1: Authentication Required
ALL task operations require valid JWT token.

### SR-2: Authorization Enforcement
Backend MUST verify user_id from JWT matches task ownership before ANY operation.

### SR-3: No Cross-User Access
Users MUST NOT be able to:
- View other users' tasks
- Modify other users' tasks
- Delete other users' tasks
- Create tasks for other users

## Success Criteria

Phase-2 task CRUD is successful when:
1. ✅ Users can create tasks via web UI
2. ✅ Tasks are immediately visible in user's task list
3. ✅ Users can edit their own tasks
4. ✅ Users can mark tasks complete/incomplete
5. ✅ Users can delete their own tasks
6. ✅ Users CANNOT access other users' data
7. ✅ All operations require valid JWT
8. ✅ Backend enforces user_id isolation on all queries

## Out of Scope (Phase-2)

❌ Task sharing or collaboration
❌ Task categories or tags
❌ Due dates or reminders
❌ File attachments
❌ Task priorities
❌ Subtasks or task hierarchy
❌ Bulk operations
❌ Task templates
❌ Export/import functionality

These features may be considered for future phases.

---

**Related Specs**:
- API Endpoints: `@specs/api/rest-endpoints.md`
- Database Schema: `@specs/database/schema.md`
- UI Pages: `@specs/ui/pages.md`
- UI Components: `@specs/ui/components.md`
