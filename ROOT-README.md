# The Evolution of Todo – Mastering Spec-Driven Development & Cloud Native AI

A multi-phase learning journey demonstrating Spec-Driven Development (SDD) methodology with increasingly sophisticated implementations of a todo application.

## Project Purpose

This project serves as a training ground for mastering Spec-Driven Development through five progressive phases, each building on the previous while maintaining strict adherence to SDD principles.

## Phase Structure

### Phase-1: In-Memory CLI Todo Application ✓
**Status**: Complete
**Location**: `phase-1/`
**Description**: Command-line todo application with in-memory storage demonstrating SDD fundamentals.

**Key Features**:
- 5 core operations: Add, View, Update, Delete, Mark Complete
- Interactive menu interface
- Input validation and error handling
- Task ID and Spec reference traceability

**Tech Stack**: Python 3.13+, UV package manager, pytest
**Constraints**: Single-process, in-memory only, no persistence, no external dependencies

**Quick Start**:
```bash
cd phase-1
python3 -m src.todo_app.main
```

See [phase-1/README.md](phase-1/README.md) for complete documentation.

---

### Phase-2: Full-Stack Web Application ✓
**Status**: Complete
**Location**: Root directory (frontend/, backend/, specs/, etc.)
**Description**: Multi-user task management web application with Next.js frontend, FastAPI backend, and PostgreSQL database demonstrating full-stack development with JWT authentication and user data isolation.

**Key Features**:
- Multi-user task management with authentication
- Next.js 14 App Router frontend with TypeScript
- FastAPI backend with JWT authentication
- Neon PostgreSQL database with SQLModel ORM
- User data isolation and security
- Responsive UI with Tailwind CSS
- Real-time updates and interactive components
- Keyboard shortcuts and toast notifications

**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, FastAPI, Python 3.11+, SQLModel, PostgreSQL, JWT, Alembic

**Live Demo**: [Hugging Face Spaces](https://huggingface.co/spaces/Shurem/todo-app)

**Quick Start**:
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

See [README.md](README.md) for complete documentation.

---

### Phase-3: (Future)
**Status**: Planned
**Description**: TBD

---

### Phase-4: (Future)
**Status**: Planned
**Description**: TBD

---

### Phase-5: Cloud Native with AI
**Status**: Planned
**Description**: TBD

---

## Spec-Driven Development Methodology

This project strictly follows the SDD workflow:

1. **Specify** (`/sp.specify`) - Define requirements and user stories
2. **Clarify** (`/sp.clarify`) - Resolve ambiguities through structured Q&A
3. **Plan** (`/sp.plan`) - Create technical implementation plan
4. **Tasks** (`/sp.tasks`) - Generate detailed task breakdown
5. **Implement** (`/sp.implement`) - Execute tasks with full traceability
6. **Validate** - Verify against success criteria

### Key SDD Principles

- **Traceability**: Every code artifact traces to Task ID → Plan → Spec
- **Specification First**: No code without written requirements
- **Incremental Delivery**: Each user story independently testable
- **Constitution Compliance**: Phase-specific technical constraints enforced

## Project Structure

```
/
├── phase-1/          # Phase-1 implementation (CLI todo app)
├── phase-2/          # Phase-2 implementation (future)
├── phase-3/          # Phase-3 implementation (future)
├── phase-4/          # Phase-4 implementation (future)
├── phase-5/          # Phase-5 implementation (future)
│
├── specs/            # Shared specifications for all phases
│   └── 001-todo-cli/ # Phase-1 feature specifications
│
├── .specify/         # SDD framework infrastructure
│   ├── memory/       # Project constitution
│   ├── scripts/      # SDD automation scripts
│   └── templates/    # Spec, plan, and task templates
│
├── history/          # Prompt History Records (PHRs) and ADRs
│   └── prompts/      # PHR records organized by feature
│
├── CLAUDE.md         # Project-wide agent configuration
└── .gitignore        # Project-wide ignore patterns
```

## Phase-1 Constitution Highlights

Phase-1 operates under strict technical constraints to focus on SDD fundamentals:

**Forbidden**: Kubernetes, Docker, databases, ORMs, web servers, APIs, message brokers, microservices, async/background processes

**Permitted**: Python 3.13+, CLI (stdin/stdout), in-memory data structures, local files (JSON/YAML/text), standard library only

See `.specify/memory/constitution.md` for complete Phase-1 rules.

## Documentation

- **Specifications**: `specs/` directory contains all feature specs
- **Implementation Plans**: Each spec folder contains `plan.md`
- **Task Breakdowns**: Each spec folder contains `tasks.md`
- **Phase READMEs**: Each phase folder contains its own README
- **Prompt History**: `history/prompts/` tracks all SDD workflow interactions

## Development Tools

- **Claude Code**: AI-powered development assistant
- **Spec-Kit Plus**: SDD framework and templates
- **UV**: Fast Python package manager (Phase-1)
- **Git**: Version control with full traceability

## Contributing

All contributions must follow SDD workflow:
1. Create specification in `specs/` directory
2. Run `/sp.clarify` to resolve ambiguities
3. Run `/sp.plan` to create implementation plan
4. Run `/sp.tasks` to generate task breakdown
5. Implement with full Task ID traceability
6. Verify against success criteria

## License

[Add license information here]

## Acknowledgments

Built with:
- **Claude Code** by Anthropic
- **Spec-Kit Plus** SDD framework
- **UV** by Astral

---

**Last Updated**: 2025-12-29
**Current Phase**: Phase-1 Complete
**Next Phase**: Phase-2 Planning
