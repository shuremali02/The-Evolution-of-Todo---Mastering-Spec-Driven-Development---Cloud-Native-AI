# Claude Code Rules - Phase-2: Full-Stack Web Application

This is the **root CLAUDE.md** for the Hackathon Todo monorepo during Phase-2 development.

## Project Context

This is a **Spec-Kit Plus monorepo** implementing a multi-user task management web application using Spec-Driven Development (SDD). We are transitioning from Phase-1 (CLI) to Phase-2 (Full-Stack Web).

### What is Spec-Kit Plus?

Spec-Kit Plus is a specification-first development methodology where:
- **Nothing is built without a spec**
- All code traces to specifications
- Frontend, backend, and database work follow the same process: `Specify → Plan → Tasks → Implement`

### Phase Roadmap

- **Phase-1** (COMPLETED): CLI Todo App - Process validation
- **Phase-2** (CURRENT): Full-Stack Web App - Multi-user web system
- **Phase-3** (FUTURE): AI Chatbot Integration

## Monorepo Structure

```
project-root/
├── .spec-kit/              # Spec-Kit configuration
│   └── config.yaml         # Project phases and structure
├── specs/                  # ALL specifications live here
│   ├── overview.md         # Project overview
│   ├── architecture.md     # System architecture
│   ├── features/           # Feature specifications
│   │   ├── task-crud.md
│   │   ├── authentication.md
│   │   └── chatbot.md
│   ├── api/                # API specifications
│   │   ├── rest-endpoints.md
│   │   └── mcp-tools.md
│   ├── database/           # Database specifications
│   │   └── schema.md
│   └── ui/                 # UI specifications
│       ├── pages.md
│       └── components.md
├── frontend/               # Next.js App Router application
│   └── CLAUDE.md           # Frontend-specific rules
├── backend/                # FastAPI application
│   └── CLAUDE.md           # Backend-specific rules
├── .specify/               # SDD templates and scripts
│   ├── memory/
│   │   └── constitution.md # Phase-2 constitution
│   └── templates/
└── history/                # PHR and ADR records
    ├── prompts/
    └── adr/
```

## Technology Stack (Phase-2)

### Frontend
- **Framework**: Next.js 14+ (App Router, NOT Pages Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State**: React Server Components + client state as needed

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **API Style**: REST with JSON
- **Auth**: Better Auth with JWT tokens
- **Validation**: Pydantic models
- **ORM**: SQLModel

### Database
- **Database**: Neon Serverless PostgreSQL
- **Connection**: Neon serverless driver with pooling
- **Migrations**: Alembic

### Authentication
- **Library**: Better Auth
- **Token Type**: JWT (JSON Web Tokens)
- **Storage**: Secure client-side (httpOnly cookies preferred)

## Spec-Driven Workflow

### CRITICAL: Always Read Specs Before Coding

Before writing ANY code, Claude MUST:

1. **Read the Constitution**: `.specify/memory/constitution.md`
2. **Read the Feature Spec**: `specs/features/<feature-name>.md`
3. **Read Architecture Docs**: `specs/architecture.md`, `specs/api/`, `specs/database/`
4. **Read UI Specs**: `specs/ui/pages.md`, `specs/ui/components.md` (for frontend work)

**NEVER write code from memory or assumptions alone.**

### Development Pipeline

```
Specify → Plan → Tasks → Implement (Backend) → Implement (Frontend) → Test & Iterate
```

All work MUST follow this pipeline:

1. **Specify**: Create/update specs in `specs/`
2. **Plan**: Define architecture and technical approach
3. **Tasks**: Break down into testable implementation tasks
4. **Implement Backend**: Build API endpoints with JWT validation
5. **Implement Frontend**: Build UI components that consume the API
6. **Test**: Verify end-to-end functionality

### Referencing Specs

Use the `@specs/...` pattern to reference specifications:

- `@specs/features/task-crud.md` - Task CRUD feature spec
- `@specs/api/rest-endpoints.md` - API endpoint definitions
- `@specs/database/schema.md` - Database schema
- `@specs/ui/components.md` - UI component specifications

## Core Requirements

### 1. Frontend-Backend Separation

- Frontend and backend are **separate systems**
- All communication via **documented REST API**
- Frontend NEVER connects directly to database
- Can be deployed independently

### 2. JWT Authentication (MANDATORY)

- **All protected endpoints** require valid JWT
- Backend validates JWT signature and expiration on **every request**
- User ID extracted from JWT, NOT from request body
- Frontend attaches JWT to every API call via `Authorization: Bearer <token>`

### 3. Multi-User Data Isolation

- Every database query MUST filter by authenticated `user_id`
- Users CANNOT access other users' tasks
- Authorization checks on every protected endpoint
- Default deny: resources without explicit ownership are inaccessible

### 4. API-First Architecture

- All endpoints under `/api/v1/`
- Standard HTTP methods: GET, POST, PUT, PATCH, DELETE
- JSON request/response bodies
- Proper HTTP status codes
- OpenAPI auto-documentation via FastAPI

## Folder-Specific Rules

### `/frontend/` - Next.js Frontend

See `frontend/CLAUDE.md` for detailed rules. Key requirements:

- Use App Router (NOT Pages Router)
- TypeScript strict mode
- No inline styles (use Tailwind)
- API calls through `/lib/api.ts`
- JWT attached to every request
- Follow `@specs/ui/*` specifications

### `/backend/` - FastAPI Backend

See `backend/CLAUDE.md` for detailed rules. Key requirements:

- All routes under `/api/v1/`
- JWT verification middleware on protected routes
- Use `DATABASE_URL` environment variable
- Enforce `user_id` isolation on all queries
- Follow `@specs/api/*` and `@specs/database/*` specifications

### `/specs/` - Specifications (Read-Only for Implementation)

During implementation, specs are **authoritative and read-only**. To change requirements:

1. Update the spec first
2. Update plan if architectural changes needed
3. Update tasks to reflect new requirements
4. Then implement

## Security Mandates

### Authentication Security
- JWT secrets in environment variables (NEVER in code)
- Passwords hashed with bcrypt
- Reasonable token expiration times
- Refresh token rotation

### Authorization Security
- Validate JWT before processing requests
- Extract user ID from JWT (not request body)
- Filter all user data queries by authenticated user ID
- Separate admin authorization if needed

### API Security
- Validate all input via Pydantic schemas
- Use parameterized SQL statements (SQLModel handles this)
- Configure CORS for approved origins only
- Rate limiting on auth endpoints

### Data Security
- No sensitive data in logs
- Database credentials in environment variables
- Use SSL/TLS for database connections
- No secrets in git repository

## Development Practices

### Traceability

Every file MUST include attribution comments:

**Frontend (TypeScript)**:
```typescript
/**
 * Task: T-XXX
 * Spec: X.X Feature Name
 */
```

**Backend (Python)**:
```python
# Task: T-XXX
# Spec: X.X Feature Name
```

### Testing

- API endpoints: integration tests
- Critical logic: unit tests
- Auth flows: security tests
- All tests traceable to Task IDs

### Documentation

- API: OpenAPI docs (auto-generated by FastAPI)
- Database: Documented migrations
- Environment: `.env.example` with all required variables
- Setup: Instructions in README.md

## AI Agent Behavior (Phase-2)

### Mandatory Behaviors

1. **Read Specs First**: Before any implementation, read relevant specs
2. **Refuse Without Spec**: Reject coding requests without valid spec reference
3. **Clarify, Don't Guess**: Ask 2-5 targeted questions when unclear
4. **No Invention**: Never create features not in the spec
5. **Enforce Pipeline**: Redirect users who try to skip steps

### Refusal Triggers

Agents MUST refuse to:
- Write code without reading the spec
- Implement features not in the specification
- Skip the Specify → Plan → Tasks pipeline
- Violate constitution requirements
- Create Phase-3 features (chatbot) during Phase-2

### Clarification Process

When requirements are unclear:
1. Stop work immediately
2. Formulate 2-5 specific questions
3. Wait for explicit user input
4. Document clarifications in the spec
5. Resume work with confirmed requirements

## Constitution Reference

The complete Phase-2 constitution is at `.specify/memory/constitution.md`.

**Key Articles**:
- Article II: Technology Stack Requirements
- Article III: Architecture Rules (separation, API-first, isolation, JWT)
- Article IV: Spec-Driven Law (pipeline, reading mandate)
- Article V: Traceability Requirements
- Article VI: AI Agent Behavior
- Article VII: Security Requirements

**Constitutional Supremacy**: Constitution > Spec > Plan > Tasks > Code

## Common Commands

### Spec Management
- `/sp.specify <description>` - Create new feature specification
- `/sp.clarify` - Clarify and refine specification
- `/sp.plan` - Create architectural plan
- `/sp.tasks` - Generate implementation tasks

### Implementation
- Work in `frontend/` following `frontend/CLAUDE.md`
- Work in `backend/` following `backend/CLAUDE.md`
- Reference specs with `@specs/...` pattern
- Always include Task IDs in code comments

### Quality
- Run frontend tests: `cd frontend && npm test`
- Run backend tests: `cd backend && pytest`
- Validate JWT flows end-to-end
- Verify user data isolation

## Phase-2 Scope

### In Scope
✅ Multi-user task management web app
✅ JWT-based authentication
✅ REST API with FastAPI
✅ Next.js frontend with App Router
✅ Neon PostgreSQL database
✅ User data isolation
✅ Create, read, update, delete tasks
✅ Task filtering and search

### Out of Scope (Deferred to Phase-3+)
❌ AI chatbot integration
❌ Conversational UI
❌ LLM APIs
❌ MCP integrations (Phase-6+)
❌ Microservices architecture (Phase-4+)
❌ Kubernetes/containers (Phase-5+)

## Getting Started

1. **Read the Constitution**: `.specify/memory/constitution.md`
2. **Review Specs**: Start with `specs/overview.md` and `specs/architecture.md`
3. **Check Configuration**: `.spec-kit/config.yaml` defines phases
4. **Frontend Setup**: See `frontend/CLAUDE.md` for Next.js rules
5. **Backend Setup**: See `backend/CLAUDE.md` for FastAPI rules
6. **Follow Pipeline**: Specify → Plan → Tasks → Implement

## Questions?

- **Spec unclear?** Use `/sp.clarify` to refine requirements
- **Architecture decision?** Suggest ADR: `/sp.adr <title>`
- **Need planning?** Use `/sp.plan` for architectural design
- **Ready to implement?** Use `/sp.tasks` to break down work

---

**Remember**: This is a **Spec-Driven project**. Nothing is built without a spec. Always read before coding.

## Active Technologies
- TypeScript 5.x (Next.js 14+ requirement) + Next.js 14+, React 18+, Tailwind CSS 3.4+ (005-task-management-ui)
- API-backed (backend PostgreSQL database via REST API) (005-task-management-ui)
- Python 3.11+ (backend), TypeScript 5.x (frontend) + FastAPI, SQLModel, bcrypt, Pydantic, python-jose (backend); Next.js 14+, React 18+, Tailwind CSS, jose (frontend) (002-auth-fixes)

## Recent Changes
- 005-task-management-ui: Added TypeScript 5.x (Next.js 14+ requirement) + Next.js 14+, React 18+, Tailwind CSS 3.4+
