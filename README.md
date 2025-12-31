# Hackathon Todo - Phase-2: Full-Stack Web Application

A spec-driven multi-user task management web application built with Next.js, FastAPI, and PostgreSQL.

## Project Overview

This project demonstrates **Spec-Driven Development (SDD)** using Spec-Kit Plus methodology. Every feature is specified before implementation, and all code traces to specifications.

### Current Phase: Phase-2 (Full-Stack Web)

- **Phase-1** (✅ Completed): CLI Todo App - Process validation
- **Phase-2** (🚧 Current): Full-Stack Web App - Multi-user system
- **Phase-3** (🔮 Future): AI Chatbot Integration

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Dev Server**: Port 3000

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Auth**: Better Auth with JWT
- **Dev Server**: Port 8000

### Database
- **Database**: Neon Serverless PostgreSQL
- **Migrations**: Alembic
- **Connection**: Neon cloud (no local DB needed)

## Repository Structure

```
project-root/
├── .spec-kit/              # Spec-Kit configuration
│   └── config.yaml
├── specs/                  # Specifications (READ BEFORE CODING)
│   ├── overview.md         # Project purpose and goals
│   ├── architecture.md     # System design
│   ├── features/           # Feature specifications
│   │   ├── task-crud.md
│   │   ├── authentication.md
│   │   └── chatbot.md      # Phase-3 (deferred)
│   ├── api/                # API contracts
│   │   ├── rest-endpoints.md
│   │   └── mcp-tools.md    # Phase-6 (deferred)
│   ├── database/           # Database schema
│   │   └── schema.md
│   └── ui/                 # UI specifications
│       ├── pages.md
│       └── components.md
├── frontend/               # Next.js App Router application
│   ├── CLAUDE.md           # Frontend-specific rules
│   ├── app/                # (To be created during implementation)
│   ├── components/
│   └── lib/
├── backend/                # FastAPI application
│   ├── CLAUDE.md           # Backend-specific rules
│   ├── app/                # (To be created during implementation)
│   ├── migrations/
│   └── tests/
├── .specify/               # SDD templates and scripts
│   ├── memory/
│   │   └── constitution.md # Phase-2 constitution
│   └── templates/
├── history/                # Prompt History Records (PHRs) and ADRs
│   ├── prompts/
│   └── adr/
├── docker-compose.yml      # Local development setup
├── CLAUDE.md               # Root AI agent rules
└── README.md               # This file
```

## Core Principles

### Spec-Driven Development

**Nothing is built without a specification.**

Before writing ANY code:
1. Read `.specify/memory/constitution.md` (Phase-2 rules)
2. Read relevant specs in `specs/` directory
3. Verify work traces to a Task ID
4. Never code from memory or assumptions

### Development Pipeline

```
Specify → Plan → Tasks → Implement (Backend + Frontend) → Test
```

All work MUST follow this strict pipeline. No skipping steps.

## Getting Started (Development)

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git
- Neon account (free tier: https://neon.tech)

### Setup Steps

#### 1. Clone Repository

```bash
git clone <repository-url>
cd hackathon-todo
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (when requirements.txt exists)
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your Neon DATABASE_URL and JWT_SECRET_KEY

# Run database migrations
# This creates the users table and applies all schema changes
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload --port 8000
```

Backend will run at: http://localhost:8000
API docs at: http://localhost:8000/docs

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (when package.json exists)
npm install

# Set environment variables
cp .env.local.example .env.local
# Edit .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Start dev server
npm run dev
```

Frontend will run at: http://localhost:3000

### Using Docker Compose (When Implemented)

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down
```

## Spec-Kit Workflow

### Creating a New Feature

1. **Specify**: Define requirements
   ```bash
   claude code /sp.specify "Add task filtering by completion status"
   ```

2. **Clarify**: Refine ambiguous requirements
   ```bash
   claude code /sp.clarify
   ```

3. **Plan**: Design architecture
   ```bash
   claude code /sp.plan
   ```

4. **Tasks**: Break down implementation
   ```bash
   claude code /sp.tasks
   ```

5. **Implement**: Write code (backend first, then frontend)
   - Always reference specs with `@specs/...` pattern
   - Include Task IDs in code comments

6. **Test**: Verify functionality end-to-end

### Referencing Specs

Use `@specs/...` pattern:
- `@specs/features/task-crud.md` - Task CRUD feature
- `@specs/api/rest-endpoints.md` - API endpoints
- `@specs/database/schema.md` - Database schema
- `@specs/ui/pages.md` - UI pages
- `@specs/ui/components.md` - UI components

## Phase-2 Features

### Implemented (To Be Built)
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Create, read, update, delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Multi-user data isolation
- ✅ Responsive web UI

### Out of Scope (Phase-2)
- ❌ AI chatbot (Phase-3)
- ❌ Task categories/tags
- ❌ Task search and filtering
- ❌ Email verification
- ❌ Password reset
- ❌ File attachments
- ❌ Microservices (Phase-4+)
- ❌ Kubernetes deployment (Phase-5+)

## Security Requirements

### Authentication
- JWT tokens mandatory for all protected endpoints
- Passwords hashed with bcrypt (never stored in plaintext)
- Token expiration: 60 minutes
- httpOnly cookies preferred for token storage

### Authorization
- User ID extracted from JWT (not request body)
- All database queries filtered by authenticated `user_id`
- Users CANNOT access other users' data

### Secrets
- NO secrets in code or git repository
- All sensitive values in environment variables
- `.env` files excluded from version control

## API Documentation

When backend is running, access auto-generated API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Running Tests

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Contributing

### For Human Developers
1. Read the constitution: `.specify/memory/constitution.md`
2. Read relevant specs before coding
3. Follow the development pipeline (Specify → Plan → Tasks → Implement)
4. Include Task IDs in code comments
5. Never skip specifications

### For AI Agents
- MUST read specs before coding (see `CLAUDE.md`)
- MUST validate JWT on all protected endpoints
- MUST filter queries by `user_id` for user-owned data
- MUST refuse to implement out-of-scope features
- MUST enforce the Spec-Driven pipeline

## Troubleshooting

### "Database connection failed"
- Verify `DATABASE_URL` in `.env` is correct
- Check Neon dashboard for database status
- Ensure IP is allowed in Neon firewall rules

### "JWT token invalid"
- Check `JWT_SECRET_KEY` matches between backend and any token generators
- Verify token hasn't expired (check `exp` claim)
- Ensure token format is correct: `Authorization: Bearer <token>`

### "CORS error in frontend"
- Verify `ALLOWED_ORIGINS` in backend `.env`
- Check frontend is calling correct API URL
- Ensure credentials: true in CORS config

## Documentation

- **Constitution**: `.specify/memory/constitution.md` - Phase-2 governance
- **Overview**: `specs/overview.md` - Project purpose and goals
- **Architecture**: `specs/architecture.md` - System design
- **API Endpoints**: `specs/api/rest-endpoints.md` - Complete REST API reference
- **Database Schema**: `specs/database/schema.md` - Data models
- **Frontend Rules**: `frontend/CLAUDE.md` - Next.js specific rules
- **Backend Rules**: `backend/CLAUDE.md` - FastAPI specific rules

## Commands Quick Reference

| Command | Purpose |
|---------|---------|
| `/sp.specify <description>` | Create new feature specification |
| `/sp.clarify` | Refine and clarify requirements |
| `/sp.plan` | Generate architectural plan |
| `/sp.tasks` | Break down into implementation tasks |
| `/sp.adr <title>` | Document architectural decision |
| `/sp.constitution` | Update project constitution |

## License

This is a hackathon project. No license specified.

## Support

For questions or issues:
1. Check relevant spec in `specs/` directory
2. Review constitution: `.specify/memory/constitution.md`
3. Check frontend or backend `CLAUDE.md` for layer-specific rules

---

**Remember**: This is a **Spec-Driven project**. Always read specs before coding.
