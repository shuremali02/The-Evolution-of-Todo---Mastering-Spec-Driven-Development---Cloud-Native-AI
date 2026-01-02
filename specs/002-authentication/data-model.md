# Data Model: Authentication

**Feature**: 002-authentication
**Date**: 2025-12-31
**Based on**: research.md decisions

## Entity: User

### Purpose
Represents a registered user account in the system. Primary authentication entity.

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID (string) | Primary Key, Auto-generated | Unique user identifier |
| `email` | String | Unique, Indexed, Max 255 chars, NOT NULL | User email address (login credential) |
| `hashed_password` | String | Max 255 chars, NOT NULL | BCrypt hashed password (never plaintext) |
| `created_at` | Timestamp | NOT NULL, Default NOW() | Account creation timestamp |
| `updated_at` | Timestamp | NOT NULL, Default NOW() | Last modification timestamp |

### Constraints

**Primary Key**: `id`

**Unique Constraints**:
- `email` (case-insensitive uniqueness enforced in application layer)

**Indexes**:
- Primary index on `id` (automatic)
- Index on `email` for fast login lookups

**Validation Rules**:
- Email must match valid email format (enforced by Pydantic `EmailStr`)
- Password minimum 8 characters (enforced in request validation, not database)
- `hashed_password` must be BCrypt hash (enforced in application layer)

### Relationships

**Outgoing**:
- User (1) → Tasks (many) - Via `tasks.user_id` foreign key
  - Relationship name: `tasks`
  - Cascade on delete: DELETE (deleting user deletes all their tasks)

**Incoming**: None

### State Machine

User accounts have implicit states based on activity:

```
┌─────────┐
│ Created │  (User registers)
└────┬────┘
     │
     ▼
┌──────────┐
│  Active  │  (User can login, use app)
└──────────┘
```

**Phase-2 Note**: No explicit state field needed. Future phases may add:
- `email_verified` (boolean) - Email verification status
- `is_active` (boolean) - Account suspension
- `last_login` (timestamp) - Last login timestamp

### SQLModel Definition (Backend)

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid

class User(SQLModel, table=True):
    """User account for authentication.

    Task: T-XXX (from tasks.md when generated)
    Spec: 002-authentication/spec.md - FR-1, FR-2
    """
    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="UUID primary key"
    )
    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        nullable=False,
        description="User email address (login credential)"
    )
    hashed_password: str = Field(
        max_length=255,
        nullable=False,
        description="BCrypt hashed password (never plaintext)"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Account creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Last modification timestamp"
    )

    # Relationships (optional, can be added later)
    # tasks: List["Task"] = Relationship(back_populates="user")
```

### Pydantic Schemas (API Request/Response)

```python
from pydantic import BaseModel, EmailStr, Field as PydanticField
from datetime import datetime

# Request schemas (input validation)
class UserCreate(BaseModel):
    """Schema for user registration.

    Task: T-XXX
    Spec: 002-authentication/spec.md - FR-1
    """
    email: EmailStr = PydanticField(
        ...,
        description="Valid email address",
        example="user@example.com"
    )
    password: str = PydanticField(
        ...,
        min_length=8,
        max_length=128,
        description="Password (8-128 characters)",
        example="securepassword123"
    )


class UserLogin(BaseModel):
    """Schema for user login.

    Task: T-XXX
    Spec: 002-authentication/spec.md - FR-2
    """
    email: EmailStr = PydanticField(
        ...,
        description="User email address",
        example="user@example.com"
    )
    password: str = PydanticField(
        ...,
        description="User password",
        example="securepassword123"
    )


# Response schemas (output serialization)
class UserResponse(BaseModel):
    """Public user information (safe for API responses).

    Task: T-XXX
    Spec: 002-authentication/spec.md - FR-1, FR-2
    """
    id: str = PydanticField(
        ...,
        description="User UUID",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    email: str = PydanticField(
        ...,
        description="User email address",
        example="user@example.com"
    )
    created_at: datetime = PydanticField(
        ...,
        description="Account creation timestamp",
        example="2025-01-01T00:00:00Z"
    )

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)


class AuthResponse(BaseModel):
    """Authentication response with JWT token.

    Task: T-XXX
    Spec: 002-authentication/spec.md - FR-1, FR-2
    """
    access_token: str = PydanticField(
        ...,
        description="JWT access token",
        example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    )
    token_type: str = PydanticField(
        default="bearer",
        description="Token type (always 'bearer')"
    )
    user: UserResponse = PydanticField(
        ...,
        description="Authenticated user information"
    )
```

### TypeScript Types (Frontend)

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md
 */

// User entity (matches backend UserResponse)
export interface User {
  id: string
  email: string
  created_at: string  // ISO 8601 timestamp
}

// Registration request
export interface SignupRequest {
  email: string
  password: string
}

// Login request
export interface LoginRequest {
  email: string
  password: string
}

// Authentication response (from both signup and login)
export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

// JWT token payload (decoded)
export interface JWTPayload {
  sub: string  // User ID
  exp: number  // Expiration timestamp (Unix epoch)
  iat: number  // Issued at timestamp (Unix epoch)
}
```

## Database Migration

### Initial Migration (Alembic)

```python
"""Create users table

Revision ID: 001_create_users
Revises:
Create Date: 2025-12-31

Task: T-XXX
Spec: 002-authentication/data-model.md
"""

from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('ix_users_email', 'users', ['email'])

def downgrade():
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
```

## Data Access Patterns

### Create User (Registration)

```python
async def create_user(session: AsyncSession, email: str, password: str) -> User:
    """Create new user with hashed password."""
    # Check if email exists (case-insensitive)
    existing = await session.execute(
        select(User).where(func.lower(User.email) == email.lower())
    )
    if existing.scalar_one_or_none():
        raise ValueError("Email already registered")

    # Hash password
    hashed_password = pwd_context.hash(password)

    # Create user
    user = User(
        email=email.lower(),  # Store lowercase
        hashed_password=hashed_password
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
```

### Authenticate User (Login)

```python
async def authenticate_user(
    session: AsyncSession,
    email: str,
    password: str
) -> Optional[User]:
    """Verify credentials and return user if valid."""
    # Find user by email (case-insensitive)
    result = await session.execute(
        select(User).where(func.lower(User.email) == email.lower())
    )
    user = result.scalar_one_or_none()

    if not user:
        return None

    # Verify password
    if not pwd_context.verify(password, user.hashed_password):
        return None

    return user
```

### Get User by ID (from JWT)

```python
async def get_user_by_id(session: AsyncSession, user_id: str) -> Optional[User]:
    """Retrieve user by ID (from JWT token)."""
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()
```

## Security Considerations

### Password Handling

**NEVER**:
- Store passwords in plaintext
- Log passwords (even hashed)
- Return passwords in API responses
- Include passwords in JWT payload
- Compare passwords directly (use `pwd_context.verify()`)

**ALWAYS**:
- Hash with BCrypt before storing
- Use timing-safe comparison
- Validate minimum length (8 chars)
- Rate-limit login attempts (future enhancement)

### Email Handling

- Store in lowercase for consistency
- Case-insensitive uniqueness check
- Validate format with Pydantic `EmailStr`
- No email verification in Phase-2 (add in Phase-3)

### JWT Token Claims

**Required claims**:
- `sub`: User ID (UUID string)
- `exp`: Expiration timestamp (60 minutes from issue)
- `iat`: Issued at timestamp

**Prohibited claims**:
- Password (hashed or plaintext)
- Sensitive user data
- Admin flags (for Phase-2)

## Test Data

### Valid Test Users

```python
# For automated tests
TEST_USERS = [
    {
        "email": "test@example.com",
        "password": "password123",
        "id": "test-uuid-1"
    },
    {
        "email": "admin@example.com",
        "password": "adminpass456",
        "id": "test-uuid-2"
    }
]
```

### Invalid Test Cases

```python
INVALID_EMAILS = [
    "notanemail",           # No @
    "@example.com",         # Missing local part
    "user@",                # Missing domain
    "user @example.com",    # Space in email
]

INVALID_PASSWORDS = [
    "short",                # < 8 characters
    "",                     # Empty
    "       ",              # Only spaces
]
```

## Future Enhancements (Out of Scope for Phase-2)

- Email verification (`email_verified` field)
- Password reset functionality
- Account suspension (`is_active` field)
- Last login tracking (`last_login` field)
- Failed login attempt tracking
- Multi-factor authentication (MFA)
- OAuth/Social login
- User profile fields (name, avatar, etc.)

---

**Next Step**: Generate API contracts in `/contracts/` directory.
