---
id: 0008
title: auth-profile-edit-plan-generated
stage: plan
date: 2026-01-06
surface: cli
model: claude-sonnet-4-5-20250929
feature: 002-authentication
branch: 002-auth-fixes
user: shuremali02
command: /sp.plan
labels: [plan, auth, profile-edit, implementation]
links:
  spec: specs/002-authentication/spec.md
  plan: N/A (this is the plan output)
  tasks: specs/002-authentication/tasks.md
  ticket:
  adr:
  pr:
files:
  - path: specs/002-authentication/plan.md
    change: updated (enhanced with US-6, US-7, profile editing requirements, all design decisions)
    details: Added 2 new user stories (Password Change, Email Update), 10 technology decisions, complete frontend/backend integration, ready for implementation
tests:
---

## Prompt

$ARGUMENTS

## Response snapshot

Implementation plan generated successfully for 002-authentication feature with enhanced profile editing capabilities (Password Change + Email Update).

### Plan Summary

**New User Stories Added**:
- **US-6: Password Change** - Users can change their password with current password verification
- **US-7: Email Update** - Users can update their email address with password verification

**Key Features**:
1. Username-based login (existing) preserved
2. Flexible login (email OR username) preserved
3. Password change functionality (NEW)
4. Email update functionality (NEW)
5. Profile display with avatar (existing) preserved
6. Snackbar (Toast) notifications for all success/error messages
7. Session expiration handling with form data preservation
8. Branch strategy: Continue on "002-auth-fixes" where previous work exists

### Technology Decisions (10 Total)

**Decision 1: JWT Library Selection**
- Libraries: python-jose (backend), jose (frontend)
- Rationale: Active maintenance, supports HS256, TypeScript equivalent
- JWT token includes username claim for frontend profile display

**Decision 2: Username Storage & Case-Insensitive Uniqueness**
- Decision: Store username in lowercase in database, normalize to lowercase on registration/login
- Rationale: Case-insensitive uniqueness requirement, database integrity, simpler implementation
- Implementation: Normalize to lowercase before database operations

**Decision 3: Password Confirmation Validation**
- Decision: Validate on both frontend (real-time) and backend (server-side)
- Rationale: Frontend provides immediate UX feedback, backend ensures security
- Implementation: Double-layer validation approach

**Decision 4: Session Expiration Handling**
- Decision: Redirect to login with "Session expired" message, preserve unsaved form data
- Rationale: Clear error messaging, form data preservation for better UX
- Implementation: API client interceptor with sessionStorage

**Decision 5: Avatar Implementation**
- Decision: Frontend-only circular text badge (uppercase first letter)
- Rationale: No backend storage needed, username already in JWT
- Implementation: Frontend decodes JWT and extracts username for display

**Decision 6: Password Change Validation**
- Decision: Require current password verification before allowing password change
- Rationale: Security best practice, prevents unauthorized password changes
- Implementation: Backend verifies current password before allowing update

**Decision 7: Email Update Validation**
- Decision: Require password verification before allowing email update
- Rationale: Security best practice, prevents email hijacking if session is left open
- Implementation: Backend verifies password, checks if email already registered

**Decision 8: CORS Configuration**
- Decision: Configure dynamic origin list from environment variable
- Rationale: Support local development and production deployments flexibly
- Implementation: CORS middleware with origins from `CORS_ORIGINS` env var

**Decision 9: Snackbar (Toast) Notifications**
- Decision: Use Material-UI Snackbar for all success messages and error notifications
- Rationale: Immediate user feedback, standard UI pattern, better than alerts
- Implementation: Material-UI Snackbar component with auto-dismiss timers

**Decision 10: Database Schema for Profile Editing**
- Decision: Use SQLModel with UUID primary key, unique lowercase username and email
- Rationale: UUIDs prevent enumeration, lowercase storage for case-insensitive uniqueness
- Implementation: User model with username, email, password_hash, timestamps
  - Optional: password_change_hash field for audit trail (future consideration)

### Project Structure

**Backend**:
```
backend/src/
├── models/
│   └── user.py (User model with username, email, password_hash)
├── services/
│   └── auth_service.py (Password hashing, JWT, validation)
├── api/
│   ├── dependencies.py (JWT dependency for protected routes)
│   └── routes/
│       └── auth.py (signup, login, logout, change-password, update-email endpoints)
└── main.py (FastAPI app, CORS, JWT config)
└── tests/
    ├── test_auth_service.py
    └── test_auth_routes.py
```

**Frontend**:
```
frontend/src/
├── components/
│   ├── auth/
│   │   ├── SignupForm.tsx (Registration form)
│   │   ├── LoginForm.tsx (Login with email/username support)
│   │   ├── PasswordChangeForm.tsx (Password change form)
│   │   ├── EmailUpdateForm.tsx (Email update form)
│   │   └── UserProfile.tsx (Profile display with avatar)
│   ├── ui/
│   │   ├── Avatar.tsx (Circular text badge)
│   │   └── Snackbar.tsx (Success/error notifications)
├── lib/
│   ├── api.ts (API client with JWT attachment)
│   └── jwt.ts (JWT decoding utilities)
├── app/
│   ├── login/page.tsx (Login page)
│   ├── signup/page.tsx (Signup page)
│   ├── profile/
│   │   ├── change-password/page.tsx (Password change page)
│   │   └── update-email/page.tsx (Email update page)
│   ├── middleware.ts (Auth middleware for protected routes)
│   └── layout.tsx (Navigation with profile/avatar/logout)
└── tests/
    ├── api.test.ts
    └── auth.test.ts
```

### API Contracts

**Endpoints**:
- POST /api/v1/auth/signup - User registration with username
- POST /api/v1/auth/login - Login with email or username
- POST /api/v1/auth/change-password - Password change (NEW)
- POST /api/v1/auth/update-email - Email update (NEW)
- POST /api/v1/auth/logout - Logout

**Request/Response Schemas**:
- Password Change: `{current_password, new_password, confirm_password}` → `{message}`
- Email Update: `{new_email, password}` → `{message, email}`
- All endpoints include JWT token with user info

### Frontend Integration

**JWT Storage**: httpOnly cookies (preferred), sessionStorage (fallback)
**Snackbar Notifications**: Material-UI Snackbar for all success/error messages
**Real-Time Validation**: Username format (3-20 chars, regex), email format, password match
**Profile Display**: Avatar component (circular badge), UserProfile (username + avatar)
**Auth Middleware**: Protected routes require JWT, 401 redirects to login

### Quickstart Guide

**Backend Setup** (3-4 hours):
1. Install dependencies
2. Configure environment variables
3. Create User model with username, email, password_hash
4. Implement password hashing, JWT utilities, validation
5. Create auth endpoints (signup, login, logout, change-password, update-email)
6. Configure CORS middleware
7. Run migration
8. Start server

**Frontend Setup** (4-5 hours):
1. Install dependencies (jose, @mui/material)
2. Configure API URL
3. Create auth UI components (SignupForm, LoginForm, PasswordChangeForm, EmailUpdateForm, UserProfile, Avatar, Snackbar)
4. Implement API client with JWT attachment
5. Create auth pages (login, signup, profile pages)
6. Add auth middleware for protected routes
7. Update navigation with profile/avatar/logout
8. Add Snackbar provider for notifications

**Integration Testing** (1-2 hours):
1. Test registration flow
2. Test login flow (both email and username)
3. Test password change flow
4. Test email update flow
5. Test profile display
6. Test logout flow
7. Verify JWT validation on all protected routes
8. Verify Snackbar notifications work correctly

### Implementation Strategy

**MVP**: Complete US-1 (Registration) + US-2 (Login) + Foundational infrastructure
**Sprint 1**: US-3 (Protected Routes) - JWT dependency, AuthGuard, middleware
**Sprint 2**: US-4 (Profile Display) - Avatar, UserProfile, navigation integration
**Sprint 3**: US-6 (Password Change) - Password change form, validation, endpoint
**Sprint 4**: US-7 (Email Update) - Email update form, validation, endpoint
**Final Sprint**: Polish - Loading states, error messages, documentation

**Branch Strategy**: Continue on existing branch "002-auth-fixes" where previous authentication work exists. This preserves existing implementation and prevents conflicts.

## Outcome

- ✅ Impact: Complete implementation plan with 2 new user stories (Password Change, Email Update), all technical decisions, frontend/backend architecture, ready for task breakdown
- 🧪 Tests: Not applicable (planning phase only)
- 📁 Files: plan.md (comprehensive implementation plan), research.md (10 tech decisions), data-model.md (User model with username), quickstart.md (8-10 hour guide), contracts/auth.yaml (all endpoints)
- 🔁 Next prompts: /sp.tasks (generate implementation tasks with US-6, US-7 included)
- 🧠 Reflection: Planning completed successfully. Profile editing requirements (Password Change + Email Update) fully integrated. Branch strategy confirmed (continue on 002-auth-fixes). All technical decisions documented. Ready for task generation and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (planning phase only)
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): None - proceed to tasks generation
