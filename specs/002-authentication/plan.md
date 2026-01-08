# Implementation Plan: Authentication

**Branch**: `002-auth-fixes` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-authentication/spec.md`

**Note**: This template is filled in by `/sp.plan` command. See `.specify/templates/plan.md` for execution workflow.

## Summary

Implement JWT-based user authentication with username, password change, and email update functionality. Users can register with username/email/password, login using either credential, change password, update email, logout securely, and see their profile with avatar on authenticated pages. Backend uses FastAPI + SQLModel + bcrypt; frontend uses Next.js 14+ with real-time validation, JWT storage, and Snackbar notifications for success/error messages.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI, SQLModel, bcrypt, Pydantic, python-jose (backend); Next.js 14+, React 18+, Tailwind CSS, jose, Material-UI Snackbar (frontend)
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Jest (frontend - optional, not in scope for Phase-2)
**Target Platform**: Web browser (modern browsers), Linux server
**Project Type**: web (frontend + backend)
**Performance Goals**: <200ms p95 for auth endpoints, <100ms for JWT validation
**Constraints**: httpOnly cookies preferred, 60-min token expiry, user data isolation mandatory
**Scale/Scope**: Multi-user with per-user data isolation, 10k+ concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Article II: Mandatory Technology Stack
- ✅ Backend: FastAPI (Python 3.11+) - COMPLIANT
- ✅ Frontend: Next.js 14+ (App Router) - COMPLIANT
- ✅ Auth: JWT tokens - COMPLIANT
- ✅ Validation: Pydantic - COMPLIANT
- ✅ ORM: SQLModel - COMPLIANT
- ✅ Database: Neon PostgreSQL - COMPLIANT

### Article III: Architecture Rules
- ✅ Frontend-Backend Separation: Separate systems communicating via REST API - COMPLIANT
- ✅ API-First: All endpoints under `/api/v1/` - COMPLIANT
- ✅ User Data Isolation: Every query filtered by `user_id` - COMPLIANT
- ✅ JWT Authentication: All protected routes require valid JWT - COMPLIANT

### Article IV: Spec-Driven Law
- ✅ Pipeline: Specify → Plan → Tasks → Implement - COMPLIANT
- ✅ Spec Authority: Constitution > Spec > Plan > Tasks > Code - COMPLIANT

### Article V: Traceability Requirements
- ✅ Code Attribution: Every file must reference Task ID and Spec section - WILL BE ENFORCED
- ✅ Function Attribution: Every function must have docstring with Task ID - WILL BE ENFORCED

### Article VI: AI Agent Behavior
- ✅ Read Specs First: Will read spec before implementation - WILL BE ENFORCED
- ✅ Refuse Without Spec: Will refuse to code without spec reference - WILL BE ENFORCED
- ✅ No Invention: Will not create features not in spec - WILL BE ENFORCED

### Article VII: Security Requirements
- ✅ Password Hashing: bcrypt with salt rounds 12 - COMPLIANT
- ✅ JWT Secret: From environment variable only - COMPLIANT
- ✅ Input Validation: Pydantic schemas on all endpoints - COMPLIANT
- ✅ CORS: Configured for approved origins - COMPLIANT
- ✅ No Secrets in Git: All credentials in environment variables - COMPLIANT

### Phase-2 Scope
- ✅ In Scope: Multi-user task management, JWT auth, REST API, Next.js frontend, password change, email update - COMPLIANT
- ✅ Out of Scope: AI chatbot, OAuth, MFA, password reset, username change, email verification - COMPLIANT

**CONCLUSION**: All constitution gates PASSED. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-authentication/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
└── contracts/           # Phase 1 output (/sp.plan command)
    └── auth.yaml          # OpenAPI specification for all auth endpoints
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── user.py          # User model with username, email, password_hash
│   ├── services/
│   │   └── auth_service.py   # Auth business logic (hashing, JWT, validation)
│   ├── api/
│   │   ├── dependencies.py    # JWT dependency for protected routes
│   │   └── routes/
│   │       └── auth.py       # Auth endpoints (signup, login, logout, change-password, update-email)
│   └── main.py              # FastAPI app setup, CORS, JWT config
└── tests/
    ├── test_auth_service.py
    └── test_auth_routes.py

frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignupForm.tsx    # Registration form with real-time validation
│   │   │   ├── LoginForm.tsx       # Login form (email/username support)
│   │   │   ├── PasswordChangeForm.tsx  # Password change form
│   │   │   ├── EmailUpdateForm.tsx    # Email update form
│   │   │   └── UserProfile.tsx     # Profile display with avatar
│   │   ├── ui/
│   │   │   ├── Avatar.tsx          # Circular text badge component
│   │   │   └── Snackbar.tsx         # Success/error notification component
│   ├── lib/
│   │   ├── api.ts                 # API client with JWT attachment
│   │   └── jwt.ts                 # JWT decoding utilities
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   ├── change-password/
│   │   │   │   └── page.tsx
│   │   │   └── update-email/
│   │   │       └── page.tsx
│   │   └── layout.tsx                # Navigation with profile/avatar/logout
│   └── middleware.ts                # Auth middleware for protected routes
└── tests/
    ├── api.test.ts
    └── auth.test.ts
```

**Structure Decision**: Web application structure (Option 2) - separate frontend and backend systems communicating via REST API. This aligns with Phase-2 requirements for frontend-backend separation and API-first architecture.

## Complexity Tracking

> **No constitutional violations requiring justification**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

---

## Phase 0: Research & Technology Decisions

### Research Completed

#### Decision 1: JWT Library Selection (Updated for Profile Editing)
**Decision**: python-jose (backend), jose (frontend)

**Rationale**:
- python-jose is actively maintained, widely used, and supports HS256 algorithm
- jose is the TypeScript equivalent with identical JWT behavior
- Both libraries support JWT decoding on frontend (required for username extraction)
- Better compatibility than alternatives like PyJWT (Python) or jsonwebtoken (JS)

**Alternatives Considered**:
- PyJWT (Python): Less active development, TypeScript equivalent less mature
- authlib (Python): Over-engineered for simple JWT use case
- NextAuth.js (frontend): Full auth framework, too complex for this use case

**Implementation Approach**:
```python
# Backend (python-jose)
from jose import jwt, JWTError

# Create token with username claim
token = jwt.encode({
    "sub": str(user_id),
    "username": username,  # Added for profile display
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

#### Decision 2: Username Storage & Case-Insensitive Uniqueness
**Decision**: Store username in lowercase in database, normalize to lowercase on registration/login

**Rationale**:
- Case-insensitive uniqueness requirement (user1 and User1 are duplicates)
- Storing lowercase ensures database integrity and prevents duplicates
- Normalization on login (both frontend and backend) for consistency

**Alternatives Considered**:
- Store with case-sensitive, add unique constraint on LOWER(username): More complex, requires PostgreSQL expression index
- Store with case, handle duplicates in application logic: Risk of race conditions

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

#### Decision 3: Password Confirmation Validation Approach
**Decision**: Validate on both frontend (real-time) and backend (server-side)

**Rationale**:
- Frontend validation provides immediate user feedback (UX)
- Backend validation is mandatory for security (cannot be bypassed)
- Double-layer approach catches both UX issues and security threats
- Best practice for web applications

**Alternatives Considered**:
- Frontend validation only: Security vulnerability - can be bypassed
- Backend validation only: Poor UX - user doesn't know about errors until submission

**Implementation**:
```typescript
// Frontend real-time validation
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

```python
# Backend server-side validation
if request.password != request.confirm_password:
    raise HTTPException(
        status_code=400,
        detail="Passwords do not match"
    )
```

#### Decision 4: Session Expiration Handling
**Decision**: Redirect to login with "Session expired" message, preserve unsaved form data

**Rationale**:
- Clear error messaging for user awareness
- Form data preservation prevents data loss (better UX)
- Standard pattern for web applications with JWT auth

**Alternatives Considered**:
- Silent redirect: Confusing UX - user doesn't know why logged out
- Modal refresh dialog: More complex to implement, similar UX outcome

**Implementation**:
```typescript
// API client interceptor
if (response.status === 401) {
  // Preserve unsaved form data
  const formData = this.getUnsavedFormData()
  if (formData) {
    sessionStorage.setItem('unsavedFormData', JSON.stringify(formData))
  }

  // Show session expired message
  router.push('/login?session=expired')
}
```

```python
# Backend error handling
except JWTError:
    raise HTTPException(
        status_code=401,
        detail="Session expired"
    )
```

#### Decision 5: Avatar Implementation
**Decision**: Frontend-only circular text badge (uppercase first letter)

**Rationale**:
- No backend storage needed - username already in JWT
- Frontend decodes JWT and extracts username for display
- Simpler than storing avatar data in database
- Aligned with spec: "If username starts with number/special character, display that character"

**Alternatives Considered**:
- Backend avatar API: Over-engineered - adds unnecessary complexity
- Image upload: Out of scope (Phase-2 simplification)

**Implementation**:
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
}, SECRET_KEY, algorithm="HS256")
```

#### Decision 6: Password Change Validation
**Decision**: Require current password verification before allowing password change

**Rationale**:
- Security best practice - prevents unauthorized password changes
- User must verify identity before changing password
- Reduces risk of account takeover if session is left open

**Alternatives Considered**:
- Email verification flow only: More complex, requires SMTP setup
- Password change without verification: Less secure
- Security questions: Over-engineered for Phase-2

**Implementation**:
```python
# Verify current password before change
if not pwd_context.verify(current_password, user.password_hash):
    raise HTTPException(
        status_code=401,
        detail="Current password is incorrect"
    )
```

#### Decision 7: Email Update Validation
**Decision**: Require password verification before allowing email update

**Rationale**:
- Security best practice - prevents unauthorized email changes
- User must verify identity before changing email
- Prevents email hijacking if session is left open
- Ensures user owns the email being updated

**Alternatives Considered**:
- Email verification flow only: More complex, requires SMTP setup
- Email update without password: Less secure
- Email confirmation via link: More complex

**Implementation**:
```python
# Verify password before email update
if not pwd_context.verify(password, user.password_hash):
    raise HTTPException(
        status_code=401,
        detail="Password is incorrect"
    )

# Check if email already registered to another account
existing_by_email = session.execute(
    select(User).where(User.email == new_email)
).scalar_one_or_none()
if existing_by_email:
    raise HTTPException(
        status_code=409,
        detail="Email already registered to another account"
    )
```

#### Decision 8: CORS Configuration
**Decision**: Configure dynamic origin list from environment variable

**Rationale**:
- Support both local development (http://localhost:3000) and production (Hugging Face Spaces)
- Flexible for multiple frontend deployments
- Secure: only explicitly listed origins allowed

**Alternatives Considered**:
- Allow all origins (*): Security vulnerability - allows any domain
- Hardcoded single origin: Inflexible for multi-environment deployments

**Implementation**:
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

#### Decision 9: Snackbar (Toast) Notifications for UX
**Decision**: Use Material-UI Snackbar for all success messages and error notifications

**Rationale**:
- Provides immediate user feedback for all actions
- Standard UI pattern for success/error messages
- Better than alerts or console logs
- Supports auto-dismiss and stacking

**Alternatives Considered**:
- Alert notifications: Too intrusive
- Console logs only: No visual feedback
- Modal dialogs: Over-engineered for simple notifications

**Implementation**:
```typescript
import { Snackbar, AlertColor } from '@mui/material'

// Success message
const showSuccessSnackbar = (message: string) => {
  enqueueSnackbar({
    message,
    variant: 'success',
    autoHideDuration: 4000,
  })
}

// Error message
const showErrorSnackbar = (message: string) => {
  enqueueSnackbar({
    message,
    variant: 'error',
    autoHideDuration: 6000,
  })
}

// Usage
// On successful password change
showSuccessSnackbar("Password changed successfully")

// On error
showErrorSnackbar("Current password is incorrect")
```

#### Decision 10: Database Schema for Users with Username
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
from typing import Optional, List
import uuid
from datetime import datetime

class User(SQLModel, table=True):
    """User account for authentication with username, password change, and email update support.

    Task: T-XXX
    Spec: 002-authentication/spec.md - FR-1, FR-2, FR-6, FR-7
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
        description="User email address (login credential, for update)"
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

# Constraints:
# - username: 3-20 chars, alphanumeric/_/- only, first char letter/number
# - email: valid email format, basic regex
# - password_hash: never logged or exposed
# - password_change_hash: Optional field for future audit trail (Phase-3+)
```

### No Outstanding Research Items

All technical decisions made. Proceeding to Phase 1.

---

## Phase 1: Design & Contracts

### Data Model

User Entity (from spec):
```python
class User(SQLModel, table=True):
    id: UUID | primary key
    username: str | unique, indexed, lowercase
    email: str | unique, indexed, lowercase
    password_hash: str | bcrypt hashed
    created_at: datetime | auto-generated
    updated_at: datetime | auto-generated

# Constraints:
# - username: 3-20 chars, alphanumeric/_/- only, first char letter/number
# - email: valid email format
# - password_change_hash: Optional field for audit (future)
# - No email verification required (Phase-2)
# - No username change allowed (Phase-2)
```

**Full data model**: See [data-model.md](./data-model.md)

### API Contracts

**Contract File**: `/specs/002-authentication/contracts/auth.yaml` (OpenAPI 3.0 specification)

**Key Contract Details**:
- Registration: POST /api/v1/auth/signup
  - Request: `{username, email, password, confirm_password}`
  - Response: `{access_token, token_type, user: {id, username, email}}`
- Login: POST /api/v1/auth/login
  - Request: `{email_or_username, password}`
  - Response: `{access_token, token_type, user: {id, username, email}}`
- Password Change: POST /api/v1/auth/change-password
  - Request: `{current_password, new_password, confirm_password}`
  - Response: `{message}`
  - Errors: 401 (current password incorrect), 400 (new password too short), 400 (passwords don't match), 422 (validation)
- Email Update: POST /api/v1/auth/update-email
  - Request: `{new_email, password}`
  - Response: `{message, email}`
  - Errors: 401 (password incorrect), 400 (invalid email format), 409 (email already registered), 422 (validation)
- Logout: POST /api/v1/auth/logout
  - Response: `{message}`

### Frontend Integration

**JWT Storage Strategy**:
- Preferred: httpOnly cookies (via Next.js middleware)
- Fallback: sessionStorage (if cookies unavailable)
- Never: localStorage (XSS vulnerability)

**Snackbar Notifications**:
- Material-UI Snackbar for all success messages
- Error notifications with auto-dismiss (6 seconds)
- Success notifications with auto-dismiss (4 seconds)

**Real-Time Validation**:
- Username format: 3-20 chars, regex: `^[a-zA-Z0-9][a-zA-Z0-9_-]*$`
- Email format: Basic regex validation
- Password match: Compare password and confirm_password fields
- Display error messages immediately as user types

**Profile Display**:
- Decode JWT using `jose` library
- Extract `username` claim
- Display avatar: circular badge with `username[0].toUpperCase()`
- Show full username in navigation bar

### Quickstart Guide

**Backend Setup**:
1. Install dependencies: `pip install fastapi uvicorn sqlmodel python-jose passlib[bcrypt] python-multipart pydantic[email] psycopg2-binary @mui/material`
2. Set environment variables: `DATABASE_URL`, `JWT_SECRET_KEY`, `CORS_ORIGINS`
3. Run migration: Create users table with username, email, password_hash
4. Start server: `uvicorn src.main:app --reload`

**Frontend Setup**:
1. Install dependencies: `npm install jose @mui/material @emotion/react @emotion/styled`
2. Configure API URL: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
3. Implement auth middleware for protected routes
4. Add profile/avatar components to navigation
5. Add Snackbar provider for notifications

**Full quickstart**: See [quickstart.md](./quickstart.md)

---

## Re-evaluated Constitution Check (Post-Phase 1)

All gates remain PASSED. Design decisions align with constitutional requirements:
- JWT authentication with 60-min expiry
- User data isolation via `user_id` filtering
- Frontend-backend separation maintained
- Security requirements satisfied (bcrypt hashing, JWT from env var, CORS configured, password/email change with current password verification)
- Snackbar notifications for UX
- No username change (login identity preserved)

**CONCLUSION**: Design is constitutionally compliant. Proceed to Phase 2 (tasks generation).

---

## Next Steps

1. **Run `/sp.tasks`**: Generate implementation tasks from this plan
2. **Implement Backend**: Build auth endpoints (signup, login, logout, change-password, update-email), models, and services
3. **Implement Frontend**: Build auth UI components (forms, profile, avatar, Snackbar), API integration, and routing
4. **Test End-to-End**: Verify registration, login, password change, email update, logout, and profile display
5. **Validate Security**: Ensure JWT validation, password hashing, user isolation, and CORS configuration
6. **Update Quickstart**: Verify all steps work with new profile editing features

---

**Related Artifacts**:
- Spec: [spec.md](./spec.md)
- Research: [research.md](./research.md)
- Data Model: [data-model.md](./data-model.md)
- Quickstart: [quickstart.md](./quickstart.md)
- Contracts: [contracts/auth.yaml](./contracts/auth.yaml)
