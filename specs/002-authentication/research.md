# Research: Authentication Implementation

**Feature**: 002-authentication
**Date**: 2026-01-06
**Status**: Complete

## Research Tasks Completed

### 1. JWT Library Selection (Updated for Username Support)

**Decision**: python-jose (backend), jose (frontend)

**Rationale**:
- python-jose is actively maintained, widely used, and supports HS256 algorithm
- jose is the TypeScript equivalent with identical JWT behavior
- Both libraries support JWT decoding on frontend (required for username extraction)
- Better compatibility than alternatives like PyJWT (Python) or jsonwebtoken (JS)
- Type-safe for both Python and TypeScript

**Alternatives Considered**:
- PyJWT (Python): Less active development, TypeScript equivalent less mature
- authlib (Python): Over-engineered for simple JWT use case
- NextAuth.js (frontend): Full auth framework, too complex for this use case

**Implementation Approach**:
- Use `python-jose[cryptography]` for JWT encode/decode
- Include username claim in JWT payload for frontend display
- Use `jose` in frontend for token decoding

```python
# Backend (python-jose)
from jose import jwt, JWTError

# Create token with username
token = jwt.encode({
    "sub": str(user_id),
    "username": username,  # Added for frontend profile display
    "exp": expire_time,
    "iat": now_time
}, SECRET_KEY, algorithm="HS256")

# Decode token
try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    user_id = payload["sub"]
    username = payload["username"]
except JWTError:
    raise InvalidTokenError()
```

```typescript
// Frontend (jose)
import { jwtDecode } from 'jose'

// Decode token and extract username
const payload = jwtDecode<JwtPayload>(token)
const username = payload.username
```

### 2. Password Hashing Library

**Decision**: Use `passlib` with bcrypt

**Rationale**:
- Industry-standard password hashing library
- Supports multiple hashing algorithms (bcrypt, argon2, scrypt)
- Bcrypt is battle-tested and secure
- Easy integration with FastAPI
- Automatic salt generation

**Configuration**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

**Salt Rounds**: 12 (balances security and performance)

### 3. Frontend Token Storage Strategy

**Decision**: httpOnly cookies with fallback to sessionStorage

**Rationale**:
- **httpOnly cookies** (preferred):
  - Protected from XSS attacks
  - Automatically sent with requests
  - Secure flag for HTTPS
  - SameSite attribute for CSRF protection

- **sessionStorage fallback** (if cookies unavailable):
  - Cleared when browser closes
  - Better than localStorage (persists after close)
  - Still vulnerable to XSS but acceptable for Phase-2

- **Never**: localStorage (XSS vulnerability)

**Implementation Notes**:
- Backend sets cookie in auth response
- Frontend API client checks for cookie first
- If no cookie, store in sessionStorage and attach manually

### 4. JWT Secret Key Management

**Decision**: Environment variable with validation on startup

**Rationale**:
- Never hardcode secrets in code
- Fail fast if missing (app won't start)
- Different secrets per environment (dev, staging, prod)
- Rotate easily without code changes

**Implementation**:
```python
import os

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is not set")
```

**Generation Recommendation**:
```bash
# Generate secure random secret (32 bytes = 64 hex chars)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 5. Token Expiration Strategy

**Decision**: 60-minute access tokens, no refresh tokens (Phase-2 simplification)

**Rationale**:
- **60 minutes** balances security and UX
- Users won't be logged out mid-task
- Short enough to limit exposure if compromised
- **No refresh tokens** in Phase-2:
  - Adds complexity (separate endpoint, storage, rotation)
  - 60min is acceptable for development/demo
  - Can add in Phase-3 if needed

**Implementation**:
```python
from datetime import datetime, timedelta

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")
```

### 6. Username Storage & Case-Insensitive Uniqueness

**Decision**: Store username in lowercase in database, normalize to lowercase on registration/login

**Rationale**:
- Case-insensitive uniqueness requirement (user1 and User1 are duplicates)
- Storing lowercase ensures database integrity and prevents duplicates
- Normalization on login (both frontend and backend) for consistency
- Simple to implement, no complex database constraints needed

**Alternatives Considered**:
- **Store with case-sensitive, add unique constraint on LOWER(username)**: More complex, requires PostgreSQL expression index
- **Store with case, handle duplicates in application logic**: Risk of race conditions

**Implementation**:
```python
# On registration
username_lower = username.lower()
email_lower = email.lower()

# Store in database
user = User(username=username_lower, email=email_lower, password_hash=hashed_pw)

# On login - support both email and username
username_or_email_lower = username_or_email.lower()

# Query database
user = session.exec(
    select(User)
    .where((col(User.username) == username_or_email_lower) |
           (col(User.email) == username_or_email_lower))
).first()
```

### 7. Email & Username Validation

**Decision**: Use Pydantic's `EmailStr` type + custom username validator

**Rationale**:
- Pydantic validates email format automatically
- No need for custom regex for email
- Case-insensitive check prevents duplicate@example.com and Duplicate@example.com
- Phase-2 doesn't require email verification (no SMTP needed)
- Username validation: 3-20 chars, alphanumeric/_/- only, first char letter/number

**Implementation**:
```python
from pydantic import EmailStr, BaseModel, field_validator
import re

class UserCreate(BaseModel):
    username: str
    email: EmailStr  # Validates format automatically
    password: str
    confirm_password: str

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not 3 <= len(v) <= 20:
            raise ValueError('Username must be 3-20 characters')
        if not re.match(r'^[a-zA-Z0-9][a-zA-Z0-9_-]*$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, hyphens')
        return v.lower()  # Normalize to lowercase

    @field_validator('password', 'confirm_password')
    @classmethod
    def passwords_match(cls, v: str, info: ValidationInfo) -> str:
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('Passwords do not match')
        return v
```

### 8. Password Confirmation Validation Approach

**Decision**: Validate on both frontend (real-time) and backend (server-side)

**Rationale**:
- Frontend validation provides immediate user feedback (UX)
- Backend validation is mandatory for security (cannot be bypassed)
- Double-layer approach catches both UX issues and security threats
- Best practice for web applications

**Alternatives Considered**:
- **Frontend validation only**: Security vulnerability - can be bypassed by skipping validation logic
- **Backend validation only**: Poor UX - user doesn't know about errors until form submission

**Frontend Implementation**:
```typescript
// Real-time validation
const validatePasswordMatch = () => {
  if (password !== confirmPassword) {
    setPasswordError("Passwords do not match")
  } else {
    setPasswordError("")
  }
}

// Call on input change
<input
  value={password}
  onChange={(e) => {
    setPassword(e.target.value)
    validatePasswordMatch()
  }}
/>
```

**Backend Implementation**:
```python
# Server-side validation
if request.password != request.confirm_password:
    raise HTTPException(
        status_code=400,
        detail="Passwords do not match"
    )
```

### 9. Session Expiration Handling

**Decision**: Redirect to login with "Session expired" message, preserve unsaved form data

**Rationale**:
- Clear error messaging for user awareness
- Form data preservation prevents data loss (better UX)
- Standard pattern for web applications with JWT auth
- User knows why they're being redirected

**Alternatives Considered**:
- **Silent redirect**: Confusing UX - user doesn't know why logged out
- **Modal refresh dialog**: More complex to implement, similar UX outcome

**Frontend Implementation**:
```typescript
// API client interceptor
if (response.status === 401) {
  // Preserve unsaved form data
  sessionStorage.setItem('unsavedFormData', JSON.stringify(formData))

  // Show session expired message
  router.push('/login?session=expired')
}

// Login page - restore form data if present
useEffect(() => {
  const unsavedData = sessionStorage.getItem('unsavedFormData')
  if (unsavedData) {
    setFormData(JSON.parse(unsavedData))
    sessionStorage.removeItem('unsavedFormData')
  }
}, [])
```

**Backend Error Handling**:
```python
# JWT dependency error handling
except JWTError:
    raise HTTPException(
        status_code=401,
        detail="Session expired"
    )
```

### 10. Avatar Implementation

**Decision**: Frontend-only circular text badge (uppercase first letter)

**Rationale**:
- No backend storage needed - username already in JWT
- Frontend decodes JWT and extracts username for display
- Simpler than storing avatar data in database
- Aligned with spec: "If username starts with number/special character, display that character"

**Alternatives Considered**:
- **Backend avatar API**: Over-engineered - adds unnecessary complexity
- **Image upload**: Out of scope (Phase-2 simplification)

**Frontend Implementation**:
```typescript
// Avatar component
function Avatar({ username }: { username: string }) {
  const avatarLetter = username[0]?.toUpperCase() || '?'

  return (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
      {avatarLetter}
    </div>
  )
}

// Profile display component
function UserProfile({ username }: { username: string }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar username={username} />
      <span className="font-medium">{username}</span>
    </div>
  )
}

// Usage in navigation
<NavLink to="/profile">
  <UserProfile username={currentUser.username} />
</NavLink>
```

**Backend Implementation**:
```python
# No backend changes needed
# Username included in JWT token payload
token = jwt.encode({
    "sub": str(user_id),
    "username": username,  # Included for frontend display
    "exp": exp_time,
    "iat": now_time
}, SECRET_KEY)
```

### 11. CORS Configuration

**Decision**: Configure dynamic origin list from environment variable

**Rationale**:
- Support both local development (http://localhost:3000) and production (Hugging Face Spaces)
- Flexible for multiple frontend deployments
- Secure: only explicitly listed origins allowed

**Alternatives Considered**:
- **Allow all origins (*)**: Security vulnerability - allows any domain
- **Hardcoded single origin**: Inflexible for multi-environment deployments

**Backend Implementation**:
```python
# CORS configuration
import os

origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # e.g., ["http://localhost:3000", "https://shurem-todo-app.hf.space"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Environment Variables**:
```bash
# .env
CORS_ORIGINS=http://localhost:3000,https://shurem-todo-app.hf.space
```

### 12. Frontend Real-Time Validation

**Decision**: Client-side validation with regex patterns for username and email

**Rationale**:
- Provides immediate feedback to users as they type
- Reduces unnecessary API calls
- Improves UX by catching errors early
- Still validates on backend for security

**Implementation**:
```typescript
// Validation utilities
const USERNAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,19}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateUsername = (username: string): string | null => {
  if (!username) return "Username is required"
  if (username.length < 3) return "Username must be at least 3 characters"
  if (username.length > 20) return "Username must be at most 20 characters"
  if (!USERNAME_REGEX.test(username)) {
    return "Username can only contain letters, numbers, underscores, and hyphens"
  }
  if (username[0] && !/^[a-zA-Z0-9]$/.test(username[0])) {
    return "Username must start with a letter or number"
  }
  return null
}

const validateEmail = (email: string): string | null => {
  if (!EMAIL_REGEX.test(email)) return "Invalid email format"
  return null
}

// Usage in form component
const [usernameError, setUsernameError] = useState<string | null>("")

const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setUsername(value)
  setUsernameError(validateUsername(value))
}
```

### 13. Database Schema for Users with Username

**Decision**: Use SQLModel with UUID primary key, unique lowercase username and email

**Rationale**:
- UUIDs prevent enumeration attacks
- Globally unique across systems
- Better than auto-increment for distributed systems (future)
- SQLModel combines Pydantic + SQLAlchemy
- Lowercase storage for case-insensitive uniqueness

**Schema**:
```python
from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )
    username: str = Field(
        unique=True,
        index=True,
        max_length=20
    )
    email: str = Field(
        unique=True,
        index=True,
        max_length=255
    )
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)

# Constraints enforced in Pydantic models:
# - username: 3-20 chars, alphanumeric/_/- only, first char letter/number
# - email: valid email format, basic regex
# - password_hash: never logged or exposed
```

### 14. Testing Strategy

**Decision**: Pytest with FastAPI TestClient

**Rationale**:
- FastAPI provides TestClient (built on Starlette)
- No need to run actual server for tests
- Async support with pytest-asyncio
- Can test auth flow end-to-end

**Test Coverage**:
- **Unit tests**: Password hashing, JWT encode/decode, username validation
- **Integration tests**: Signup, login, logout, protected route access
- **Security tests**: Invalid tokens, expired tokens, duplicate usernames, duplicate emails
- **UX tests**: Password confirmation mismatch, username format validation

**Example Test**:
```python
import pytest
from fastapi.testclient import TestClient

def test_signup_with_duplicate_username(client: TestClient):
    # Create first user
    response1 = client.post("/api/v1/auth/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123",
        "confirm_password": "password123"
    })
    assert response1.status_code == 201

    # Try to create duplicate username (different case)
    response2 = client.post("/api/v1/auth/signup", json={
        "username": "TestUser",  # Different case, should fail
        "email": "test2@example.com",
        "password": "password123",
        "confirm_password": "password123"
    })
    assert response2.status_code == 409
    assert "already exists" in response2.json()["detail"]

def test_login_with_username_or_email(client: TestClient):
    # Create user
    client.post("/api/v1/auth/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123",
        "confirm_password": "password123"
    })

    # Login with username
    response1 = client.post("/api/v1/auth/login", json={
        "username": "testuser",
        "password": "password123"
    })
    assert response1.status_code == 200
    assert "access_token" in response1.json()

    # Login with email
    response2 = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response2.status_code == 200
    assert "access_token" in response2.json()
```

## Technology Decisions Summary

| Area | Technology | Version/Config |
|------|------------|----------------|
| JWT Library (Backend) | python-jose | ^3.3.0 |
| JWT Library (Frontend) | jose | ^5.x |
| Password Hashing | passlib[bcrypt] | ^1.7.4 |
| Token Algorithm | HS256 | 256-bit |
| Token Expiration | Access Token | 60 minutes |
| Token Storage | httpOnly cookies | SameSite=Lax, Secure |
| Username Storage | Lowercase | 3-20 chars, alphanumeric/_/- |
| Email Validation | Pydantic EmailStr | Built-in |
| CORS Origin | Dynamic from env | localhost:3000 + prod |
| User ID Type | UUID | v4 |
| Database ORM | SQLModel | ^0.0.14 |
| Testing Framework | pytest + TestClient | Latest |

## Dependencies to Add

### Backend (Python)
```txt
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart  # For form data
```

### Frontend (TypeScript)
```json
{
  "dependencies": {
    "jose": "^5.x"
  },
  "devDependencies": {
    "@types/jose": "^5.x"
  }
}
```

## Security Checklist

- [x] JWT secrets in environment variables
- [x] Passwords hashed with bcrypt (12 rounds)
- [x] httpOnly cookies for XSS protection
- [x] CORS restricted to specific origins
- [x] Username uniqueness enforced (case-insensitive)
- [x] Email uniqueness enforced (case-insensitive)
- [x] Token expiration enforced (60 minutes)
- [x] No passwords in JWT payload
- [x] No passwords in logs or error messages
- [x] UUID user IDs (no enumeration)
- [x] Pydantic validation for all inputs
- [x] Frontend validation for UX (real-time)
- [x] Backend validation for security (cannot be bypassed)

## References

- FastAPI Security: https://fastapi.tiangolo.com/tutorial/security/
- python-jose docs: https://python-jose.readthedocs.io/
- jose docs: https://jose.dev/
- passlib docs: https://passlib.readthedocs.io/
- JWT spec (RFC 7519): https://datatracker.ietf.org/doc/html/rfc7519
- OWASP Auth Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

---

**Next Step**: Generate `data-model.md` based on this research and spec requirements.
