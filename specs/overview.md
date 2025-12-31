# Project Overview - Hackathon Todo (Phase-2)

## Project Purpose

This project is a multi-user task management web application built as part of the Agentic Engineering Hackathon. It demonstrates **Spec-Driven Development (SDD)** using Spec-Kit Plus methodology, where all development follows a strict `Specify → Plan → Tasks → Implement` pipeline.

### Learning Objectives

1. **Validate SDD Methodology**: Prove that specification-first development with AI agents produces maintainable, traceable code
2. **Build Multi-User Web Application**: Create a production-ready full-stack application with proper authentication and data isolation
3. **Demonstrate Full-Stack Integration**: Show seamless frontend-backend separation with REST API architecture
4. **Prepare for AI Enhancement**: Establish foundation for Phase-3 chatbot integration

## Phase-2 Goals

Phase-2 transitions from the CLI-based todo application (Phase-1) to a **full-stack web application** with:

✅ **Multi-user support** via JWT authentication
✅ **Web-based UI** built with Next.js App Router
✅ **RESTful API** using FastAPI
✅ **Persistent storage** in Neon PostgreSQL
✅ **Data isolation** ensuring users only access their own tasks
✅ **Modern tech stack** aligned with industry best practices

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: React Server Components + client state

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **API Style**: REST with JSON
- **Auth**: Better Auth with JWT tokens

### Database
- **Database**: Neon Serverless PostgreSQL
- **Migrations**: Alembic
- **Connection**: Neon serverless driver with pooling

### Infrastructure (Development)
- **Local Development**: Docker Compose
- **Frontend Dev Server**: Next.js dev server (port 3000)
- **Backend Dev Server**: Uvicorn (port 8000)
- **Database**: Neon cloud (no local PostgreSQL needed)

## Core Features

### 1. Authentication (`@specs/features/authentication.md`)

**User Registration**:
- Email + password signup
- Password hashing with bcrypt
- Automatic user creation in database

**User Login**:
- Email + password authentication
- JWT token issuance on success
- Token expiration and refresh logic

**Session Management**:
- JWT stored securely (httpOnly cookies preferred)
- Token validation on every protected request
- Automatic logout on token expiry

### 2. Task CRUD (`@specs/features/task-crud.md`)

**Create Tasks**:
- Users can create tasks with title and description
- Tasks automatically associated with authenticated user

**Read Tasks**:
- List all tasks for authenticated user
- View individual task details
- Filter tasks by completion status

**Update Tasks**:
- Edit task title and description
- Mark tasks as complete/incomplete
- All updates scoped to user's own tasks

**Delete Tasks**:
- Remove tasks permanently
- Users can only delete their own tasks

### 3. Task Filtering & Search

**Filter Options**:
- All tasks
- Active tasks (not completed)
- Completed tasks

**Search Functionality**:
- Search by task title
- Search by description content

### 4. User Data Isolation (Security Requirement)

**Enforcement**:
- Every API query filters by authenticated `user_id`
- Users CANNOT see or modify other users' tasks
- JWT validation mandatory on all protected endpoints
- Default deny: resources without ownership are inaccessible

## Architecture Principles

### 1. Frontend-Backend Separation

- Frontend and backend are **separate systems**
- Communication exclusively via REST API
- Frontend NEVER accesses database directly
- Independent deployment capability

### 2. API-First Design

- All backend functionality exposed via REST endpoints
- Versioned API routes (`/api/v1/`)
- OpenAPI documentation auto-generated
- Consistent error handling and status codes

### 3. Security by Default

- JWT validation on all protected routes
- User context extracted from token (not request)
- Input validation via Pydantic schemas
- SQL injection prevention via ORM
- CORS configured for approved origins only

### 4. Spec-Driven Development

- Nothing built without a specification
- All code traces to Task IDs and Spec sections
- AI agents enforce specification compliance
- Changes flow through: Spec → Plan → Tasks → Code

## Out of Scope (Phase-2)

The following are explicitly **deferred to future phases**:

❌ **Phase-3+**: AI chatbot, conversational UI, LLM integration
❌ **Phase-4+**: Microservices, event-driven architecture, message queues
❌ **Phase-5+**: Kubernetes, cloud deployment, container orchestration
❌ **Phase-6+**: MCP integrations, agent-to-agent communication

**Important**: Any request to implement these features during Phase-2 MUST be rejected with reference to the constitution.

## Success Criteria

Phase-2 is considered successful when:

1. ✅ Users can register and login via web UI
2. ✅ Authenticated users can create, read, update, delete their tasks
3. ✅ Users CANNOT access other users' data
4. ✅ All API endpoints have JWT validation
5. ✅ Frontend communicates with backend exclusively via REST API
6. ✅ All code traces to specifications via Task IDs
7. ✅ System runs locally via Docker Compose
8. ✅ Database schema matches `@specs/database/schema.md`
9. ✅ API contracts match `@specs/api/rest-endpoints.md`
10. ✅ UI matches `@specs/ui/pages.md` and `@specs/ui/components.md`

## Development Workflow

### For Developers/AI Agents

1. **Specification Phase**: Use `/sp.specify` to create feature specs
2. **Planning Phase**: Use `/sp.plan` to design architecture
3. **Task Breakdown**: Use `/sp.tasks` to create implementation tasks
4. **Backend Implementation**: Build API endpoints with JWT validation
5. **Frontend Implementation**: Build UI components consuming the API
6. **Testing**: Verify end-to-end functionality
7. **Documentation**: Update specs and create ADRs for significant decisions

### Before Writing Code

**ALWAYS** read relevant specs:
- Constitution: `.specify/memory/constitution.md`
- Feature spec: `specs/features/<feature-name>.md`
- API spec: `specs/api/rest-endpoints.md`
- Database spec: `specs/database/schema.md`
- UI spec: `specs/ui/pages.md`, `specs/ui/components.md`

## Repository Structure

```
project-root/
├── .spec-kit/              # Spec-Kit configuration
├── specs/                  # Specifications (this file is here)
│   ├── overview.md         # You are here
│   ├── architecture.md
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
├── frontend/               # Next.js application
├── backend/                # FastAPI application
├── .specify/               # SDD templates and scripts
├── history/                # PHRs and ADRs
├── docker-compose.yml      # Local development setup
└── README.md               # Getting started guide
```

## Related Documentation

- **Architecture**: `@specs/architecture.md` - System design and component interactions
- **API Endpoints**: `@specs/api/rest-endpoints.md` - Complete REST API reference
- **Database Schema**: `@specs/database/schema.md` - Data models and relationships
- **Authentication**: `@specs/features/authentication.md` - Auth flow details
- **Task CRUD**: `@specs/features/task-crud.md` - Task management feature spec
- **UI Pages**: `@specs/ui/pages.md` - Page specifications
- **UI Components**: `@specs/ui/components.md` - Component specifications

## Getting Help

- **Unclear spec?**: Use `/sp.clarify` to refine requirements
- **Architecture decision?**: Document with `/sp.adr <title>`
- **Need planning?**: Use `/sp.plan` for design work
- **Ready to implement?**: Use `/sp.tasks` to break down work

---

**Next Steps**: Read `@specs/architecture.md` to understand system design.
