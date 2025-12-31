# Backend Rules - FastAPI + SQLModel + Neon PostgreSQL

## Stack Requirements

### Framework & Language
- **Framework**: FastAPI (latest stable version)
- **Language**: Python 3.11+
- **ORM**: SQLModel (combines SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Auth**: Better Auth with JWT tokens
- **Validation**: Pydantic v2 models

### Project Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI application entry
│   ├── api/                 # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py          # Authentication endpoints
│   │   └── tasks.py         # Task CRUD endpoints
│   ├── models/              # SQLModel database models
│   │   ├── __init__.py
│   │   ├── user.py          # User model
│   │   └── task.py          # Task model
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── task.py
│   ├── auth/                # Authentication logic
│   │   ├── __init__.py
│   │   ├── jwt.py           # JWT token handling
│   │   └── dependencies.py  # Auth dependencies
│   ├── database.py          # Database connection
│   └── config.py            # Configuration management
├── migrations/              # Alembic migrations
│   └── versions/
├── tests/                   # Test files
│   ├── test_auth.py
│   └── test_tasks.py
├── requirements.txt         # Python dependencies
└── .env.example            # Environment variable template
```

## Core Mandates

### 1. Spec-Driven Development

**Before writing ANY endpoint**, you MUST:

1. Read `@specs/api/rest-endpoints.md` for API contracts
2. Read `@specs/database/schema.md` for data models
3. Read `@specs/features/authentication.md` for auth requirements
4. Verify the work traces to a valid Task ID

**NEVER** create endpoints from memory or assumptions.

### 2. All Routes Under `/api/v1/`

Every API endpoint MUST be prefixed with `/api/v1/`:

```python
# ✅ CORRECT
@router.get("/api/v1/tasks")
@router.post("/api/v1/tasks")
@router.get("/api/v1/tasks/{task_id}")

# ❌ WRONG
@router.get("/tasks")
```

### 3. JWT Verification Middleware (MANDATORY)

**All protected endpoints** MUST validate JWT tokens:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt import decode_jwt

security = HTTPBearer()

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Extract and validate JWT token, return user_id.

    Task: T-XXX
    Spec: X.X JWT Verification
    """
    token = credentials.credentials

    try:
        payload = decode_jwt(token)
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )

        return user_id

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


# Use in protected endpoints
@router.get("/api/v1/tasks")
async def get_tasks(user_id: str = Depends(get_current_user_id)):
    # user_id is now guaranteed to be valid
    tasks = await Task.get_by_user(user_id)
    return tasks
```

### 4. User Data Isolation (MANDATORY)

**Every database query** for user-owned resources MUST filter by `user_id`:

```python
# ✅ CORRECT - Always filter by authenticated user_id
@router.get("/api/v1/tasks")
async def get_tasks(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.user_id == user_id)
    results = await session.execute(statement)
    tasks = results.scalars().all()
    return tasks


# ❌ WRONG - Returns all tasks from all users
@router.get("/api/v1/tasks")
async def get_tasks(session: AsyncSession = Depends(get_session)):
    statement = select(Task)  # SECURITY VIOLATION!
    results = await session.execute(statement)
    tasks = results.scalars().all()
    return tasks
```

### 5. Database Connection via `DATABASE_URL`

Use environment variable for database connection:

```python
# app/database.py
from sqlmodel import create_engine, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# For async operations (recommended)
engine = create_async_engine(DATABASE_URL, echo=True)

async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
```

### 6. Pydantic Schemas for Validation

Define separate schemas for requests and responses:

```python
# Task: T-XXX
# Spec: X.X Task Schemas

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# Request schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    completed: Optional[bool] = None

# Response schemas
class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2
```

## File Attribution

Every Python file MUST include header comments:

```python
"""
Task: T-XXX
Spec: X.X Module Name

Description of what this module does.
"""

from fastapi import APIRouter, Depends
# ... rest of imports
```

## SQLModel Database Models

Define models with proper relationships:

```python
# app/models/task.py
"""
Task: T-XXX
Spec: X.X Task Data Model
"""

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

## API Endpoint Pattern

Standard CRUD endpoint structure:

```python
# app/api/tasks.py
"""
Task: T-XXX
Spec: X.X Task API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_session
from app.auth.dependencies import get_current_user_id
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """Get all tasks for the authenticated user."""
    statement = select(Task).where(Task.user_id == user_id)
    results = await session.execute(statement)
    tasks = results.scalars().all()
    return tasks


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """Create a new task for the authenticated user."""
    task = Task(**task_data.model_dump(), user_id=user_id)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """Get a specific task by ID (must belong to authenticated user)."""
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id  # CRITICAL: Always filter by user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """Update a task (must belong to authenticated user)."""
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """Delete a task (must belong to authenticated user)."""
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await session.delete(task)
    await session.commit()
    return None


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """Mark a task as completed (must belong to authenticated user)."""
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.completed = True
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task
```

## JWT Token Handling

Implement JWT creation and validation:

```python
# app/auth/jwt.py
"""
Task: T-XXX
Spec: X.X JWT Token Management
"""

import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Dict, Optional

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is not set")


def create_access_token(data: Dict[str, str], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new JWT access token.

    Args:
        data: Payload to encode (must include 'sub' with user_id)
        expires_delta: Optional expiration time override

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_jwt(token: str) -> Dict[str, str]:
    """
    Decode and validate a JWT token.

    Args:
        token: JWT token string

    Returns:
        Decoded payload

    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise e
```

## Environment Variables

Required variables in `.env`:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@neon.tech/dbname

# JWT
JWT_SECRET_KEY=your-secret-key-here-use-strong-random-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

# Better Auth
BETTER_AUTH_SECRET=your-better-auth-secret

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Error Handling

Use proper HTTP status codes and error responses:

```python
from fastapi import HTTPException, status

# 400 Bad Request - Client error
raise HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Invalid input data"
)

# 401 Unauthorized - Authentication required
raise HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired token"
)

# 403 Forbidden - Authenticated but not authorized
raise HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You do not have permission to access this resource"
)

# 404 Not Found - Resource doesn't exist
raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Task not found"
)

# 422 Unprocessable Entity - Validation error (automatic via Pydantic)

# 500 Internal Server Error - Server error (let FastAPI handle)
```

## CORS Configuration

Configure CORS for frontend access:

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Todo API", version="1.0.0")

# CORS middleware
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Migrations

Use Alembic for schema changes:

```bash
# Initialize Alembic (if not done)
alembic init migrations

# Create a new migration
alembic revision --autogenerate -m "Add tasks table"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

## Testing

Write integration tests for endpoints:

```python
# tests/test_tasks.py
"""
Task: T-XXX
Spec: X.X Task API Tests
"""

import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_task():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Authenticate first
        auth_response = await client.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "testpass"
        })
        token = auth_response.json()["access_token"]

        # Create task
        response = await client.post(
            "/api/v1/tasks",
            json={"title": "Test Task", "description": "Test"},
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 201
        assert response.json()["title"] == "Test Task"
```

## Forbidden Practices

❌ **DO NOT**:
- Create routes outside `/api/v1/` prefix
- Skip JWT verification on protected endpoints
- Query database without filtering by `user_id` for user-owned resources
- Store secrets in code (use environment variables)
- Use synchronous database operations (use async)
- Skip input validation (use Pydantic)
- Create endpoints without reading specs
- Implement features not in `@specs/api/` or `@specs/database/`
- Skip Task ID attribution in file headers

## Development Workflow

1. **Read Specs**: Check `@specs/api/rest-endpoints.md` and `@specs/database/schema.md`
2. **Define Models**: Create SQLModel classes in `app/models/`
3. **Define Schemas**: Create Pydantic schemas in `app/schemas/`
4. **Implement Endpoints**: Add routes in `app/api/` with JWT validation
5. **Enforce Isolation**: Always filter by `user_id` for user data
6. **Test**: Write integration tests in `tests/`
7. **Attribute**: Add Task ID comments to files

## Questions?

- **Spec unclear?** Ask user to run `/sp.clarify` on API specs
- **Database schema unclear?** Check `@specs/database/schema.md`
- **Auth flow unclear?** Check `@specs/features/authentication.md`

---

**Remember**: Always read specs before coding. Never skip JWT validation or user_id filtering.
