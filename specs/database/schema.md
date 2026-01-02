# Database Schema Specification

## Database

**Type**: PostgreSQL (via Neon Serverless)
**Version**: PostgreSQL 15+
**ORM**: SQLModel (SQLAlchemy + Pydantic)

## Tables

### users

User accounts table.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**Columns**:
- `id` (UUID): Primary key, auto-generated
- `email` (VARCHAR 255): Unique email address, indexed
- `hashed_password` (VARCHAR 255): Bcrypt-hashed password (never plaintext)
- `created_at` (TIMESTAMP): Account creation timestamp
- `updated_at` (TIMESTAMP): Last modification timestamp

**Constraints**:
- `email` must be unique
- `email` and `hashed_password` are required (NOT NULL)

**Indexes**:
- Primary key index on `id` (automatic)
- Index on `email` for fast login lookups

---

### tasks

User tasks table.

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_id_created_at ON tasks(user_id, created_at DESC);
```

**Columns**:
- `id` (UUID): Primary key, auto-generated
- `user_id` (UUID): Foreign key to `users.id`, indexed
- `title` (VARCHAR 200): Task title, required
- `description` (TEXT): Optional task description
- `completed` (BOOLEAN): Completion status, default FALSE
- `created_at` (TIMESTAMP): Task creation timestamp
- `updated_at` (TIMESTAMP): Last modification timestamp

**Constraints**:
- `user_id` must reference valid user (foreign key)
- `title` is required (NOT NULL)
- `completed` defaults to FALSE
- ON DELETE CASCADE: Deleting user deletes their tasks

**Indexes**:
- Primary key index on `id` (automatic)
- Index on `user_id` for user-specific queries
- Composite index on `(user_id, created_at DESC)` for sorted task lists

## Relationships

```
users (1) ─────< (many) tasks
  id                     user_id
```

- One user can have many tasks
- Each task belongs to exactly one user
- Deleting a user cascades to delete all their tasks

## SQLModel Definitions

### User Model

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, List
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship (if using ORM relationships)
    tasks: List["Task"] = Relationship(back_populates="user")
```

### Task Model

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
    user_id: str = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship (if using ORM relationships)
    user: Optional[User] = Relationship(back_populates="tasks")
```

## Migration Strategy

### Alembic Setup

```bash
# Initialize Alembic (first time)
alembic init migrations

# Create initial migration
alembic revision --autogenerate -m "Create users and tasks tables"

# Apply migrations
alembic upgrade head
```

### Migration Files

Migrations stored in `backend/migrations/versions/`

Example migration:
```python
"""Create users and tasks tables

Revision ID: 001
Revises:
Create Date: 2025-01-01
"""

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('idx_users_email', 'users', ['email'])

    op.create_table(
        'tasks',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.TEXT(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )
    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('idx_tasks_user_id_created_at', 'tasks', ['user_id', 'created_at'])


def downgrade():
    op.drop_table('tasks')
    op.drop_table('users')
```

## Data Isolation Queries

### CORRECT: User-filtered queries

```python
# Get user's tasks
SELECT * FROM tasks WHERE user_id = '<authenticated_user_id>';

# Get specific task (owned by user)
SELECT * FROM tasks
WHERE id = '<task_id>' AND user_id = '<authenticated_user_id>';

# Update task (owned by user)
UPDATE tasks
SET title = 'New title', updated_at = NOW()
WHERE id = '<task_id>' AND user_id = '<authenticated_user_id>';

# Delete task (owned by user)
DELETE FROM tasks
WHERE id = '<task_id>' AND user_id = '<authenticated_user_id>';
```

### WRONG: Unfiltered queries (SECURITY VIOLATION)

```python
# ❌ Returns ALL users' tasks
SELECT * FROM tasks;

# ❌ Can access any user's task
SELECT * FROM tasks WHERE id = '<task_id>';

# ❌ Can modify any user's task
UPDATE tasks SET title = 'Hacked' WHERE id = '<task_id>';
```

## Performance Considerations

### Indexes
- `user_id` index enables fast user-specific queries
- Composite index `(user_id, created_at DESC)` optimizes sorted lists
- Email index enables fast login lookups

### Query Optimization
- Always filter by `user_id` first (uses index)
- Avoid SELECT * in production (specify columns)
- Use pagination for large task lists (out of Phase-2 scope)

## Data Constraints

### users table
- Email must be valid format (validated in application layer)
- Passwords must be 8+ characters (validated in application layer)
- Email is case-insensitive for comparison

### tasks table
- Title length: 1-200 characters
- Description length: max 1000 characters
- Completed: boolean only (TRUE/FALSE)

## Out of Scope (Phase-2)

❌ Soft deletes (deleted_at column)
❌ Task categories or tags table
❌ Task sharing/collaboration tables
❌ Audit log table
❌ File attachments table
❌ Task comments table
❌ Full-text search indexes

---

**Related Specs**:
- API Endpoints: `@specs/api/rest-endpoints.md`
- Task CRUD Feature: `@specs/features/task-crud.md`
- Authentication Feature: `@specs/features/authentication.md`
- Architecture: `@specs/architecture.md`
