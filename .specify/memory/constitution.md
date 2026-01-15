<!--
Sync Impact Report:
Version change: [INITIAL] → 1.0.0
Modified principles: N/A (initial constitution)
Added sections:
  - Phase-2 Purpose & Scope
  - Permitted Technologies
  - Architecture Rules
  - Spec-Driven Law
  - Traceability Requirements
  - AI Agent Behavior
  - Future Phase Isolation
  - Quality Standards
  - Governance
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/spec-template.md (constitution-aligned)
  ✅ .specify/templates/plan-template.md (constitution-aligned)
  ✅ .specify/templates/tasks-template.md (constitution-aligned)
Follow-up TODOs: None
-->

# Phase-2 Full-Stack Web Application Constitution

## Preamble

This Constitution establishes the non-negotiable laws governing all development, specification, planning, and implementation activities during Phase-2 of the Agentic Engineering Hackathon. All agents, developers, and contributors MUST comply with every provision herein. This Constitution supersedes all other guidance, preferences, or conventions.

## Article I: Phase-2 Purpose & Scope

### Section 1.1 - Purpose

Phase-2 exists to build a full-stack web application with multi-user support, authentication, and rich UI interactions. The purpose is to:

- **Build Full-Stack Application**: Create a modern web application with both frontend and backend
- **Implement Authentication**: Add JWT-based authentication and user management
- **Develop Rich UI**: Create an intuitive user interface with React/Next.js
- **Establish Data Persistence**: Implement database-backed data storage with proper user isolation

Phase-2 delivers a production-ready multi-user application. Success is measured by functionality, security, and user experience.

### Section 1.2 - Scope

The deliverable for Phase-2 is a full-stack web application with:

- Frontend: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- Backend: FastAPI with JWT authentication, SQLModel ORM
- Database: PostgreSQL with user data isolation
- Authentication: Better Auth with JWT tokens
- UI: Modern React components with responsive design

## Article II: Technology Stack Requirements

### Section 2.1 - Permitted Technologies (MUST USE)

Phase-2 development MUST use these technologies:

**Frontend**:
- Next.js 14+ with App Router (NOT Pages Router)
- TypeScript 5.x with strict mode
- React 18+ with Server Components
- Tailwind CSS 3.4+ for styling
- Client-side state management as needed

**Backend**:
- Python 3.11+ with FastAPI framework
- SQLModel ORM for database operations
- Pydantic v2 for data validation
- python-jose for JWT handling
- bcrypt for password hashing

**Database**:
- PostgreSQL (Neon Serverless recommended)
- Alembic for database migrations
- Connection pooling for performance

**Authentication**:
- Better Auth for authentication management
- JWT tokens for stateless authentication
- Secure token storage (httpOnly cookies preferred)

**API**:
- REST API under `/api/v1/` prefix
- JSON request/response bodies
- Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Proper HTTP status codes

### Section 2.2 - Forbidden Technologies (MUST NOT)

The following technologies are EXPLICITLY FORBIDDEN in Phase-2:

**Legacy Tech**:
- CLI applications (Phase-1 technology)
- File-based storage (Phase-1 technology)
- Synchronous database operations (when async available)
- Plain JavaScript (TypeScript required)

**Architecture**:
- Direct database connections from frontend
- Shared secrets in client-side code
- User data without proper isolation
- Endpoints without JWT validation

**Security**:
- Storing passwords in plain text
- JWT tokens without proper validation
- Exposing sensitive data in error messages
- Skipping input validation

## Article III: Architecture Rules

### Section 3.1 - Frontend-Backend Separation

The application MUST:
- Separate frontend and backend as distinct systems
- Communicate only via documented REST API
- Frontend NEVER connect directly to database
- Allow independent deployment of frontend and backend

The application MUST NOT:
- Share code between frontend and backend (except DTOs)
- Bypass API for direct database access from frontend
- Mix frontend and backend concerns in same files

### Section 3.2 - Authentication & Authorization

All protected endpoints MUST:
- Require valid JWT token for access
- Validate JWT signature and expiration
- Extract user ID from JWT (not request body)
- Attach JWT via `Authorization: Bearer <token>`

User data MUST:
- Be isolated by authenticated `user_id`
- Filter all queries by authenticated user ID
- Prevent access to other users' data
- Default to deny access (principle of least privilege)

### Section 3.3 - API-First Architecture

All endpoints MUST:
- Be under `/api/v1/` prefix
- Use standard HTTP methods
- Return JSON request/response bodies
- Use proper HTTP status codes
- Be documented via OpenAPI

## Article IV: Spec-Driven Law

### Section 4.1 - Development Pipeline (MANDATORY)

All development MUST follow this strict pipeline:

```
Specify → Plan → Tasks → Implement → Validate
```

**No step may be skipped. No step may be reordered.**

### Section 4.2 - Specification Primacy

- **No code may be written without a Task ID**
- **No Task may exist without a Plan**
- **No Plan may exist without a Specification**
- **No Specification may contradict this Constitution**

If any of the above conditions are violated, the work is INVALID and MUST be rejected.

### Section 4.3 - Specification Authority

The Specification (spec.md) is the authoritative source of requirements. When conflict arises:

1. **Constitution** overrides all other documents
2. **Specification** overrides Plan, Tasks, and Code
3. **Plan** overrides Tasks and Code
4. **Tasks** override Code

Code that deviates from its Task is non-compliant.

### Section 4.4 - Ambiguity Prohibition

Specifications, Plans, and Tasks MUST be unambiguous. If ambiguity is detected:

- Agents MUST refuse to proceed
- Agents MUST demand clarification via explicit questions
- Agents MUST NOT infer, assume, or guess requirements

## Article V: Traceability Requirements

### Section 5.1 - Code Attribution

Every source file MUST contain:
- A header comment referencing the Task ID(s) that created/modified it
- A header comment referencing the Spec section(s) it implements

Example:
```python
# Task: T-001, T-003
# Spec: 3.1 Todo Creation, 3.2 Todo Listing
```

### Section 5.2 - Function Attribution

Every function or class MUST have:
- A docstring or comment indicating its Task ID
- A brief reference to the requirement it satisfies

Example:
```python
def add_todo(title: str, description: str) -> dict:
    """Add a new todo item.

    Task: T-001
    Spec: 3.1 Todo Creation - Users can create todos with title and description
    """
```

### Section 5.3 - Traceability Validation

Before any code is merged or committed:
- All Task IDs MUST be verified to exist in tasks.md
- All Spec references MUST be verified to exist in spec.md
- No orphaned code (code without Task ID) is permitted

## Article VI: AI Agent Behavior

### Section 6.1 - Refusal to Proceed

AI agents MUST refuse to execute any request that:
- Lacks a valid Specification
- Lacks a valid Plan
- Lacks a valid Task ID
- Violates any article of this Constitution

Refusal MUST be explicit and cite the violated article.

### Section 6.2 - Clarification Over Assumption

When faced with unclear, ambiguous, or incomplete requirements, agents MUST:
- Stop work immediately
- Formulate 2-5 targeted clarifying questions
- Wait for explicit user input
- Document the clarification in the appropriate artifact (Spec, Plan, or Task)

Agents MUST NOT:
- Guess at user intent
- Infer requirements from context alone
- Implement "reasonable defaults" without approval
- Proceed with placeholder or stub implementations

### Section 6.3 - Invention Prohibition

Agents MUST NOT invent:
- New requirements not present in the Spec
- New features not present in the Plan
- New tasks not present in tasks.md
- New architectural patterns not approved in the Plan

All additions, changes, or enhancements MUST flow through the Specify → Plan → Tasks pipeline.

### Section 6.4 - Pipeline Enforcement

Agents MUST enforce the SDD pipeline:
- Detect when a user attempts to skip steps (e.g., "just code this for me")
- Redirect the user to the proper pipeline entry point
- Refuse to execute out-of-order work
- Document the refusal and provide guidance

## Article VII: Future Phase Isolation

### Section 7.1 - Deferred Technologies

The following technologies and patterns are DEFERRED to future phases:

- **Phase-3+**: AI chatbot integration, conversational UI
- **Phase-4+**: Microservices, service mesh, Dapr
- **Phase-5+**: Kafka, event streaming, message brokers
- **Phase-6+**: Kubernetes, container orchestration, cloud deployment
- **Phase-7+**: MCP (Model Context Protocol) integrations, agent-to-agent communication
- **Phase-8+**: Distributed systems, multi-region deployments, production hardening

### Section 7.2 - Scope Rejection

Any request to implement technologies or patterns from future phases MUST be rejected with:
- Clear citation of this Article (VII)
- Explanation that Phase-2 is focused on full-stack web application
- Guidance that the feature belongs to a later phase

Agents MUST NOT implement "simple versions" or "prototypes" of future-phase technologies.

## Article VIII: Quality Standards

### Section 8.1 - Code Quality
- Follow existing code patterns and conventions
- Maintain TypeScript strict mode compliance
- Ensure proper component prop typing
- Add appropriate error boundaries

### Section 8.2 - User Experience
- Consistent with existing application design
- Accessible to users with disabilities (WCAG 2.1 AA)
- Responsive across different devices
- Fast loading and interaction times (<200ms page load)

### Section 8.3 - Performance
- Optimize data fetching and component rendering
- Efficient API calls with proper caching
- Minimize bundle sizes
- Lazy-load non-critical components

### Section 8.4 - Testing
- API endpoints: integration tests
- Critical logic: unit tests
- Auth flows: security tests
- All tests traceable to Task IDs

## Article IX: Governance

### Section 9.1 - Constitutional Supremacy

This Constitution is the supreme governing document for Phase-2. In the event of conflict:

- Constitution > Spec > Plan > Tasks > Code
- Constitution > User preferences or requests
- Constitution > Agent suggestions or "best practices"

### Section 9.2 - Amendment Process

Amendments to this Constitution require:
1. Written proposal documenting the change and rationale
2. Explicit user approval
3. Version increment following semantic versioning:
   - MAJOR: Incompatible governance changes or principle removals
   - MINOR: New principles or sections added
   - PATCH: Clarifications, typo fixes, wording improvements
4. Sync Impact Report documenting affected templates and artifacts

### Section 9.3 - Compliance Review

All work MUST pass constitutional compliance review:
- Agents MUST self-audit against this Constitution before submitting work
- Users MUST verify compliance before approving work
- Non-compliant work MUST be rejected and corrected

### Section 9.4 - Enforcement

Violations of this Constitution are unacceptable. Enforcement actions:
- Code that violates the Constitution MUST be rejected
- Specs that violate the Constitution MUST be rewritten
- Agents that repeatedly violate the Constitution MUST be corrected or replaced

### Section 9.5 - Versioning Policy

This Constitution follows semantic versioning:
- MAJOR version: Backward-incompatible governance changes
- MINOR version: New principles or materially expanded guidance
- PATCH version: Clarifications, wording fixes, non-semantic refinements

All versions MUST be tracked with ratification and amendment dates.

---

**Version**: 1.0.0
**Ratified**: 2026-01-14
**Last Amended**: 2026-01-14

---

## Appendix A: Quick Reference

**Permitted**: Next.js, TypeScript, React, Tailwind, FastAPI, SQLModel, PostgreSQL, JWT, Better Auth, REST API
**Forbidden**: CLI apps, file-based storage, direct DB access from frontend, unauthenticated endpoints

**Pipeline**: Specify → Plan → Tasks → Implement (Backend) → Implement (Frontend) → Test & Iterate (MANDATORY, NO EXCEPTIONS)

**Traceability**: Every file and function MUST reference Task ID and Spec section

**Security**: JWT validation on all protected endpoints, user data isolation by user_id

**Agent Behavior**: Refuse to proceed without Spec. Clarify, never guess. Never invent requirements.

---

*This Constitution is binding on all agents, developers, and contributors during Phase-2. Compliance is mandatory.*
