# Backend Setup Instructions

**Task**: T005
**Spec**: 002-authentication/quickstart.md

## Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update these values:

   **DATABASE_URL**: Get from your Neon PostgreSQL dashboard
   - Format: `postgresql+asyncpg://user:password@host.neon.tech/dbname`

   **JWT_SECRET_KEY**: Use this generated secure key:
   ```
   eT24ICiF2ZelKrcOy33XPkJqBy5TKp4QnIAU72fxKM8
   ```

   **Or generate a new one**:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. Verify your `.env` file contains all required variables:
   - DATABASE_URL
   - JWT_SECRET_KEY
   - JWT_ALGORITHM (should be HS256)
   - JWT_ACCESS_TOKEN_EXPIRE_MINUTES (should be 60)
   - ALLOWED_ORIGINS (should be http://localhost:3000)

## Installation

1. Create virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Database Setup

1. Run migrations:
   ```bash
   alembic upgrade head
   ```

## Running the Server

```bash
uvicorn app.main:app --reload --port 8000
```

Server will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Verification

Test the server is running:
```bash
curl http://localhost:8000/docs
```

You should see the FastAPI Swagger UI.
