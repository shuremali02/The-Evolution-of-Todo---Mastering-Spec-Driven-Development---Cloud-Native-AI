# Implementation Tasks: Authentication

**Feature**: 002-authentication
**Branch**: `002-authentication`
**Date**: 2025-12-31
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Overview

This task breakdown implements JWT-based authentication for the Phase-2 full-stack web application. Tasks are organized by user story to enable independent implementation and testing.

**Total Estimated Time**: 6-8 hours (per quickstart.md)

## User Stories (from spec.md)

- **US-1** (P1): User Registration - New users create accounts with email/password
- **US-2** (P1): User Login - Existing users authenticate with credentials
- **US-3** (P1): Protected Route Access - Authenticated users access protected resources

## Implementation Strategy

**MVP Scope**: US-1 + US-2 (Registration and Login)
- Delivers core authentication capability
- Enables user account creation and access
- Foundation for all protected features

**Incremental Delivery**:
1. Complete US-1 + US-2 (backend + frontend auth flows)
2. Add US-3 (protected routes and AuthGuard)
3. Polish and cross-cutting concerns

## Dependencies Between Stories

```
US-1 (Registration)
  ↓
US-2 (Login) - Depends on User model from US-1
  ↓
US-3 (Protected Routes) - Depends on JWT validation from US-2
```

**Note**: US-1 and US-2 backend components can be developed in parallel after Setup and Foundational phases.

---

## Phase 1: Setup & Project Initialization

**Goal**: Establish project structure, dependencies, and environment configuration

**Tasks**:

- [X] T001 Install backend dependencies in backend/requirements.txt (fastapi, sqlmodel, python-jose, passlib, asyncpg, alembic)
- [X] T002 Install frontend dependencies in frontend/package.json (next, react, js-cookie, types)
- [X] T003 Create backend/.env with DATABASE_URL, JWT_SECRET_KEY, JWT_ALGORITHM, ALLOWED_ORIGINS
- [X] T004 Create frontend/.env.local with NEXT_PUBLIC_API_URL
- [X] T005 Generate secure JWT_SECRET_KEY using python secrets module (32 bytes)
- [X] T006 Create backend/app/main.py FastAPI application with CORS middleware
- [X] T007 Create backend/app/database.py with SQLModel async session management
- [X] T008 Initialize Alembic in backend/migrations/ directory
- [X] T009 Configure Alembic env.py to use DATABASE_URL and SQLModel metadata
- [X] T010 Create frontend/app/layout.tsx root layout with metadata
- [X] T011 Create frontend/lib directory for shared utilities
- [X] T012 Create frontend/types directory for TypeScript definitions
- [X] T013 Create frontend/components directory for React components

**Prerequisites**: Neon PostgreSQL database created, connection string available

**Validation**:
- [ ] Backend server starts without errors: `uvicorn app.main:app --reload`
- [ ] Frontend dev server starts: `npm run dev`
- [ ] Environment variables loaded correctly
- [ ] Database connection successful

---

## Phase 2: Foundational Components (Blocking Prerequisites)

**Goal**: Build shared utilities and infrastructure needed by all user stories

**Tasks**:

### Backend Utilities

- [X] T014 [P] Create backend/app/auth/password.py with hash_password() and verify_password() using passlib bcrypt
- [X] T015 [P] Create backend/app/auth/jwt.py with create_access_token() and decode_jwt() using python-jose
- [X] T016 [P] Create backend/app/auth/dependencies.py with get_current_user_id() dependency using HTTPBearer
- [X] T017 Create backend/app/models/__init__.py to export all models
- [X] T018 Create backend/app/schemas/__init__.py to export all schemas
- [X] T019 Create backend/app/api/__init__.py for API router organization

### Frontend Utilities

- [X] T020 [P] Create frontend/lib/api.ts API client class with request(), signup(), login(), logout() methods
- [X] T021 [P] Create frontend/types/auth.ts with User, AuthResponse, SignupRequest, LoginRequest interfaces

**Prerequisites**: Phase 1 complete

**Validation**:
- [ ] Password hashing works: `hash_password("test123")` returns bcrypt hash
- [ ] JWT creation works: `create_access_token("user-id")` returns valid token
- [ ] API client instantiates without errors

---

## Phase 3: User Story 1 - User Registration

**Story Goal**: New users can create accounts with email and password, receive JWT token, and are automatically logged in.

**Independent Test Criteria**:
- [ ] POST /api/v1/auth/signup with valid credentials returns 201 and JWT
- [ ] Duplicate email returns 409 error
- [ ] Password is hashed in database (never plaintext)
- [ ] Frontend signup form submits and redirects to /tasks on success
- [ ] Frontend displays error message for duplicate email

### Backend Tasks

- [ ] T022 [US1] Create backend/app/models/user.py User SQLModel with id, email, hashed_password, created_at, updated_at fields
- [ ] T023 [US1] Create Alembic migration 001_create_users.py for users table with unique email index
- [ ] T024 [US1] Run migration: `alembic upgrade head` to create users table in database
- [ ] T025 [US1] Create backend/app/schemas/auth.py with UserCreate (email: EmailStr, password: str) request schema
- [ ] T026 [US1] Add UserResponse (id, email, created_at) and AuthResponse (access_token, token_type, user) to schemas/auth.py
- [ ] T027 [US1] Create backend/app/api/auth.py router with POST /api/v1/auth/signup endpoint
- [ ] T028 [US1] Implement signup endpoint: check email uniqueness (case-insensitive), hash password, create user, generate JWT
- [ ] T029 [US1] Register auth router in backend/app/main.py with app.include_router()
- [ ] T030 [US1] Test signup endpoint manually with curl or Postman: valid signup, duplicate email (409), invalid email (400)

### Frontend Tasks

- [ ] T031 [P] [US1] Create frontend/app/signup/page.tsx with email and password form fields
- [ ] T032 [US1] Implement form submission: call apiClient.signup(), store JWT, redirect to /tasks on success
- [ ] T033 [US1] Add client-side validation: email format, password minimum 8 characters
- [ ] T034 [US1] Display error message on failure (409 duplicate, 400 invalid, network errors)
- [ ] T035 [US1] Add "Already have an account? Login" link to /login page
- [ ] T036 [US1] Test signup flow: valid registration, duplicate email error, validation errors

**Story Dependencies**: None (first story)

**Parallel Execution**:
- After T029: Frontend tasks T031-T036 can run in parallel with backend testing T030

---

## Phase 4: User Story 2 - User Login

**Story Goal**: Existing users authenticate with email and password, receive JWT token for session management.

**Independent Test Criteria**:
- [ ] POST /api/v1/auth/login with valid credentials returns 200 and JWT
- [ ] Invalid credentials return 401 error
- [ ] JWT token contains correct user_id in sub claim
- [ ] Frontend login form submits and redirects to /tasks on success
- [ ] Frontend displays error message for invalid credentials

### Backend Tasks

- [ ] T037 [US2] Add UserLogin (email: EmailStr, password: str) schema to backend/app/schemas/auth.py
- [ ] T038 [US2] Create POST /api/v1/auth/login endpoint in backend/app/api/auth.py
- [ ] T039 [US2] Implement login endpoint: find user by email (case-insensitive), verify password, generate JWT
- [ ] T040 [US2] Return 401 for invalid email or wrong password (don't reveal which)
- [ ] T041 [US2] Test login endpoint: valid credentials, invalid email, wrong password, case-insensitive email

### Frontend Tasks

- [ ] T042 [P] [US2] Create frontend/app/login/page.tsx with email and password form fields
- [ ] T043 [US2] Implement form submission: call apiClient.login(), store JWT, redirect to /tasks on success
- [ ] T044 [US2] Add client-side validation: email format, required fields
- [ ] T045 [US2] Display error message on 401 (invalid credentials) or network errors
- [ ] T046 [US2] Add "Don't have an account? Sign up" link to /signup page
- [ ] T047 [US2] Test login flow: valid login, invalid credentials error, network errors

**Story Dependencies**: Depends on US-1 (User model and database table must exist)

**Parallel Execution**:
- After T041: Frontend tasks T042-T047 can run in parallel with backend testing

---

## Phase 5: User Story 3 - Protected Route Access

**Story Goal**: Authenticated users can access protected pages and API endpoints; unauthenticated users are redirected to login.

**Independent Test Criteria**:
- [ ] Protected endpoint rejects requests without JWT (401)
- [ ] Protected endpoint accepts requests with valid JWT
- [ ] Expired/invalid JWT returns 401
- [ ] Frontend AuthGuard redirects to /login when no token
- [ ] Frontend AuthGuard allows access when valid token present
- [ ] Frontend clears token and redirects on 401 from API

### Backend Tasks

- [ ] T048 [US3] Create test protected endpoint GET /api/v1/protected in backend/app/api/auth.py using get_current_user_id dependency
- [ ] T049 [US3] Test protected endpoint: no token (401), invalid token (401), valid token (200), expired token (401)
- [ ] T050 [US3] Verify get_current_user_id() extracts correct user_id from JWT sub claim

### Frontend Tasks

- [ ] T051 [P] [US3] Create frontend/components/AuthGuard.tsx component with token check in useEffect
- [ ] T052 [US3] Implement AuthGuard: redirect to /login if no token, render children if token exists
- [ ] T053 [US3] Add loading state to AuthGuard while checking authentication
- [ ] T054 [US3] Create frontend/app/tasks/layout.tsx wrapping children with AuthGuard component
- [ ] T055 [US3] Create placeholder frontend/app/tasks/page.tsx showing "Tasks (Coming Soon)"
- [ ] T056 [US3] Update API client to redirect to /login on 401 response and clear stored token
- [ ] T057 [US3] Test AuthGuard: access /tasks without login (redirect), login then access /tasks (allowed)
- [ ] T058 [US3] Test 401 handling: manually expire token, attempt API call, verify redirect to login

**Story Dependencies**: Depends on US-2 (JWT issuance must work)

**Parallel Execution**:
- After T050: All frontend tasks T051-T058 can run in parallel

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Improve UX, add error handling, finalize production readiness

**Tasks**:

### Error Handling & UX

- [ ] T059 [P] Add loading states to login and signup forms (disable button, show spinner)
- [ ] T060 [P] Add success feedback after registration (toast or message before redirect)
- [ ] T061 [P] Improve error messages: map 409 → "Email already registered", 401 → "Invalid credentials"
- [ ] T062 [P] Add password visibility toggle (show/hide) to login and signup forms
- [ ] T063 [P] Add "Remember me" checkbox to login form (optional: extends token expiration)

### Security Hardening

- [ ] T064 [P] Add rate limiting to auth endpoints (optional: use slowapi or similar)
- [ ] T065 [P] Add request logging to backend (log endpoint, status, user_id if authenticated)
- [ ] T066 [P] Verify CORS configuration allows only intended origins
- [ ] T067 [P] Add CSP headers to frontend for XSS protection (optional for Phase-2)

### Documentation

- [ ] T068 [P] Add JSDoc comments to frontend API client methods
- [ ] T069 [P] Add docstrings to backend auth utility functions
- [ ] T070 [P] Create backend/.env.example with placeholder values and comments
- [ ] T071 [P] Create frontend/.env.local.example with placeholder values
- [ ] T072 [P] Update README.md with authentication setup instructions

### Testing (Optional - not required for Phase-2)

- [ ] T073 [P] Create backend/tests/test_auth.py with pytest tests for signup and login endpoints
- [ ] T074 [P] Add test for password hashing and verification
- [ ] T075 [P] Add test for JWT creation and validation
- [ ] T076 [P] Add test for case-insensitive email handling
- [ ] T077 [P] Create frontend tests for login and signup forms using React Testing Library (optional)

**Prerequisites**: Phases 3, 4, 5 complete

**Parallel Execution**: All tasks in this phase can run in parallel (marked with [P])

---

## Task Summary

**Total Tasks**: 77

**Task Count by User Story**:
- Setup (Phase 1): 13 tasks
- Foundational (Phase 2): 8 tasks
- US-1 Registration (Phase 3): 15 tasks (9 backend, 6 frontend)
- US-2 Login (Phase 4): 11 tasks (5 backend, 6 frontend)
- US-3 Protected Routes (Phase 5): 11 tasks (3 backend, 8 frontend)
- Polish (Phase 6): 19 tasks (16 optional)

**Parallelization Opportunities**:
- Phase 2: 4 tasks can run in parallel (T014-T016, T020-T021)
- Phase 3: Frontend tasks (T031-T036) parallel after T029
- Phase 4: Frontend tasks (T042-T047) parallel after T041
- Phase 5: Frontend tasks (T051-T058) parallel after T050
- Phase 6: All 19 tasks can run in parallel

**Critical Path** (Serial Dependencies):
1. Setup (Phase 1) → 2. Foundational (Phase 2) → 3. US-1 Backend → 4. US-2 Backend → 5. US-3 Backend → 6. Integration Testing

**Suggested MVP** (Minimum Viable Product):
- Phase 1: Setup (all tasks)
- Phase 2: Foundational (all tasks)
- Phase 3: US-1 Registration (all tasks)
- Phase 4: US-2 Login (all tasks)
- **Skip Phase 5 and 6 for fastest MVP** (can add later)

**Time Estimates**:
- Setup + Foundational: 1-2 hours
- US-1 (Registration): 2-2.5 hours
- US-2 (Login): 1.5-2 hours
- US-3 (Protected Routes): 1-1.5 hours
- Polish: 1-2 hours (optional)
- **Total: 6-8 hours** (matches quickstart.md estimate)

---

## Validation Checklist

Before considering authentication feature complete:

### Backend Validation
- [ ] Users can register with valid email/password (201 response)
- [ ] Duplicate emails are rejected (409 response)
- [ ] Passwords are hashed in database (query users table, verify bcrypt hash)
- [ ] Users can login with correct credentials (200 response)
- [ ] Invalid credentials return 401
- [ ] JWT token issued contains user_id in sub claim (decode token)
- [ ] Protected endpoint rejects requests without JWT (401)
- [ ] Protected endpoint accepts requests with valid JWT (200)
- [ ] CORS allows frontend origin (localhost:3000)

### Frontend Validation
- [ ] Signup form submits and creates account
- [ ] Signup form shows error for duplicate email
- [ ] Signup redirects to /tasks on success
- [ ] Login form submits and authenticates user
- [ ] Login form shows error for invalid credentials
- [ ] Login redirects to /tasks on success
- [ ] JWT token stored in sessionStorage or cookie
- [ ] AuthGuard redirects to /login when not authenticated
- [ ] AuthGuard allows access to /tasks when authenticated
- [ ] API client automatically attaches JWT to requests
- [ ] Frontend redirects to /login on 401 from backend

### Security Validation
- [ ] JWT_SECRET_KEY not hardcoded (in .env only)
- [ ] Passwords never stored in plaintext
- [ ] CORS restricted to approved origins
- [ ] No secrets in git repository (.env in .gitignore)
- [ ] Email uniqueness enforced (case-insensitive)

---

## Implementation Notes

### Task Execution Order

1. **Complete Phase 1 (Setup) first** - Required for all subsequent work
2. **Complete Phase 2 (Foundational) second** - Provides utilities needed by all stories
3. **Implement US-1 and US-2 sequentially** - US-2 depends on User model from US-1
4. **Implement US-3 after US-1 and US-2** - Depends on JWT issuance
5. **Polish tasks can be done anytime after MVP** - Not blocking

### Parallelization Strategy

Within each phase after Foundational:
- **Backend tasks complete first** (creates API for frontend to consume)
- **Frontend tasks start after backend endpoints ready** (can test against real API)
- **Independent components** (marked [P]) can be developed in parallel

### Testing Strategy

Tests are **optional** for Phase-2 (specified in research.md as "acceptable to defer").

If implementing tests:
- Unit tests first (password hashing, JWT)
- Integration tests second (API endpoints)
- Frontend tests last (forms, AuthGuard)

### File Path Reference

All file paths mentioned in tasks follow the structure defined in plan.md:

```
backend/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models/user.py
│   ├── schemas/auth.py
│   ├── auth/
│   │   ├── password.py
│   │   ├── jwt.py
│   │   └── dependencies.py
│   └── api/auth.py
├── migrations/versions/001_create_users.py
└── tests/test_auth.py

frontend/
├── app/
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── tasks/
│       ├── layout.tsx
│       └── page.tsx
├── components/AuthGuard.tsx
├── lib/api.ts
└── types/auth.ts
```

---

**Tasks generated**: 2025-12-31
**Ready for implementation**: Yes
**Next command**: Select a task and begin implementation (e.g., `T001`)
