# Backend - FastAPI + SQLModel

**Task**: T001-T009
**Spec**: 002-authentication

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Auth**: JWT with python-jose, BCrypt with passlib
- **Migrations**: Alembic

## Setup

1. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Neon DATABASE_URL and JWT_SECRET_KEY
   ```

4. **Run migrations**:
   ```bash
   alembic upgrade head
   ```

5. **Start development server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Documentation

When server is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app entry point
│   ├── database.py       # SQLModel session management
│   ├── models/           # SQLModel database models
│   ├── schemas/          # Pydantic request/response schemas
│   ├── auth/             # Authentication utilities
│   └── api/              # API route handlers
├── migrations/           # Alembic migrations
├── tests/                # Pytest tests
└── requirements.txt      # Python dependencies
```

## Testing

```bash
pytest
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret key for JWT signing (32+ bytes)
- `JWT_ALGORITHM` - JWT algorithm (default: HS256)
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration (default: 60)
- `ALLOWED_ORIGINS` - CORS allowed origins (default: http://localhost:3000)

See `.env.example` for details.
