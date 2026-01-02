# Feature Specification: Authentication

## Overview

User registration and login using email/password with JWT token-based authentication.

## User Stories

### US-1: User Registration
**As a** new user
**I want to** create an account with email and password
**So that** I can use the todo application

**Acceptance Criteria**:
- Email must be unique (no duplicates)
- Password must be at least 8 characters
- Password is hashed before storage (never stored in plaintext)
- JWT token issued immediately after successful registration
- User automatically logged in after registration

### US-2: User Login
**As an** existing user
**I want to** log in with my email and password
**So that** I can access my tasks

**Acceptance Criteria**:
- Email and password validated against database
- JWT token issued on successful login
- Token contains user_id in `sub` claim
- Invalid credentials return 401 error
- Token stored securely in client

### US-3: Protected Route Access
**As a** logged-in user
**I want to** access protected pages and API endpoints
**So that** I can manage my tasks

**Acceptance Criteria**:
- JWT token attached to every request (Authorization header)
- Backend validates token on all protected routes
- Expired/invalid tokens result in 401 response
- User redirected to login on 401

## Functional Requirements

### FR-1: Registration Endpoint
**POST /api/v1/auth/signup**

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response (201 Created):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### FR-2: Login Endpoint
**POST /api/v1/auth/login**

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response (200 OK):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### FR-3: JWT Token Format
```json
{
  "sub": "user-uuid",
  "exp": 1735689600,
  "iat": 1735686000
}
```

- `sub`: User ID (subject)
- `exp`: Expiration timestamp (60 minutes from issue)
- `iat`: Issued at timestamp

### FR-4: Password Security
- Hash algorithm: bcrypt
- Salt rounds: 12 (minimum)
- Never log or expose passwords
- No password in JWT payload

### FR-5: Token Storage (Frontend)
- Preferred: httpOnly cookies (secure, XSS-proof)
- Alternative: Secure storage mechanism
- Never in localStorage if httpOnly available
- Auto-attach to requests via API client

## Security Requirements

### SR-1: Password Requirements
- Minimum 8 characters
- No maximum (within reasonable limit, e.g., 128 chars)
- No complexity requirements (Phase-2 simplification)

### SR-2: JWT Security
- Secret key from environment variable
- HS256 algorithm
- 60-minute expiration
- Signature validation on every protected request

### SR-3: Email Validation
- Valid email format (basic regex)
- Case-insensitive uniqueness check
- No email verification required (Phase-2 simplification)

### SR-4: CORS
- Allow configured origins only
- Allow credentials (for httpOnly cookies)
- Reject requests from unauthorized origins

## Error Handling

### Registration Errors
- 400: Invalid email format
- 400: Password too short
- 409: Email already exists
- 422: Validation error (Pydantic)

### Login Errors
- 401: Invalid credentials
- 400: Missing email or password
- 422: Validation error

### Protected Route Errors
- 401: Missing token
- 401: Invalid token signature
- 401: Expired token
- 403: Valid token but insufficient permissions (future use)

## Success Criteria

Authentication is successful when:
1. ✅ Users can register via web form
2. ✅ Duplicate emails are rejected
3. ✅ Passwords are hashed (never stored in plaintext)
4. ✅ Users can login with correct credentials
5. ✅ JWT token issued on successful auth
6. ✅ Protected routes reject requests without valid JWT
7. ✅ User context (user_id) extracted from JWT, not request body
8. ✅ Frontend automatically redirects to login on 401

## Out of Scope (Phase-2)

❌ OAuth/Social login (Google, GitHub, etc.)
❌ Email verification
❌ Password reset/forgot password
❌ Multi-factor authentication (MFA)
❌ Session management beyond JWT
❌ Remember me / persistent login
❌ Password strength meter
❌ Account lockout after failed attempts
❌ User profile management

---

**Related Specs**:
- API Endpoints: `@specs/api/rest-endpoints.md`
- Database Schema: `@specs/database/schema.md`
- Architecture: `@specs/architecture.md`
