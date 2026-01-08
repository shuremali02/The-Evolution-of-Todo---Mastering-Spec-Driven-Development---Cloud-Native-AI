# Feature Specification: Authentication

## Overview

User registration and login using email/password with JWT token-based authentication. Users can create accounts with username, email, and password, log in using either email or username, and see their profile with avatar on authenticated pages.

## Clarifications

### Session 2026-01-06

- Q: Should the username feature be a separate spec or extension of current spec? → A: Extend current 002-authentication spec to include username field in User entity, registration/login, and profile display
- Q: Where should form validation happen (username format, password match, etc.)? → A: Real-time validation on both frontend (immediate feedback) and backend (server-side validation)
- Q: How should frontend handle session expiration (401 error)? → A: Redirect to login with "Session expired" message, preserve unsaved form data
- Q: How should frontend get username for profile display? → A: Frontend decodes JWT client-side to get username/display name
- Q: Profile editing scope (password + email update)? → A: Password change + email update functionality (username update excluded for Phase-2)
- Q: Which branch to use for implementation? → A: Continue on existing branch "002-auth-fixes" where previous work was done
- Q: Is application live/production? → A: Not live yet - development environment only, no multi-user deployment yet
- Q: How should success and error messages be displayed to user? → A: Use Snackbar (Toast) for all success messages and error notifications (registration, login, password change, email update, session expired)

## User Stories

### US-1: User Registration
**As a** new user
**I want to** create an account with username, email, and password
**So that** I can use the todo application with personalized identity

**Acceptance Criteria**:
- Username must be unique (case-insensitive, 3-20 chars, alphanumeric/underscore/hyphen only)
- Email must be unique (no duplicates)
- Password must be at least 8 characters
- Password confirmation must match password field (validated real-time on frontend and backend)
- Frontend provides immediate validation feedback as user types
- Backend validates all inputs on form submission
- Password is hashed before storage (never stored in plaintext)
- JWT token issued immediately after successful registration
- User automatically logged in after registration

### US-2: User Login
**As an** existing user
**I want to** log in with my email or username and password
**So that** I can access my tasks

**Acceptance Criteria**:
- Login accepts either email OR username (system detects which one)
- Email and password validated against database
- Username and password validated against database
- JWT token issued on successful login
- Token contains user_id in `sub` claim
- Invalid credentials return 401 error (generic message: "Invalid email/username or password")
- Token stored securely in client

### US-3: Protected Route Access
**As a** logged-in user
**I want to** access protected pages and API endpoints
**So that** I can manage my tasks

**Acceptance Criteria**:
- JWT token attached to every request (Authorization header)
- Backend validates token on all protected routes
- Expired/invalid tokens result in 401 response
- User redirected to login on 401 with "Session expired" message
- Frontend preserves unsaved form data when redirecting

### US-4: User Profile Display
**As a** logged-in user
**I want to** see my username and avatar in the navigation
**So that** I know I'm logged in and see my identity

**Acceptance Criteria**:
- Username displayed in top navigation on all authenticated pages
- Avatar shows first letter of username (capitalized)
- Avatar positioned before logout button in navigation
- Avatar is a circular text badge (uppercase letter)
- If username starts with number/special character, display that character

### US-5: User Logout
**As a** logged-in user
**I want to** log out securely
**So that** I can end my session on shared devices

**Acceptance Criteria**:
- Logout button in navigation (after profile/avatar)
- Clicking logout clears JWT token from storage
- User redirected to login page
- Subsequent API requests fail (no valid token)
- Attempt to access protected routes redirects to login

### US-6: Password Change
**As a** logged-in user
**I want to** change my password
**So that** I can keep my account secure

**Acceptance Criteria**:
- Password change form requires current password (for security)
- New password must be at least 8 characters
- New password must be confirmed (match confirmation field)
- Backend verifies current password before allowing change
- New password is hashed before storage
- User remains logged in after successful password change
- Success message displayed after password change (Snackbar/Toast notification)
- Error shown if current password is incorrect (Snackbar/Toast notification)

### US-7: Email Update
**As a** logged-in user
**I want to** update my email address
**So that** I can keep my contact information current

**Acceptance Criteria**:
- Email update form requires password for security
- New email must be valid email format
- New email must be unique (not already registered)
- Backend validates password before allowing email update
- User email is updated in database
- Success message displayed after email update (Snackbar/Toast notification)
- Username remains unchanged (used for login identity)
- Error shown if password is incorrect or email already exists (Snackbar/Toast notification)

## Functional Requirements

### FR-1: Registration Endpoint
**POST /api/v1/auth/signup**

Request:
```json
{
  "username": "john_doe",
  "email": "user@example.com",
  "password": "securepassword",
  "confirm_password": "securepassword"
}
```

Response (201 Created):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "user@example.com"
  }
}
```

### FR-2: Login Endpoint
**POST /api/v1/auth/login**

Request (email login):
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Request (username login):
```json
{
  "username": "john_doe",
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
    "username": "john_doe",
    "email": "user@example.com"
  }
}
```

### FR-3: JWT Token Format
```json
{
  "sub": "user-uuid",
  "username": "john_doe",
  "exp": 1735689600,
  "iat": 1735686000
}
```

- `sub`: User ID (subject)
- `username`: Username for profile display (frontend decodes this)
- `exp`: Expiration timestamp (60 minutes from issue)
- `iat`: Issued at timestamp

### FR-4: Password Security
- Hash algorithm: bcrypt
- Salt rounds: 12 (minimum)
- Never log or expose passwords
- No password in JWT payload

### FR-5: Username Validation
- Length: 3-20 characters
- Allowed characters: letters (a-z, A-Z), numbers (0-9), underscores (_), hyphens (-)
- Case-insensitive uniqueness (user1 and User1 are duplicates)
- No spaces or special characters beyond _ and -
- First character must be letter or number (not special character)

### FR-6: Password Change Endpoint
**POST /api/v1/auth/change-password**

Request:
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

Response (200 OK):
```json
{
  "message": "Password changed successfully"
}
```

Error Responses:
- 401: Current password is incorrect
- 400: New password too short (minimum 8 characters)
- 400: Passwords do not match
- 422: Validation error

### FR-7: Email Update Endpoint
**POST /api/v1/auth/update-email**

Request:
```json
{
  "new_email": "newemail@example.com",
  "password": "currentpassword"
}
```

Response (200 OK):
```json
{
  "message": "Email updated successfully",
  "email": "newemail@example.com"
}
```

Error Responses:
- 401: Current password is incorrect
- 400: Invalid email format
- 409: Email already registered to another account
- 422: Validation error

### FR-8: Logout Endpoint
**POST /api/v1/auth/logout**

Response (200 OK):
```json
{
  "message": "Logged out successfully"
}
```
Note: Frontend clears token; backend may implement server-side token blacklist in future phases.

### FR-9: Token Storage (Frontend)
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

### SR-4: Username Validation
- Valid format: 3-20 chars, alphanumeric/_/- only
- Case-insensitive uniqueness check (stored lowercase)
- No spaces or special characters beyond _ and -
- First character must be letter or number

### SR-5: CORS
- Reject requests from unauthorized origins

## Error Handling

### Registration Errors
- 400: Invalid email format
- 400: Password too short
- 400: Invalid username format
- 400: Passwords do not match
- 409: Email already exists
- 409: Username already exists
- 422: Validation error (Pydantic)

### Login Errors
- 401: Invalid credentials
- 400: Missing email or password
- 422: Validation error

### Password Change Errors
- 401: Current password is incorrect
- 400: New password too short (minimum 8 characters)
- 400: New passwords do not match
- 422: Validation error (Pydantic)

### Email Update Errors
- 401: Current password is incorrect
- 400: Invalid email format
- 409: New email already registered to another account
- 422: Validation error (Pydantic)

### Protected Route Errors
- 401: Missing token
- 401: Invalid token signature
- 401: Expired token
- 403: Valid token but insufficient permissions (future use)

## Success Criteria

Authentication is successful when:
1. ✅ Users can register via web form with username, email, password
2. ✅ Password confirmation validates on frontend and backend
3. ✅ Duplicate usernames (case-insensitive) and emails are rejected
4. ✅ Passwords are hashed (never stored in plaintext)
5. ✅ Users can login with either email or username
6. ✅ JWT token issued on successful auth
7. ✅ Protected routes reject requests without valid JWT
8. ✅ User context (user_id, username) extracted from JWT, not request body
9. ✅ Frontend displays username and avatar on all authenticated pages
10. ✅ Frontend automatically redirects to login on 401
11. ✅ Logout clears token and redirects to login
12. ✅ Users can change password with current password verification
13. ✅ Users can update email with password verification
14. ✅ Password change displays success/error messages appropriately

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
