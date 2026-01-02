# Research: Authentication Implementation

**Feature**: 002-authentication
**Date**: 2025-12-31
**Status**: Complete

## Research Tasks Completed

### 1. Better Auth vs Manual JWT Implementation

**Decision**: Use `python-jose` for JWT handling (not Better Auth library)

**Rationale**:
- Better Auth is primarily a JavaScript/TypeScript library
- For Python FastAPI, `python-jose` is industry standard for JWT
- Provides HS256, RS256 signing algorithms
- Well-documented and maintained
- FastAPI documentation recommends it

**Alternatives Considered**:
- **PyJWT**: Another popular option, but `python-jose` has better FastAPI integration examples
- **Authlib**: More comprehensive but overkill for simple JWT needs
- **Better Auth Python**: Not officially supported/maintained

**Implementation Approach**:
- Use `python-jose[cryptography]` for JWT encode/decode
- Use `passlib[bcrypt]` for password hashing
- Use FastAPI's `Depends()` for auth dependency injection

### 2. Password Hashing Library

**Decision**: Use `passlib` with bcrypt

**Rationale**:
- Industry-standard password hashing library
- Supports multiple hashing algorithms (bcrypt, argon2, scrypt)
- BCrypt is battle-tested and secure
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

- **sessionStorage fallback** (if cookies blocked):
  - Cleared when browser closes
  - Better than localStorage (persists after close)
  - Still vulnerable to XSS but acceptable for Phase-2

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

### 6. Email Validation Approach

**Decision**: Use Pydantic's `EmailStr` type + case-insensitive uniqueness

**Rationale**:
- Pydantic validates email format automatically
- No need for custom regex
- Case-insensitive check prevents duplicate@example.com and Duplicate@example.com
- Phase-2 doesn't require email verification (no SMTP needed)

**Implementation**:
```python
from pydantic import EmailStr

class UserCreate(BaseModel):
    email: EmailStr  # Validates format
    password: str

# Database query
existing = session.query(User).filter(
    func.lower(User.email) == email.lower()
).first()
```

### 7. CORS Configuration for Phase-2

**Decision**: Allow localhost:3000 (frontend) with credentials

**Rationale**:
- Frontend runs on port 3000 (Next.js default)
- Backend runs on port 8000 (FastAPI default)
- Must allow credentials for httpOnly cookies
- Restrict to specific origin (not "*")

**Implementation**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 8. Database Schema for Users

**Decision**: Use SQLModel with UUID primary key

**Rationale**:
- UUIDs prevent enumeration attacks
- Globally unique across systems
- Better than auto-increment for distributed systems (future)
- SQLModel combines Pydantic + SQLAlchemy

**Schema**:
```python
from sqlmodel import SQLModel, Field
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 9. Testing Strategy

**Decision**: Pytest with FastAPI TestClient

**Rationale**:
- FastAPI provides TestClient (built on Starlette)
- No need to run actual server for tests
- Async support with pytest-asyncio
- Can test auth flow end-to-end

**Test Coverage**:
- Unit tests: Password hashing, JWT encode/decode
- Integration tests: Signup, login, protected route access
- Security tests: Invalid tokens, expired tokens, duplicate emails

### 10. Frontend Auth Flow Components

**Decision**: AuthGuard component + useAuth hook pattern

**Rationale**:
- **AuthGuard**: Wraps protected pages, redirects if not authenticated
- **useAuth hook**: Centralized auth state (token, user, login, logout)
- **API client**: Automatically attaches token to requests

**Component Structure**:
```
frontend/
├── components/
│   └── AuthGuard.tsx      # Protects routes
├── hooks/
│   └── useAuth.ts         # Auth state management
├── lib/
│   └── api.ts             # HTTP client with token
└── app/
    ├── login/page.tsx
    ├── signup/page.tsx
    └── tasks/layout.tsx   # Uses AuthGuard
```

## Technology Decisions Summary

| Area | Technology | Version/Config |
|------|------------|----------------|
| JWT Library | python-jose | ^3.3.0 |
| Password Hashing | passlib[bcrypt] | ^1.7.4 |
| Token Algorithm | HS256 | 256-bit |
| Token Expiration | Access Token | 60 minutes |
| Token Storage | httpOnly cookies | SameSite=Lax, Secure |
| Email Validation | Pydantic EmailStr | Built-in |
| CORS Origin | localhost:3000 | Allow credentials |
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
    "js-cookie": "^3.0.5"  // Cookie management
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6"
  }
}
```

## Security Checklist

- [x] JWT secrets in environment variables
- [x] Passwords hashed with bcrypt (12 rounds)
- [x] httpOnly cookies for XSS protection
- [x] CORS restricted to specific origin
- [x] Email uniqueness enforced (case-insensitive)
- [x] Token expiration enforced (60 minutes)
- [x] No passwords in JWT payload
- [x] No passwords in logs or error messages
- [x] UUID user IDs (no enumeration)
- [x] Pydantic validation for all inputs

## References

- FastAPI Security: https://fastapi.tiangolo.com/tutorial/security/
- python-jose docs: https://python-jose.readthedocs.io/
- passlib docs: https://passlib.readthedocs.io/
- JWT spec (RFC 7519): https://datatracker.ietf.org/doc/html/rfc7519
- OWASP Auth Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

---

**Next Step**: Generate `data-model.md` based on this research.
