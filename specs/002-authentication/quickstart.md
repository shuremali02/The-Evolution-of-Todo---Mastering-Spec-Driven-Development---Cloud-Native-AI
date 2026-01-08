# Quickstart: Authentication Implementation

**Feature**: 002-authentication
**Estimated Time**: 8-10 hours (backend + frontend)
**Prerequisites**: Phase-2 monorepo setup complete

## Implementation Order

```
1. Backend Setup (3-4 hours)
   ├── Database model (User with username)
   ├── Password hashing utilities
   ├── JWT utilities (with username claim)
   ├── Pydantic schemas (with username validation)
   └── Auth endpoints (/signup, /login, /logout)

2. Frontend Setup (4-5 hours)
   ├── Auth forms (Login, Signup with username field)
   ├── Token storage (sessionStorage)
   ├── JWT decoding utilities (for profile display)
   ├── API client with token attachment
   ├── Avatar component (circular text badge)
   ├── UserProfile component (username + avatar)
   └── AuthGuard component (protected routes)

3. Integration Testing (1-2 hours)
   └── End-to-end auth flow with profile display
```

## Step 1: Backend Implementation

### 1.1 Install Dependencies

```bash
cd backend

# Add to requirements.txt
echo "python-jose[cryptography]>=3.3.0" >> requirements.txt
echo "passlib[bcrypt]>=1.7.4" >> requirements.txt
echo "python-multipart" >> requirements.txt

# Install
pip install -r requirements.txt
```

### 1.2 Environment Variables

Create `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@db.neon.tech/dbname

# JWT Configuration
JWT_SECRET_KEY=<generate-with-command-below>
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://shurem-todo-app.hf.space
```

**Generate secure JWT secret**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 1.3 Create User Model with Username

**File**: `backend/app/models/user.py`

```python
"""
Task: T-XXX (will be assigned in tasks.md)
Spec: 002-authentication/data-model.md - User Entity with username
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class User(SQLModel, table=True):
    """User account for authentication with username support.

    Task: T-XXX
    Spec: 002-authentication/data-model.md - User Entity
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

### 1.4 Create Pydantic Schemas with Username Validation

**File**: `backend/app/schemas/auth.py`

```python
"""
Task: T-XXX
Spec: 002-authentication/data-model.md - Pydantic Schemas
"""

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
        example="550e8400-e29b-41d4-a716-4466554400000"
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

### 1.5 Create Auth Utilities

**File**: `backend/app/auth/password.py`

```python
"""
Task: T-XXX
Spec: 002-authentication/research.md - Password Hashing
"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password with bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)
```

**File**: `backend/app/auth/jwt.py`

```python
"""
Task: T-XXX
Spec: 002-authentication/research.md - JWT with Username Support
"""

import os
from datetime import datetime, timedelta
from jose import JWTError, jwt

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is not set")

def create_access_token(user_id: str, username: str) -> str:
    """Generate JWT access token with username claim."""
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode = {
        "sub": user_id,
        "username": username,  # Include for frontend profile display
        "exp": expire,
        "iat": datetime.utcnow()
    }
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_jwt(token: str) -> dict:
    """Decode and validate JWT token."""
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except JWTError as e:
        raise e
```

**File**: `backend/app/auth/dependencies.py`

```python
"""
Task: T-XXX
Spec: 002-authentication/contracts/jwt-spec.md - Token Validation
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .jwt import decode_jwt

security = HTTPBearer()

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Extract and validate user ID from JWT."""
    token = credentials.credentials
    try:
        payload = decode_jwt(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject"
            )
        return user_id
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
```

### 1.6 Create Auth Endpoints

**File**: `backend/app/api/auth.py`

```python
"""
Task: T-XXX
Spec: 002-authentication/spec.md - FR-1, FR-2, FR-6
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func

from app.database import get_session
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, AuthResponse, UserResponse
from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    """Register new user with username, email, and password."""
    # Check if username exists (case-insensitive)
    existing_by_username = await session.execute(
        select(User).where(func.lower(User.username) == user_data.username.lower())
    )
    if existing_by_username.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken"
        )

    # Check if email exists (case-insensitive)
    existing_by_email = await session.execute(
        select(User).where(func.lower(User.email) == user_data.email.lower())
    )
    if existing_by_email.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(user_data.password)

    # Create user with normalized values
    user = User(
        username=user_data.username.lower(),  # Store lowercase
        email=user_data.email.lower(),        # Store lowercase
        password_hash=hashed_password
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    # Generate token with username
    access_token = create_access_token(user.id, user.username)

    return AuthResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )

@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: UserLogin,
    session: AsyncSession = Depends(get_session)
):
    """Authenticate user with email or username and password."""
    # Normalize to lowercase for search
    search_term = credentials.email_or_username.lower()

    # Find user by username or email (case-insensitive)
    result = await session.execute(
        select(User).where(
            (func.lower(User.username) == search_term) |
            (func.lower(User.email) == search_term)
        )
    )
    user = result.scalar_one_or_none()

    # Verify credentials
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password"
        )

    # Generate token with username
    access_token = create_access_token(user.id, user.username)

    return AuthResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )

@router.post("/logout")
async def logout():
    """Logout endpoint (frontend clears token)."""
    return {"message": "Logged out successfully"}
```

### 1.7 Register Router in Main App

**File**: `backend/app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.auth import router as auth_router

app = FastAPI(title="Todo API", version="1.0.0")

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
```

### 1.8 Create Database Migration

```bash
cd backend

# Initialize Alembic (if not done)
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Create users table with username"

# Apply migration
alembic upgrade head
```

---

## Step 2: Frontend Implementation

### 2.1 Install Dependencies

```bash
cd frontend

# If Next.js not initialized yet
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Add dependencies
npm install jose

# Install dev dependencies
npm install --save-dev @types/jose
```

### 2.2 Create API Client with JWT Support

**File**: `frontend/lib/api.ts`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/contracts/jwt-spec.md - Frontend Integration
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL
  }

  /**
   * Get stored JWT token from sessionStorage.
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem('access_token')
  }

  /**
   * Store JWT token in sessionStorage.
   */
  private setToken(token: string): void {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('access_token', token)
  }

  /**
   * Clear stored JWT token.
   */
  public clearToken(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem('access_token')
  }

  /**
   * Decode JWT and extract payload.
   */
  public decodeToken(token: string): any {
    // Simple base64 decode (for production, use jose library)
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  }

  /**
   * Get current user from JWT token.
   */
  public getCurrentUser(): { id: string, username: string } | null {
    const token = this.getToken()
    if (!token) return null

    try {
      const payload = this.decodeToken(token)
      return {
        id: payload.sub,
        username: payload.username
      }
    } catch (e) {
      return null
    }
  }

  /**
   * Make HTTP request to API with automatic JWT attachment.
   */
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      this.clearToken()
      // Preserve unsaved form data before redirect
      const formData = this.getUnsavedFormData()
      if (formData) {
        sessionStorage.setItem('unsavedFormData', JSON.stringify(formData))
      }
      // Redirect to login with session expired message
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session=expired'
      }
      throw new Error('Unauthorized - redirecting to login')
    }

    // Handle other errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get unsaved form data (for session expiration handling).
   */
  private getUnsavedFormData(): any {
    // Implement to preserve form data across redirects
    return null
  }

  /**
   * Register a new user with username, email, and password.
   */
  async signup(username: string, email: string, password: string, confirm_password: string) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, confirm_password }),
    })
    // Store token after successful signup
    this.setToken(data.access_token)
    return data
  }

  /**
   * Login existing user (supports both email and username).
   */
  async login(email_or_username: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email_or_username, password }),
    })
    // Store token after successful login
    this.setToken(data.access_token)
    return data
  }

  /**
   * Logout current user.
   */
  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
    })
    this.clearToken()
  }

  /**
   * Check if user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
```

### 2.3 Create Avatar Component

**File**: `frontend/components/ui/Avatar.tsx`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md - US-4 User Profile Display
 */

interface AvatarProps {
  username: string
}

export function Avatar({ username }: AvatarProps) {
  // Get first letter and uppercase
  const avatarLetter = username[0]?.toUpperCase() || '?'

  return (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
      {avatarLetter}
    </div>
  )
}
```

### 2.4 Create UserProfile Component

**File**: `frontend/components/auth/UserProfile.tsx`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md - US-4 User Profile Display
 */

import { Avatar } from '../ui/Avatar'
import { apiClient } from '@/lib/api'
import { useState, useEffect } from 'react'

export function UserProfile() {
  const [user, setUser] = useState<{ id: string, username: string } | null>(null)

  useEffect(() => {
    // Get user from JWT token
    const currentUser = apiClient.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  if (!user) return null

  return (
    <div className="flex items-center gap-2 group">
      <Avatar username={user.username} />
      <span className="font-medium text-gray-700">{user.username}</span>
    </div>
  )
}
```

### 2.5 Create AuthGuard Component

**File**: `frontend/components/auth/AuthGuard.tsx`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md - US-3 Protected Route Access
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = apiClient.getToken()
    if (!token) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null

  return <>{children}</>
}
```

### 2.6 Create Signup Page with Username

**File**: `frontend/app/signup/page.tsx`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md - US-1 User Registration
 */

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Restore unsaved form data if session expired
  useEffect(() => {
    const unsavedData = searchParams.get('session') === 'expired'
      ? sessionStorage.getItem('unsavedFormData')
      : null
    if (unsavedData) {
      try {
        const formData = JSON.parse(unsavedData)
        if (formData.username) setUsername(formData.username)
        if (formData.email) setEmail(formData.email)
        sessionStorage.removeItem('unsavedFormData')
      } catch (e) {
        console.error('Failed to restore form data:', e)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Frontend validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await apiClient.signup(username, email, password, confirmPassword)
      router.push('/tasks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_-]*"
              title="3-20 characters, letters, numbers, underscores, hyphens only"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john_doe"
            />
            <p className="mt-1 text-xs text-gray-500">
              3-20 characters, letters, numbers, underscores, hyphens only
            </p>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="•••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">
              At least 8 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="•••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}
```

### 2.7 Create Login Page (Supports Email or Username)

**File**: `frontend/app/login/page.tsx`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md - US-2 User Login
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api'

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionMessage, setSessionMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for session expired message
  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      setSessionMessage('Your session has expired. Please log in again.')
    }

    // Restore unsaved form data
    const unsavedData = searchParams.get('session') === 'expired'
      ? sessionStorage.getItem('unsavedFormData')
      : null
    if (unsavedData) {
      try {
        const formData = JSON.parse(unsavedData)
        if (formData.username || formData.email) setEmailOrUsername(formData.username || formData.email)
        sessionStorage.removeItem('unsavedFormData')
      } catch (e) {
        console.error('Failed to restore form data:', e)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    setLoading(true)

    try {
      await apiClient.login(emailOrUsername, password)
      router.push('/tasks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>

        {sessionMessage && (
          <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-md">
            {sessionMessage}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john_doe or user@example.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter your username or email address
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="•••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Link to Signup */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
```

### 2.8 Update Layout with UserProfile and Logout

**File**: `frontend/app/layout.tsx`

```typescript
import Link from 'next/link'
import { UserProfile } from '@/components/auth/UserProfile'
import { apiClient } from '@/lib/api'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const handleLogout = async () => {
    await apiClient.logout()
  }

  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <Link href="/" className="text-xl font-bold text-blue-600">
                Todo App
              </Link>

              {/* Profile + Logout (only show if authenticated) */}
              <div className="flex items-center gap-4">
                {apiClient.isAuthenticated() && (
                  <>
                    <UserProfile />
                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Logout
                    </button>
                  </>
                )}
                {!apiClient.isAuthenticated() && (
                  <div className="flex gap-4">
                    <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                      Log in
                    </Link>
                    <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
```

---

## Step 3: Testing

### 3.1 Backend Tests

**File**: `backend/tests/test_auth.py`

```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_signup_success():
    """Test successful user registration with username."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/signup", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "confirm_password": "password123"
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["user"]["username"] == "testuser"
        assert data["user"]["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_signup_duplicate_username():
    """Test duplicate username (case-insensitive)."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Create first user
        await client.post("/api/v1/auth/signup", json={
            "username": "testuser",
            "email": "test1@example.com",
            "password": "password123",
            "confirm_password": "password123"
        })

        # Try to create duplicate username (different case)
        response = await client.post("/api/v1/auth/signup", json={
            "username": "TestUser",  # Different case, should fail
            "email": "test2@example.com",
            "password": "password123",
            "confirm_password": "password123"
        })
        assert response.status_code == 409
        assert "already" in response.json()["detail"]

@pytest.mark.asyncio
async def test_signup_passwords_do_not_match():
    """Test password confirmation mismatch."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/signup", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "confirm_password": "different"
        })
        assert response.status_code == 400
        assert "do not match" in response.json()["detail"]

@pytest.mark.asyncio
async def test_login_with_username():
    """Test login with username."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Create user first
        await client.post("/api/v1/auth/signup", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "confirm_password": "password123"
        })

        # Login with username
        response = await client.post("/api/v1/auth/login", json={
            "email_or_username": "testuser",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["username"] == "testuser"

@pytest.mark.asyncio
async def test_login_with_email():
    """Test login with email."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Create user first
        await client.post("/api/v1/auth/signup", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "confirm_password": "password123"
        })

        # Login with email
        response = await client.post("/api/v1/auth/login", json={
            "email_or_username": "test@example.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "test@example.com"
```

### 3.2 Run Tests

```bash
# Backend
cd backend
pytest

# Frontend (if tests exist)
cd frontend
npm test
```

---

## Step 4: Verification

### 4.1 Start Servers

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 4.2 Manual Testing

1. **Open** http://localhost:3000/signup
2. **Register** a new account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. **Verify**:
   - Redirect to `/tasks` (will show 404 until tasks feature implemented)
   - Or stay on signup if tasks page doesn't exist
   - JWT token stored in sessionStorage
4. **Logout** (click Logout button in navigation)
5. **Login** with:
   - Username: `testuser`
   - Password: `password123`
6. **Verify**:
   - Redirect to `/tasks`
   - Profile displays username "testuser"
   - Avatar shows "T" in blue circle
7. **Try login with email**: `test@example.com` (should also work)
8. **Test session expiration**:
   - Wait 60 minutes or manually delete token from sessionStorage
   - Try to access protected page
   - Should redirect to `/login?session=expired`
   - Form data preserved (if implemented)

### 4.3 Success Checklist

- [ ] User can register with username, email, password
- [ ] Password confirmation validates on frontend and backend
- [ ] Duplicate usernames (case-insensitive) and emails are rejected
- [ ] User can login with either email or username
- [ ] JWT token issued on successful auth
- [ ] Frontend displays username and avatar on all authenticated pages
- [ ] Frontend automatically redirects to login on 401
- [ ] Session expiration message shows
- [ ] Logout clears token and redirects to login
- [ ] API docs visible at http://localhost:8000/docs

---

## Common Issues & Solutions

### Issue: "Username already taken" but database is empty
**Solution**: Check case-insensitive uniqueness. Clear test data.

### Issue: JWT_SECRET_KEY not set
**Solution**: Add to `backend/.env` and restart server

### Issue: CORS error in frontend
**Solution**: Verify `ALLOWED_ORIGINS` includes `http://localhost:3000`

### Issue: Database connection failed
**Solution**: Check `DATABASE_URL` in `.env` is correct Neon connection string

### Issue: Passwords do not match error always shows
**Solution**: Ensure both password fields have same value before submission

### Issue: Profile/avatar not showing
**Solution**: Check that username claim is included in JWT token

---

## Next Steps

After authentication is working:
1. Implement task CRUD feature (003-task-crud)
2. Use `AuthGuard` to protect task routes
3. Use `get_current_user_id()` dependency in task endpoints
4. Display user tasks filtered by `user_id`

---

**Estimated Total Time**: 8-10 hours for complete implementation and testing
