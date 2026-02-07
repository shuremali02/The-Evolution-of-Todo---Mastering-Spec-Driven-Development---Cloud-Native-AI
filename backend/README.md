---
title: Todo App Backend
emoji: 🚀
colorFrom: blue
colorTo: green
sdk: docker
sdk_version: "20.10.0"
app_file: app/main.py
pinned: false
---

# Todo App - Backend with FastAPI + SQLModel

**Task**: T001-T009
**Spec**: 002-authentication

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Auth**: JWT with python-jose, BCrypt with passlib
- **Migrations**: Alembic
- **Package Manager**: uv (for fast dependency installation)

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

## Deployment with Docker

This application can be deployed using Docker. The Dockerfile uses the **uv package manager** for fast dependency installation.

### Prerequisites

- Docker installed on your system
- Docker Compose (optional)

### Building the Docker Image

```bash
# Build the Docker image
docker build -t todo-app .

# Run the container
docker run -p 8000:8000 todo-app
```

### Using Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  todo-app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENV=production
      - DATABASE_URL=your_database_url
      - JWT_SECRET_KEY=your_jwt_secret
```

Then run:

```bash
docker-compose up
```

## About uv Package Manager

This project uses [uv](https://github.com/astral-sh/uv) as the package manager, which is a fast Python package installer and resolver.
uv is used in the Dockerfile for significantly faster dependency installation compared to pip.

Key benefits of uv:
- Up to 100x faster than pip install
- Built with Rust for performance
- Drop-in replacement for pip
- Efficient dependency resolution
