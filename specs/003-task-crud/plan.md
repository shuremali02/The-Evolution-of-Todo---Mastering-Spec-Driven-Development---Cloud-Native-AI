# Implementation Plan: Task CRUD Operations

**Feature**: 003-task-crud
**Branch**: `003-task-crud`
**Spec**: `specs/003-task-crud/spec.md`
**Status**: Planning Phase
**Created**: 2025-12-31

---

## Executive Summary

This plan details the implementation of complete CRUD operations for task management in the Phase-2 web application. Building on the existing authentication system (002-authentication), this feature adds six REST API endpoints and corresponding frontend components to allow users to create, read, update, and delete their personal tasks.

**Key Deliverables**:
- Task SQLModel with user relationship
- 6 FastAPI endpoints with JWT validation
- Database migration for tasks table
- Frontend task management UI
- Complete user data isolation

**Dependencies**:
- ✅ 002-authentication (complete - signup/login working)
- ✅ JWT validation middleware (implemented)
- ✅ Database connection (Neon PostgreSQL configured)
- ✅ Frontend AuthGuard component (implemented)

---

## Technical Context

### Architecture Pattern
- **Tier**: Three-tier (Frontend → Backend → Database)
- **Communication**: REST API with JSON payloads
- **Authentication**: JWT Bearer tokens
- **Authorization**: User ID from JWT `sub` claim

### Technology Stack

**Backend**:
- FastAPI (Python 3.11+)
- SQLModel (ORM)
- Alembic (migrations)
- Asyncpg (PostgreSQL driver)

**Frontend**:
- Next.js 14 App Router
- TypeScript (strict mode)
- Tailwind CSS
- React Server Components

**Database**:
- Neon Serverless PostgreSQL
- Tables: users (existing), tasks (new)

### Existing Infrastructure

**Already Implemented**:
1. User model with UUID, email, hashed_password
2. JWT token generation and validation
3. Authentication endpoints (/api/v1/auth/signup, /auth/login)
4. Frontend AuthGuard for protected routes
5. Database connection with environment config

**Reusable Components**:
- `app/auth/dependencies.py::get_current_user_id()` - JWT validation
- `app/database.py::get_session()` - Async database session
- `frontend/components/AuthGuard.tsx` - Route protection

---

## Constitution Check

### Phase-2 Compliance

**✅ Technology Stack**:
- FastAPI backend (Phase-2 approved)
- Next.js frontend (Phase-2 approved)
- Neon PostgreSQL (Phase-2 approved)
- JWT authentication (Phase-2 pattern)

**✅ Architecture Rules**:
- Frontend-backend separation maintained
- API-first design (all endpoints under /api/v1/)
- Multi-user data isolation enforced
- JWT validation on all protected routes

**✅ Spec-Driven Process**:
- Feature spec created: `specs/003-task-crud/spec.md`
- Implementation plan (this document)
- Tasks document will follow
- All code will trace to task IDs

**✅ Security Requirements**:
- User ID extracted from JWT (never from request body)
- All queries filter by authenticated user_id
- 404 responses for unauthorized access (prevents enumeration)
- No secrets in code (DATABASE_URL in .env)

**No Constitution Violations**

---

## Phase 0: Research & Decisions

### Research Tasks

#### R-1: SQLModel Foreign Key Relationships
**Question**: How to define foreign key from Task to User in SQLModel?

**Research Findings**:
- SQLModel uses `Field(foreign_key="table.column")` syntax
- Relationship defined with `Relationship(back_populates="field_name")`
- User model needs `tasks` relationship added
- Example pattern already exists in authentication implementation

**Decision**:
```python
# Task model
user_id: str = Field(foreign_key="users.id", nullable=False, index=True)
user: Optional["User"] = Relationship(back_populates="tasks")

# User model (update)
tasks: List["Task"] = Relationship(back_populates="user")
```

**Rationale**: Standard SQLModel pattern, enables efficient joins, index on user_id for fast filtering

---

#### R-2: FastAPI Dependency Injection for JWT
**Question**: How to extract user_id from JWT in every protected endpoint?

**Research Findings**:
- Already implemented in `app/auth/dependencies.py`
- `get_current_user_id()` dependency extracts user_id from JWT
- Returns user_id as string (UUID)
- Raises 401 HTTPException on invalid/missing token

**Decision**: Reuse existing `get_current_user_id` dependency

**Usage Pattern**:
```python
@router.get("/api/v1/tasks")
async def get_tasks(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    # user_id guaranteed valid here
    statement = select(Task).where(Task.user_id == user_id)
    ...
```

**Rationale**: DRY principle, consistent with authentication implementation, centralized JWT validation

---

#### R-3: Alembic Migration Strategy
**Question**: How to create migration for tasks table with foreign key?

**Research Findings**:
- Alembic already configured in `backend/migrations/`
- Previous migration: `001_create_users.py`
- Must import both User and Task models in `migrations/env.py`
- Alembic auto-generates foreign key constraints

**Decision**: Create `002_create_tasks.py` migration

**Migration Contents**:
```python
# Import models
from app.models.user import User
from app.models.task import Task

def upgrade():
    op.create_table(
        'tasks',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tasks_user_id'), 'tasks', ['user_id'], unique=False)
```

**Rationale**: Follows existing migration pattern, creates index for performance, enforces referential integrity

---

#### R-4: Frontend State Management
**Question**: How to manage task state in Next.js App Router?

**Research Findings**:
- App Router uses Server Components by default
- Client Components needed for interactivity (`'use client'`)
- Can use React `useState` for local state
- API calls in `useEffect` or Server Actions

**Decision**: Use Client Components with useState for task list

**Pattern**:
```typescript
'use client'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    const data = await apiClient.get<Task[]>('/api/v1/tasks')
    setTasks(data)
    setLoading(false)
  }

  // ...
}
```

**Rationale**: Simple state management for Phase-2, no need for global state library (Redux/Zustand) with limited feature set

---

#### R-5: Error Handling Strategy
**Question**: How to handle 404 vs 401 errors for tasks?

**Research Findings**:
- 401: Authentication failure (invalid/missing JWT)
- 404: Resource not found OR user doesn't own resource
- Never return 403 (Forbidden) to prevent resource enumeration

**Decision**:
- Check JWT first (return 401 if invalid)
- Query with `WHERE task.id = X AND task.user_id = Y`
- If query returns None → 404 (ambiguous: doesn't exist OR not yours)
- Frontend interprets 404 as "task not found"

**Security Benefit**: Attackers can't enumerate which task IDs exist

**Rationale**: Security best practice (OWASP), consistent with REST API spec

---

## Phase 1: Data Model & Contracts

### Database Schema

#### Task Model (`app/models/task.py`)

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
import uuid

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(foreign_key="users.id", nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: Optional["User"] = Relationship(back_populates="tasks")
```

**Field Justifications**:
- `id`: UUID prevents enumeration
- `title`: Required, varchar(200) reasonable length
- `description`: Optional, text field for details
- `completed`: Boolean, defaults to false
- `user_id`: Foreign key with index for fast queries
- Timestamps: UTC, auto-set on create/update

---

#### User Model Update (`app/models/user.py`)

Add relationship field to existing User model:

```python
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.task import Task

class User(SQLModel, table=True):
    # ... existing fields ...

    # Add relationship
    tasks: List["Task"] = Relationship(back_populates="user")
```

---

### API Contracts

#### Request/Response Schemas (`app/schemas/task.py`)

```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# Create task request
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

# Update task request (all fields optional)
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    completed: Optional[bool] = None

# Task response
class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode)
```

---

### Endpoint Specifications

#### 1. GET /api/v1/tasks

**Purpose**: Retrieve all tasks for authenticated user

**Auth**: Required (JWT)

**Request**: None

**Response** (200 OK):
```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string" | null,
    "completed": boolean,
    "user_id": "uuid",
    "created_at": "ISO 8601",
    "updated_at": "ISO 8601"
  }
]
```

**Errors**:
- 401: Invalid/missing JWT

**Implementation**:
```python
@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    results = await session.execute(statement)
    tasks = results.scalars().all()
    return tasks
```

---

#### 2. POST /api/v1/tasks

**Purpose**: Create new task for authenticated user

**Auth**: Required (JWT)

**Request Body**:
```json
{
  "title": "string (1-200 chars)",
  "description": "string (max 1000 chars)" | null
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string" | null,
  "completed": false,
  "user_id": "uuid",
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
```

**Errors**:
- 401: Invalid/missing JWT
- 400: Title too short/long
- 422: Validation error

**Implementation**:
```python
@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    task = Task(**task_data.model_dump(), user_id=user_id)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task
```

---

#### 3. GET /api/v1/tasks/{task_id}

**Purpose**: Get specific task by ID

**Auth**: Required (JWT)

**URL Params**: `task_id` (UUID)

**Response** (200 OK):
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string" | null,
  "completed": boolean,
  "user_id": "uuid",
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
```

**Errors**:
- 401: Invalid/missing JWT
- 404: Task not found or doesn't belong to user

**Implementation**:
```python
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task
```

---

#### 4. PUT /api/v1/tasks/{task_id}

**Purpose**: Update task fields

**Auth**: Required (JWT)

**URL Params**: `task_id` (UUID)

**Request Body**:
```json
{
  "title": "string" | null,
  "description": "string" | null,
  "completed": boolean | null
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string" | null,
  "completed": boolean,
  "user_id": "uuid",
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
```

**Errors**:
- 401: Invalid/missing JWT
- 404: Task not found or doesn't belong to user
- 400: Invalid data
- 422: Validation error

**Implementation**:
```python
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update fields
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task
```

---

#### 5. PATCH /api/v1/tasks/{task_id}/complete

**Purpose**: Mark task as complete

**Auth**: Required (JWT)

**URL Params**: `task_id` (UUID)

**Request Body**: None

**Response** (200 OK):
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string" | null,
  "completed": true,
  "user_id": "uuid",
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
```

**Errors**:
- 401: Invalid/missing JWT
- 404: Task not found or doesn't belong to user

**Implementation**:
```python
@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = True
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task
```

---

#### 6. DELETE /api/v1/tasks/{task_id}

**Purpose**: Delete task

**Auth**: Required (JWT)

**URL Params**: `task_id` (UUID)

**Request Body**: None

**Response** (204 No Content): Empty

**Errors**:
- 401: Invalid/missing JWT
- 404: Task not found or doesn't belong to user

**Implementation**:
```python
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    await session.delete(task)
    await session.commit()
    return None
```

---

### Quickstart Commands

#### Backend Setup

```bash
# Activate venv
cd backend
source .venv/bin/activate

# Create migration
alembic revision --autogenerate -m "Create tasks table"

# Apply migration
alembic upgrade head

# Start server (with auto-reload)
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

#### Testing

```bash
# Backend API docs
open http://localhost:8000/docs

# Frontend app
open http://localhost:3000

# Test flow:
# 1. Login at /login
# 2. Navigate to /tasks
# 3. Create task via form
# 4. View task list
# 5. Edit/complete/delete tasks
```

---

## Phase 2: Implementation Sequence

### Backend Implementation Order

1. **Create Task Model** (`app/models/task.py`)
   - Define Task SQLModel class
   - Add foreign key to users.id
   - Add relationship back to User

2. **Update User Model** (`app/models/user.py`)
   - Add tasks relationship field
   - Import Task with TYPE_CHECKING

3. **Create Schemas** (`app/schemas/task.py`)
   - TaskCreate (request)
   - TaskUpdate (request)
   - TaskResponse (response)

4. **Create Migration** (`migrations/versions/002_create_tasks.py`)
   - Run `alembic revision --autogenerate -m "Create tasks table"`
   - Review generated migration
   - Apply with `alembic upgrade head`

5. **Create API Router** (`app/api/tasks.py`)
   - Implement all 6 endpoints
   - Use get_current_user_id dependency
   - Ensure user_id filtering on all queries

6. **Register Router** (`app/main.py`)
   - Import tasks_router
   - Add to app with prefix="/api/v1/tasks"

7. **Test Endpoints**
   - Use FastAPI /docs interface
   - Test each CRUD operation
   - Verify JWT validation
   - Verify user isolation

---

### Frontend Implementation Order

1. **Create Types** (`frontend/types/task.ts`)
   - Task interface
   - TaskCreate interface
   - TaskUpdate interface

2. **Create API Client** (`frontend/lib/api-client.ts`)
   - Add getTasks()
   - Add createTask()
   - Add getTask()
   - Add updateTask()
   - Add completeTask()
   - Add deleteTask()

3. **Create Task List Component** (`frontend/components/TaskList.tsx`)
   - Display tasks in table/cards
   - Handle empty state
   - Show loading spinner
   - Show error messages

4. **Create Task Form Component** (`frontend/components/TaskForm.tsx`)
   - Title input (required)
   - Description textarea (optional)
   - Validation
   - Submit handler

5. **Create Tasks Page** (`frontend/app/tasks/page.tsx`)
   - Fetch tasks on mount
   - Render TaskList
   - Render TaskForm
   - Handle create/update/delete actions
   - Update local state after mutations

6. **Add Task Actions**
   - Complete button (toggle completed status)
   - Edit button (show form with pre-filled data)
   - Delete button (with confirmation dialog)

7. **Style Components**
   - Use Tailwind CSS
   - Responsive design
   - Loading states
   - Error states

---

## Gate Checks

### Pre-Implementation Gates

- ✅ Feature spec approved (spec.md complete)
- ✅ Implementation plan approved (this document)
- ✅ All research completed (Phase 0)
- ✅ Dependencies verified (authentication working)

### Post-Backend Gates

- [ ] All 6 endpoints implemented
- [ ] Migration applied successfully
- [ ] All endpoints tested via /docs
- [ ] User isolation verified (test with 2 users)
- [ ] No SQL injection vulnerabilities
- [ ] Proper error responses (401, 404, 422)

### Post-Frontend Gates

- [ ] Tasks page loads without errors
- [ ] Can create task via form
- [ ] Can view task list
- [ ] Can edit task
- [ ] Can complete task
- [ ] Can delete task
- [ ] AuthGuard protects /tasks route
- [ ] Loading states implemented
- [ ] Error handling implemented

### Integration Gates

- [ ] End-to-end flow tested (signup → login → CRUD tasks → logout)
- [ ] Multi-user isolation verified
- [ ] JWT expiration handled correctly
- [ ] No console errors in browser
- [ ] Backend logs show no errors

---

## Risks & Mitigation

### Risk 1: Database Migration Conflicts
**Risk**: Migration fails if tasks table already exists

**Mitigation**:
- Check database state before migration
- Use `alembic downgrade` if needed
- Version control all migration files

### Risk 2: Foreign Key Constraint Violations
**Risk**: Cannot create task if user_id doesn't exist

**Mitigation**:
- Users table already exists (from 002-authentication)
- JWT validation ensures user exists before task creation
- Foreign key constraint catches invalid user_ids

### Risk 3: Race Conditions on Update
**Risk**: Two simultaneous updates could conflict

**Mitigation**:
- Database handles concurrency with transactions
- Last write wins (acceptable for Phase-2)
- Future: Add optimistic locking with version field

### Risk 4: Large Task Lists Performance
**Risk**: Fetching 1000+ tasks could be slow

**Mitigation**:
- Index on user_id for fast filtering
- Neon connection pooling handles concurrent requests
- Future: Add pagination (Phase-3)

---

## Success Criteria

### Functional Criteria

1. ✅ User can create task with title and optional description
2. ✅ User can view all their tasks (sorted by creation date)
3. ✅ User can view single task details
4. ✅ User can update task title, description, or completion status
5. ✅ User can quickly mark task as complete
6. ✅ User can delete task
7. ✅ User cannot access other users' tasks
8. ✅ Unauthenticated users redirected to login

### Technical Criteria

1. ✅ All endpoints follow REST conventions
2. ✅ All endpoints under /api/v1/ prefix
3. ✅ JWT validation on all protected routes
4. ✅ User ID extracted from JWT (never from request)
5. ✅ All database queries filter by user_id
6. ✅ Proper HTTP status codes (200, 201, 204, 401, 404)
7. ✅ Input validation via Pydantic schemas
8. ✅ No SQL injection vulnerabilities
9. ✅ No secrets in git repository
10. ✅ All code traced to task IDs

### Quality Criteria

1. ✅ No console errors in frontend
2. ✅ No exceptions in backend logs (except expected 404/401)
3. ✅ Responsive UI works on mobile
4. ✅ Loading states provide user feedback
5. ✅ Error messages are user-friendly
6. ✅ Code follows project conventions (TypeScript strict, Python type hints)
7. ✅ All files have task ID attribution comments

---

## Deliverables

### Backend Files

1. `backend/app/models/task.py` - Task SQLModel
2. `backend/app/schemas/task.py` - Pydantic schemas
3. `backend/app/api/tasks.py` - API endpoints router
4. `backend/migrations/versions/002_create_tasks.py` - Database migration
5. Update: `backend/app/models/user.py` - Add tasks relationship
6. Update: `backend/app/main.py` - Register tasks router

### Frontend Files

1. `frontend/types/task.ts` - TypeScript interfaces
2. `frontend/lib/api-client.ts` - API methods (update)
3. `frontend/components/TaskList.tsx` - Task list component
4. `frontend/components/TaskForm.tsx` - Task form component
5. `frontend/components/TaskItem.tsx` - Individual task component
6. `frontend/app/tasks/page.tsx` - Tasks page (update)

### Documentation

1. Update: `specs/api/rest-endpoints.md` - Mark task endpoints as implemented
2. Update: `specs/database/schema.md` - Add tasks table schema
3. Update: `README.md` - Add task CRUD to features list

---

## Next Steps

1. **Generate Tasks Document**: Run `/sp.tasks` to break down this plan into individual implementation tasks
2. **Implement Backend**: Start with Task model and migration
3. **Implement Frontend**: Build UI after backend endpoints are tested
4. **Integration Testing**: Test complete user flows
5. **Commit & PR**: Create pull request with all changes

---

**Plan Status**: ✅ Complete - Ready for task generation
**Estimated Effort**: 8-12 hours development time
**Dependencies**: All satisfied (authentication complete)
**Blockers**: None

