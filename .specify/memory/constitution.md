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

This Constitution establishes the non-negotiable laws governing all development, specification, planning, and implementation activities during Phase-4 of the Agentic Engineering Hackathon. All agents, developers, and contributors MUST comply with every provision herein. This Constitution supersedes all other guidance, preferences, or conventions.

## Article I: Phase-4 Purpose & Scope

### Section 1.1 - Purpose

Phase-4 exists to deploy the Todo Chatbot application on a local Kubernetes cluster using containerization, orchestration, and AI-assisted DevOps practices. The purpose is to:

- **Containerize Applications**: Package frontend and backend as Docker containers using AI assistance
- **Orchestrate with Kubernetes**: Deploy on Minikube for local Kubernetes cluster management
- **Automate with AI DevOps**: Use kubectl-ai and Kagent for intelligent Kubernetes operations
- **Package with Helm**: Create and manage deployment configurations using Helm charts
- **Enable AI-Assisted Operations**: Leverage Docker AI Agent (Gordon) for intelligent container operations

Phase-4 delivers a containerized, orchestrated cloud-native deployment of the Todo Chatbot application. Success is measured by successful deployment, scalability, and operational efficiency using AI-assisted DevOps tools.

### Section 1.2 - Scope

The deliverable for Phase-4 is a local Kubernetes deployment of the Todo Chatbot application with:

- Containerization: Docker containers for frontend and backend using Docker AI Agent (Gordon)
- Orchestration: Kubernetes cluster deployed on Minikube
- Packaging: Helm charts for application deployment
- AI DevOps: kubectl-ai and Kagent for intelligent Kubernetes operations
- Infrastructure as Code: Declarative deployment configurations

## Article II: Technology Stack Requirements

### Section 2.1 - Permitted Technologies (MUST USE)

Phase-4 development MUST use these technologies:

**Containerization**:
- Docker Desktop for container management
- Docker AI Agent (Gordon) for intelligent Docker operations
- Containerized frontend and backend applications

**Orchestration**:
- Kubernetes (Minikube) for local cluster management
- Helm Charts for deployment packaging
- kubectl-ai for AI-assisted Kubernetes operations
- Kagent for intelligent cluster management

**Application Stack** (Maintained from Previous Phases):
- Frontend: Next.js 14+ with App Router, TypeScript 5.x, React 18+, Tailwind CSS
- Backend: Python 3.11+ with FastAPI, SQLModel ORM, Pydantic v2
- Database: PostgreSQL with Neon Serverless
- Authentication: Better Auth with JWT tokens
- API: REST API under `/api/v1/` prefix

**AI DevOps Tools**:
- Docker AI Agent (Gordon) for intelligent Docker operations
- kubectl-ai for AI-assisted Kubernetes commands
- Kagent for cluster analysis and optimization

### Section 2.2 - Forbidden Technologies (MUST NOT)

The following technologies are EXPLICITLY FORBIDDEN in Phase-4:

**Legacy Tech**:
- Manual Docker operations (use Docker AI Agent Gordon instead)
- Manual Kubernetes operations (use kubectl-ai and Kagent instead)
- Manual Helm chart creation (use AI assistance instead)
- Direct cluster access without proper tooling
- Hardcoded configurations in deployment files

**Architecture**:
- Non-containerized deployments (must use Docker containers)
- Direct database connections from frontend
- Shared secrets in client-side code
- User data without proper isolation
- Endpoints without JWT validation

**Security**:
- Storing passwords in plain text
- JWT tokens without proper validation
- Exposing sensitive data in error messages
- Skipping input validation
- Unsecured container images
- Insecure cluster configurations

## Article III: Architecture Rules

### Section 3.1 - Containerized Deployment Architecture

The application MUST:
- Be packaged as Docker containers for both frontend and backend
- Deploy to Kubernetes cluster using Helm charts
- Maintain separation between frontend and backend services
- Use environment variables for configuration management
- Implement proper health checks and readiness probes

The application MUST NOT:
- Use host networking (use Kubernetes service discovery)
- Hardcode configuration values in container images
- Bypass Kubernetes service mesh capabilities

### Section 3.2 - Container Orchestration Principles

Deployment MUST:
- Use Kubernetes manifests managed by Helm charts
- Implement proper resource limits and requests
- Use ConfigMaps and Secrets for configuration and sensitive data
- Implement proper service discovery between frontend and backend
- Include proper logging and monitoring configurations

### Section 3.3 - Authentication & Authorization (Maintained from Previous Phases)

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

### Section 3.4 - API-First Architecture (Maintained from Previous Phases)

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

- **Phase-5+**: Kafka, event streaming, message brokers
- **Phase-6+**: Advanced agent-to-agent communication beyond MCP
- **Phase-7+**: Distributed systems, multi-region deployments, production hardening
- **Phase-8+**: Advanced monitoring, observability, and alerting systems

### Section 7.2 - Phase 3 Technologies (NOW COMPLETED)

Phase 3 (AI Chatbot Integration) is now complete with:
- **AI Chatbot Integration**: OpenAI Agents SDK, conversational UI
- **MCP (Model Context Protocol)**: Official MCP SDK, MCP tools
- **OpenAI ChatKit**: Frontend chat interface
- **AI-Powered Task Management**: Natural language processing for todo operations
- **Stateless Conversation Architecture**: Database-persisted conversation state
- **MCP Server Architecture**: Official MCP SDK with exposed task operation tools

### Section 7.3 - Phase 4 Technologies (NOW PERMITTED)

With the completion of Phase 3, the following technologies and patterns are NOW PERMITTED for Phase 4:

- **Containerization**: Docker, Docker Desktop, Docker AI Agent (Gordon)
- **Container Orchestration**: Kubernetes (Minikube), Helm Charts
- **AI DevOps Tools**: kubectl-ai, Kagent for intelligent Kubernetes operations
- **Local Deployment**: Minikube for local Kubernetes cluster
- **Infrastructure as Code**: Helm Charts for deployment packaging
- **AI-Assisted Operations**: Docker AI Agent (Gordon) for intelligent Docker operations

### Section 7.4 - Scope Transition

Phase 4 is now active and focused on:
- Deploying the Todo Chatbot on a local Kubernetes cluster using Minikube
- Containerizing frontend and backend applications using Docker and Docker AI Agent (Gordon)
- Creating Helm charts for deployment using kubectl-ai and Kagent
- Using kubectl-ai and Kagent for AI-assisted Kubernetes operations
- Maintaining compatibility with existing Phase 3 architecture (AI Chatbot with MCP)

Phase 3 (AI Chatbot Integration) is COMPLETE. All new work should align with Phase 4 objectives.

### Section 7.5 - Scope Rejection

Any request to implement technologies or patterns from future phases MUST be rejected with:
- Clear citation of this Article (VII)
- Explanation that Phase-4 is focused on local Kubernetes deployment with Minikube, Helm, and AI-assisted DevOps
- Guidance that the feature belongs to a later phase

Agents MUST NOT implement "simple versions" or "prototypes" of future-phase technologies.

## Article VIII: Quality Standards

### Section 8.1 - Container Quality
- Optimized Docker images with minimal attack surface
- Multi-stage builds to reduce image size
- Regular security scanning of container images
- Proper resource allocation in Kubernetes manifests

### Section 8.2 - Deployment Quality
- Proper health checks and readiness probes
- Configurable resource limits and requests
- Secure secret management in Kubernetes
- Proper logging and monitoring configurations

### Section 8.3 - Code Quality (Maintained from Previous Phases)
- Follow existing code patterns and conventions
- Maintain TypeScript strict mode compliance
- Ensure proper component prop typing
- Add appropriate error boundaries

### Section 8.4 - User Experience (Maintained from Previous Phases)
- Consistent with existing application design
- Accessible to users with disabilities (WCAG 2.1 AA)
- Responsive across different devices
- Fast loading and interaction times (<200ms page load)

### Section 8.5 - Performance (Maintained from Previous Phases)
- Optimize data fetching and component rendering
- Efficient API calls with proper caching
- Minimize bundle sizes
- Lazy-load non-critical components

### Section 8.6 - Testing
- API endpoints: integration tests
- Critical logic: unit tests
- Auth flows: security tests
- Container deployment: integration tests
- Kubernetes manifests: validation tests
- All tests traceable to Task IDs

## Article IX: Governance

### Section 9.1 - Constitutional Supremacy

This Constitution is the supreme governing document for Phase-4. In the event of conflict:

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

**Version**: 4.0.0
**Ratified**: 2026-01-14
**Last Amended**: 2026-02-04

---

## Appendix A: Quick Reference

**Permitted**: Docker, Docker AI Agent (Gordon), Kubernetes (Minikube), Helm Charts, kubectl-ai, Kagent, Next.js, TypeScript, React, Tailwind, FastAPI, SQLModel, PostgreSQL, JWT, Better Auth, REST API
**Forbidden**: Manual Docker/Kubernetes operations, hardcoded configs, unsecured containers, direct DB access from frontend, unauthenticated endpoints

**Pipeline**: Specify → Plan → Tasks → Implement (Backend) → Implement (Frontend) → Test & Iterate (MANDATORY, NO EXCEPTIONS)

**Traceability**: Every file and function MUST reference Task ID and Spec section

**Security**: JWT validation on all protected endpoints, user data isolation by user_id, secure container images, proper secret management

**Agent Behavior**: Refuse to proceed without Spec. Clarify, never guess. Never invent requirements.

---

*This Constitution is binding on all agents, developers, and contributors during Phase-4. Compliance is mandatory.*
