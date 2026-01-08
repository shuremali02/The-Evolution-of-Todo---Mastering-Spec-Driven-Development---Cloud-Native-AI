# Data Model: Authentication

**Feature**: 002-authentication
**Date**: 2026-01-06
**Based on**: research.md decisions, spec.md clarifications

## Entity: User

### Purpose
Represents a registered user account in the system. Primary authentication entity. Supports login with either username or email, and displays username in profile.

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID (string) | Primary Key, Auto-generated | Unique user identifier |
| `username` | String | Unique, Indexed, Max 20 chars, NOT NULL | User's display name (login credential) |
| `email` | String | Unique, Indexed, Max 255 chars, NOT NULL | User email address (login credential) |
| `password_hash` | String | Max 255 chars, NOT NULL | Bcrypt hashed password (never plaintext) |
| `created_at` | Timestamp | NOT NULL, Default NOW() | Account creation timestamp |
| `updated_at` | Timestamp | NOT NULL, Default NOW() | Last modification timestamp |

### Constraints

**Primary Key**: `id`

**Unique Constraints**:
- `username` (case-insensitive uniqueness enforced in application layer)
- `email` (case-insensitive uniqueness enforced in application layer)

**Indexes**:
- Primary index on `id` (automatic)
- Index on `username` for fast login lookups
- Index on `email` for fast login lookups

**Validation Rules**:
- **Username**: 3-20 characters, alphanumeric/_/- only, first char letter/number, stored lowercase
- **Email**: Valid email format (enforced by Pydantic `EmailStr`), stored lowercase
- **Password**: Minimum 8 characters (enforced in request validation, not database)
- `password_hash` must be Bcrypt hash (enforced in application layer)

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
┌───────────┐
│  Active  │  (User can login, use app)
└───────────┘
```

**Phase-2 Note**: No explicit state field needed. Future phases may add:
- `email_verified` (boolean) - Email verification status
- `is_active` (boolean) - Account suspension
- `last_login` (timestamp) - Last login timestamp

## SQLModel Definition (Backend)

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid

class User(SQLModel, table=True):
    """User account for authentication with username support.

    Task: T-XXX
    Spec: 002-authentication/spec.md - FR-1, FR-2, US-1, US-2
    """
    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="UUID primary key"
    )
    username: str = Field(
        unique=True,
        index=True,
        max_length=20,
        nullable=False,
        description="Username (3-20 chars, alphanumeric/_/- only, stored lowercase)"
    )
    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        nullable=False,
        description="User email address (login credential)"
    )
    password_hash: str = Field(
        max_length=255,
        nullable=False,
        description="Bcrypt hashed password (never plaintext)"
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

## Pydantic Schemas (API Request/Response)

```python
from pydantic import BaseModel, EmailStr, Field as PydanticField, field_validator
from datetime import datetime
from typing import Optional
import re

# Request schemas (input validation)
class UserCreate(BaseModel):
    """Schema for user registration with username support.

    Task: T-XXX
    Spec: 002-authentication/spec.md - FR-1
    """
    username: str = PydanticField(
        ...,
        min_length=3,
        max_length=20,
        description="Username (3-20 chars, alphanumeric/_/- only)",
        example="john_doe"
    )
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
    confirm_password: str = PydanticField(
        ...,
        description="Password confirmation (must match password)",
        example="securepassword123"
    )

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        """Validate username format and normalize to lowercase."""
        if not re.match(r'^[a-zA-Z0-9][a-zA-Z0-9_-]*$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        if not re.match(r'^[a-zA-Z0-9]', v[0]):
            raise ValueError('Username must start with a letter or number')
        return v.lower()  # Normalize to lowercase

    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v: str, info: field_validator.FieldValidationInfo) -> str:
        """Validate password confirmation matches password."""
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('Passwords do not match')
        return v

class UserLogin(BaseModel):
    """Schema for user login (supports both email and username).

    Task: T-XXX
    Spec: 002-authentication/spec.md - FR-2
    """
    email_or_username: str = PydanticField(
        ...,
        description="Email address or username",
        example="john_doe"  # Can be email or username
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
    Spec: 002-authentication/spec.md - FR-1, FR-2, US-4
    """
    id: str = PydanticField(
        ...,
        description="User UUID",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    username: str = PydanticField(
        ...,
        description="Username (for profile display)",
        example="john_doe"
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

## TypeScript Types (Frontend)

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md
 */

// User entity (matches backend UserResponse)
export interface User {
  id: string
  username: string
  email: string
  created_at: string  // ISO 8601 timestamp
}

// Registration request
export interface SignupRequest {
  username: string
  email: string
  password: string
  confirm_password: string
}

// Login request (supports email or username)
export interface LoginRequest {
  email_or_username: string  // Can be email or username
  password: string
}

// Authentication response (from both signup and login)
export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

// JWT token payload (decoded)
export interface JwtPayload {
  sub: string       // User ID (UUID)
  username: string  // Username for profile display
  exp: number      // Expiration timestamp (Unix epoch)
  iat: number      // Issued at timestamp (Unix epoch)
}

// Current user context (from JWT)
export interface CurrentUser {
  id: string
  username: string
}
```

## Database Migration

### Initial Migration (Alembic)

```python
"""Create users table with username support

Revision ID: 001_create_users_with_username
Revises:
Create Date: 2026-01-06

Task: T-XXX
Spec: 002-authentication/data-model.md
"""

from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('username', sa.String(length=20), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username'),
        sa.UniqueConstraint('email')
    )
    op.create_index('ix_users_username', 'users', ['username'])
    op.create_index('ix_users_email', 'users', ['email'])

def downgrade():
    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_username', table_name='users')
    op.drop_table('users')
```

## Data Access Patterns

### Create User (Registration)

```python
async def create_user(
    session: AsyncSession,
    username: str,
    email: str,
    password: str
) -> User:
    """Create new user with hashed password and lowercase username/email."""
    # Check if username exists (case-insensitive)
    existing_by_username = await session.execute(
        select(User).where(func.lower(User.username) == username.lower())
    )
    if existing_by_username.scalar_one_or_none():
        raise ValueError("Username already taken")

    # Check if email exists (case-insensitive)
    existing_by_email = await session.execute(
        select(User).where(func.lower(User.email) == email.lower())
    )
    if existing_by_email.scalar_one_or_none():
        raise ValueError("Email already registered")

    # Hash password
    hashed_password = pwd_context.hash(password)

    # Create user with normalized values
    user = User(
        username=username.lower(),  # Store lowercase
        email=email.lower(),        # Store lowercase
        password_hash=hashed_password
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
```

### Authenticate User (Login with Username or Email)

```python
async def authenticate_user(
    session: AsyncSession,
    email_or_username: str,
    password: str
) -> Optional[User]:
    """Verify credentials and return user if valid.

    Supports login with either username or email.
    """
    # Normalize to lowercase for search
    search_term = email_or_username.lower()

    # Find user by username or email (case-insensitive)
    result = await session.execute(
        select(User).where(
            (func.lower(User.username) == search_term) |
            (func.lower(User.email) == search_term)
        )
    )
    user = result.scalar_one_or_none()

    if not user:
        return None

    # Verify password
    if not pwd_context.verify(password, user.password_hash):
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
- Hash with Bcrypt before storing
- Use timing-safe comparison
- Validate minimum length (8 chars)
- Rate-limit login attempts (future enhancement)

### Username Handling

- Store in lowercase for consistency
- Case-insensitive uniqueness check
- Validate format (3-20 chars, alphanumeric/_/- only, first char letter/number)
- Include in JWT payload for frontend profile display
- Display in UI with avatar (first letter uppercase)

### Email Handling

- Store in lowercase for consistency
- Case-insensitive uniqueness check
- Validate format with Pydantic `EmailStr`
- No email verification in Phase-2 (add in Phase-3)

### JWT Token Claims

**Required claims**:
- `sub`: User ID (UUID string)
- `username`: Username for frontend profile display
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
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123",
        "confirm_password": "password123",
        "id": "test-uuid-1"
    },
    {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "secretpass456",
        "confirm_password": "secretpass456",
        "id": "test-uuid-2"
    }
]
```

### Invalid Test Cases

```python
INVALID_USERNAMES = [
    "ab",               # < 3 characters
    "a"*21,            # > 20 characters
    "user@name",         # Contains @ (invalid char)
    "_username",         # Starts with _ (must start with letter/number)
    "-username",         # Starts with - (must start with letter/number)
    "user name",         # Contains space (invalid char)
]

INVALID_EMAILS = [
    "notanemail",        # No @
    "@example.com",       # Missing local part
    "user@",             # Missing domain
    "user @example.com",  # Space in email
]

INVALID_PASSWORDS = [
    "short",             # < 8 characters
    "",                  # Empty
    "       ",            # Only spaces
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
- User profile fields (name, avatar image, etc.)

---

**Next Step**: Generate API contracts in `/contracts/` directory.
