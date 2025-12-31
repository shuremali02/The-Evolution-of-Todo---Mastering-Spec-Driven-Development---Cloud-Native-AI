# Quickstart: Authentication Implementation

**Feature**: 002-authentication
**Estimated Time**: 6-8 hours (backend + frontend)
**Prerequisites**: Phase-2 monorepo setup complete

## Implementation Order

```
1. Backend Setup (2-3 hours)
   ├── Database model (User)
   ├── Password hashing utilities
   ├── JWT utilities
   └── Auth endpoints (/signup, /login)

2. Frontend Setup (2-3 hours)
   ├── Auth forms (Login, Signup)
   ├── Token storage
   ├── API client with token
   └── AuthGuard component

3. Integration Testing (1-2 hours)
   └── End-to-end auth flow
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
ALLOWED_ORIGINS=http://localhost:3000
```

**Generate secure JWT secret**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 1.3 Create User Model

**File**: `backend/app/models/user.py`

```python
"""
Task: T-XXX (will be assigned in tasks.md)
Spec: 002-authentication/data-model.md
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 1.4 Create Pydantic Schemas

**File**: `backend/app/schemas/auth.py`

```python
"""
Task: T-XXX
Spec: 002-authentication/data-model.md
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
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
Spec: 002-authentication/contracts/jwt-spec.md
"""

import os
from datetime import datetime, timedelta
from jose import JWTError, jwt

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is not set")

def create_access_token(user_id: str) -> str:
    """Generate JWT access token."""
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode = {
        "sub": user_id,
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
Spec: 002-authentication/spec.md - FR-1, FR-2
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
    """Register new user."""
    # Check if email exists (case-insensitive)
    result = await session.execute(
        select(User).where(func.lower(User.email) == user_data.email.lower())
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create user
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email.lower(),
        hashed_password=hashed_password
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    # Generate token
    access_token = create_access_token(user.id)

    return AuthResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )

@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: UserLogin,
    session: AsyncSession = Depends(get_session)
):
    """Authenticate user."""
    # Find user
    result = await session.execute(
        select(User).where(func.lower(User.email) == credentials.email.lower())
    )
    user = result.scalar_one_or_none()

    # Verify credentials
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate token
    access_token = create_access_token(user.id)

    return AuthResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )
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
alembic revision --autogenerate -m "Create users table"

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
npm install js-cookie
npm install --save-dev @types/js-cookie
```

### 2.2 Create API Client

**File**: `frontend/lib/api.ts`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/contracts/jwt-spec.md - Frontend Integration
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private getToken(): string | null {
    return sessionStorage.getItem('access_token')
  }

  private setToken(token: string) {
    sessionStorage.setItem('access_token', token)
  }

  public clearToken() {
    sessionStorage.removeItem('access_token')
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken()

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      this.clearToken()
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Request failed')
    }

    return response.json()
  }

  async signup(email: string, password: string) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(data.access_token)
    return data
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(data.access_token)
    return data
  }

  logout() {
    this.clearToken()
    window.location.href = '/login'
  }
}

export const apiClient = new ApiClient()
```

### 2.3 Create Auth Types

**File**: `frontend/types/auth.ts`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/data-model.md - TypeScript Types
 */

export interface User {
  id: string
  email: string
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}
```

### 2.4 Create Login Page

**File**: `frontend/app/login/page.tsx`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md - US-2
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiClient.login(email, password)
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
        <h2 className="text-3xl font-bold text-center">Login</h2>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

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

### 2.5 Create Signup Page

**File**: `frontend/app/signup/page.tsx`

(Similar structure to login, but calls `apiClient.signup()`)

### 2.6 Create AuthGuard Component

**File**: `frontend/components/AuthGuard.tsx`

```typescript
/**
 * Task: T-XXX
 * Spec: 002-authentication/spec.md - US-3
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('access_token')
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
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/signup", json={
            "email": "test@example.com",
            "password": "password123"
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_login_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Signup first
        await client.post("/api/v1/auth/signup", json={
            "email": "login@example.com",
            "password": "password123"
        })

        # Login
        response = await client.post("/api/v1/auth/login", json={
            "email": "login@example.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
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

1. Open http://localhost:3000/signup
2. Register a new account
3. Verify redirect to /tasks (will show 404 until tasks feature implemented)
4. Log out
5. Login with same credentials
6. Verify redirect to /tasks

### 4.3 Success Checklist

- [ ] User can register with valid email/password
- [ ] Duplicate emails are rejected (409 error)
- [ ] User can login with correct credentials
- [ ] Invalid credentials return 401 error
- [ ] JWT token is stored in sessionStorage
- [ ] Protected routes redirect to /login without token
- [ ] API docs visible at http://localhost:8000/docs

---

## Common Issues & Solutions

### Issue: "JWT_SECRET_KEY not set"
**Solution**: Add to `backend/.env` and restart server

### Issue: CORS error in frontend
**Solution**: Verify `ALLOWED_ORIGINS` includes `http://localhost:3000`

### Issue: Database connection failed
**Solution**: Check `DATABASE_URL` in `.env` is correct Neon connection string

### Issue: "Email already registered" but database is empty
**Solution**: Check case-insensitive uniqueness. Clear test data.

---

## Next Steps

After authentication is working:
1. Implement task CRUD feature (002-task-crud)
2. Use `AuthGuard` to protect task routes
3. Use `get_current_user_id()` dependency in task endpoints

---

**Estimated Total Time**: 6-8 hours for complete implementation and testing
