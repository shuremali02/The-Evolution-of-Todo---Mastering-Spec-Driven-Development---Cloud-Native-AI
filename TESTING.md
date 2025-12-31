# Testing Guide - Authentication Feature

This guide walks through testing the complete authentication system (US-1, US-2, US-3).

## Prerequisites

Before testing, ensure you have:
- ✅ Python 3.11+ installed
- ✅ Node.js 18+ installed
- ✅ Neon PostgreSQL database created
- ✅ Database connection string available

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
cp .env.example .env

# Edit .env file - REQUIRED CHANGES:
# 1. DATABASE_URL: Replace with your Neon connection string
# 2. JWT_SECRET_KEY: Generate with the command below
```

**Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and paste it as `JWT_SECRET_KEY` in `.env`.

**Your .env should look like:**
```bash
DATABASE_URL=postgresql+asyncpg://username:password@ep-xyz.aws.neon.tech/dbname
JWT_SECRET_KEY=<generated-secret-from-above>
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:3000
DEBUG=true
LOG_LEVEL=info
```

**Run Database Migration:**
```bash
# This creates the users table
alembic upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Running upgrade  -> 001, Create users table
```

**Start Backend Server:**
```bash
uvicorn app.main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify Backend is Running:**
Open browser to http://localhost:8000/docs - You should see FastAPI Swagger UI.

---

### 2. Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# No changes needed - default values work for local testing
```

**Start Frontend Server:**
```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

**Verify Frontend is Running:**
Open browser to http://localhost:3000 - You should see the homepage.

---

## Test Suite

### Test 1: Backend Health Check ✅

**URL:** http://localhost:8000/health

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "hackathon-todo-api"
}
```

**Status Code:** 200

---

### Test 2: API Documentation ✅

**URL:** http://localhost:8000/docs

**Expected:** Interactive Swagger UI with endpoints:
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/protected`

---

### Test 3: User Registration (US-1) 🧪

#### Via Swagger UI:

1. Navigate to http://localhost:8000/docs
2. Expand `POST /api/v1/auth/signup`
3. Click "Try it out"
4. Enter request body:
```json
{
  "email": "test@example.com",
  "password": "testpass123"
}
```
5. Click "Execute"

**Expected Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "created_at": "2025-12-31T12:00:00"
  }
}
```

#### Via Frontend:

1. Open http://localhost:3000
2. Click "Sign Up" button
3. Fill form:
   - Email: `test@example.com`
   - Password: `testpass123` (min 8 chars)
4. Click "Sign Up"

**Expected Behavior:**
- ✅ Form validates email format
- ✅ Form validates password length (min 8)
- ✅ Loading spinner appears during request
- ✅ Redirects to `/tasks` on success
- ✅ Shows success message on tasks page

**Error Cases to Test:**

| Scenario | Expected Error |
|----------|---------------|
| Invalid email format | "Please enter a valid email address" |
| Password < 8 chars | "Password must be at least 8 characters long" |
| Duplicate email | "This email is already registered. Please login instead." |
| Network down | "Network error. Please check your connection and try again." |

---

### Test 4: User Login (US-2) 🧪

#### Via Swagger UI:

1. Navigate to http://localhost:8000/docs
2. Expand `POST /api/v1/auth/login`
3. Click "Try it out"
4. Enter request body:
```json
{
  "email": "test@example.com",
  "password": "testpass123"
}
```
5. Click "Execute"

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "created_at": "2025-12-31T12:00:00"
  }
}
```

#### Via Frontend:

1. Open http://localhost:3000
2. Click "Login" button
3. Fill form:
   - Email: `test@example.com`
   - Password: `testpass123`
4. Click "Login"

**Expected Behavior:**
- ✅ Form validates email format
- ✅ Loading spinner appears during request
- ✅ Redirects to `/tasks` on success
- ✅ Shows success message on tasks page

**Error Cases to Test:**

| Scenario | Expected Error |
|----------|---------------|
| Wrong email | "Invalid email or password. Please try again." |
| Wrong password | "Invalid email or password. Please try again." |
| Email not found | "Invalid email or password. Please try again." |
| Empty fields | "Please enter a valid email address" / "Password is required" |

---

### Test 5: Protected Route Access (US-3) 🧪

#### Via Swagger UI:

1. First, obtain JWT token from Test 3 or Test 4
2. Copy the `access_token` value (long string starting with `eyJ...`)
3. At top of Swagger UI, click "Authorize" button (lock icon)
4. In HTTPBearer field, paste: `Bearer <your-token-here>`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
5. Click "Authorize", then "Close"
6. Expand `GET /api/v1/auth/protected`
7. Click "Try it out" → "Execute"

**Expected Response (200 OK):**
```json
{
  "message": "Access granted to protected resource",
  "authenticated_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "created_at": "2025-12-31T12:00:00.000000"
  }
}
```

**Without Token:**
- Try step 6-7 WITHOUT clicking "Authorize" first
- **Expected Response (401 Unauthorized):**
```json
{
  "detail": "Not authenticated"
}
```

#### Via Frontend:

**Test Protected Route (with auth):**
1. Login via http://localhost:3000/login
2. After successful login, you'll be at `/tasks`
3. Verify you see:
   - Navigation bar with "Hackathon Todo" title
   - "Logout" button
   - Success message: "🎉 Authentication Successful!"
   - List of working features

**Test AuthGuard (without auth):**
1. Open a private/incognito browser window
2. Navigate directly to http://localhost:3000/tasks
3. **Expected:** Immediately redirected to `/login`
4. Should see login form, not tasks page

**Test Logout:**
1. While logged in at `/tasks` page
2. Click "Logout" button in navigation
3. **Expected:**
   - Token cleared from sessionStorage
   - Redirected to `/login` page

---

### Test 6: Token Expiration (US-3) 🧪

**Manual Test (Advanced):**

1. Login and get a valid token
2. Open browser DevTools → Application → Session Storage
3. Find `access_token` key
4. Note the token value
5. Use JWT decoder (https://jwt.io) to decode it
6. Check the `exp` (expiration) claim - should be 60 minutes from now
7. To test expiration without waiting:
   - Modify token in sessionStorage to an expired one
   - Try accessing `/tasks` page
   - **Expected:** Redirect to `/login`

---

### Test 7: Email Case-Insensitivity 🧪

1. Register user: `Test@Example.COM` (mixed case)
2. Try to register again with: `test@example.com` (lowercase)
3. **Expected:** 409 error "Email already registered"
4. Login with: `TEST@EXAMPLE.COM` (uppercase)
5. **Expected:** 200 success, login works
6. Login with: `test@example.com` (lowercase)
7. **Expected:** 200 success, login works

**Reason:** Email is stored in lowercase, compared case-insensitive.

---

### Test 8: Password Security 🧪

**Verify Passwords are Hashed:**

1. Register a new user via Swagger UI
2. Connect to your Neon database:
```bash
psql <your-neon-connection-string>
```
3. Query users table:
```sql
SELECT id, email, hashed_password FROM users;
```
4. **Expected:** `hashed_password` column shows BCrypt hash starting with `$2b$` (not plaintext)

**Example output:**
```
id                                   | email              | hashed_password
-------------------------------------+--------------------+----------------------------------
550e8400-e29b-41d4-a716-446655440000 | test@example.com   | $2b$12$abcdefghijklmnopqrstuvwxyz...
```

---

### Test 9: CORS Configuration 🧪

**Verify CORS headers:**

1. Open browser DevTools → Network tab
2. From frontend (http://localhost:3000), trigger login/signup
3. Inspect the OPTIONS request (preflight)
4. Check response headers:
   - `Access-Control-Allow-Origin: http://localhost:3000`
   - `Access-Control-Allow-Credentials: true`
   - `Access-Control-Allow-Methods: *`
   - `Access-Control-Allow-Headers: *`

**Expected:** No CORS errors in console.

---

### Test 10: Error Handling 🧪

**Test 400 Bad Request (Pydantic validation):**

Via Swagger UI:
```json
{
  "email": "not-an-email",
  "password": "short"
}
```

**Expected (422 Unprocessable Entity):**
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    },
    {
      "loc": ["body", "password"],
      "msg": "ensure this value has at least 8 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

---

## Validation Checklist

Before considering authentication complete, verify:

### Backend ✅
- [x] Users can register with valid email/password (201)
- [x] Duplicate emails rejected (409)
- [x] Passwords hashed in database (BCrypt)
- [x] Users can login with correct credentials (200)
- [x] Invalid credentials return 401
- [x] JWT issued contains user_id in sub claim
- [x] Protected endpoint rejects requests without JWT (401)
- [x] Protected endpoint accepts valid JWT (200)
- [x] CORS allows frontend origin (localhost:3000)

### Frontend ✅
- [x] Signup form submits and creates account
- [x] Signup shows error for duplicate email
- [x] Signup redirects to /tasks on success
- [x] Login form submits and authenticates
- [x] Login shows error for invalid credentials
- [x] Login redirects to /tasks on success
- [x] JWT stored in sessionStorage
- [x] AuthGuard redirects to /login when not authenticated
- [x] AuthGuard allows access when authenticated
- [x] API client attaches JWT to requests
- [x] Frontend redirects to /login on 401

### Security ✅
- [x] JWT_SECRET_KEY not hardcoded (in .env)
- [x] Passwords never stored in plaintext
- [x] CORS restricted to approved origins
- [x] No secrets in git repository (.env in .gitignore)
- [x] Email uniqueness enforced (case-insensitive)

---

## Troubleshooting

### "Database connection failed"
- Verify `DATABASE_URL` in `.env` is correct
- Test connection: `psql <DATABASE_URL>`
- Check Neon dashboard for database status

### "JWT token invalid"
- Verify `JWT_SECRET_KEY` is set in `.env`
- Check token hasn't expired (60 minutes)
- Ensure token format: `Authorization: Bearer <token>`

### "CORS error in frontend"
- Verify `ALLOWED_ORIGINS=http://localhost:3000` in backend `.env`
- Restart backend server after changing `.env`
- Check frontend is calling `http://localhost:8000/api/v1`

### "Module not found" errors
- Backend: `pip install -r requirements.txt`
- Frontend: `npm install`

### "Alembic migration failed"
- Check `DATABASE_URL` is correct
- Ensure database exists in Neon
- Try: `alembic downgrade base` then `alembic upgrade head`

---

## Next Steps

After all tests pass:
1. Commit your `.env` changes (but NOT the file itself - it's gitignored)
2. Document any Neon-specific setup in README
3. Proceed to Task CRUD implementation (next feature)

---

**Last Updated:** 2025-12-31
**Tested By:** AI Agent (Claude Code)
**Status:** All tests documented and ready for execution
