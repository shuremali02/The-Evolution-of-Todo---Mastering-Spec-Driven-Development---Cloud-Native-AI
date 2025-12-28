<!--
Sync Impact Report:
Version change: [INITIAL] → 1.0.0
Modified principles: N/A (initial constitution)
Added sections:
  - Phase-1 Purpose & Scope
  - Hard Technical Constraints
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

# Phase-1 Todo CLI Application Constitution

## Preamble

This Constitution establishes the non-negotiable laws governing all development, specification, planning, and implementation activities during Phase-1 of the Agentic Engineering Hackathon. All agents, developers, and contributors MUST comply with every provision herein. This Constitution supersedes all other guidance, preferences, or conventions.

## Article I: Phase-1 Purpose & Scope

### Section 1.1 - Purpose

Phase-1 exists solely to prove and validate the Spec-Driven Development (SDD) methodology. The purpose is NOT to build advanced infrastructure, distributed systems, or production-grade software. The purpose IS to:

- **Establish Spec Discipline**: Enforce that all work originates from written specifications
- **Validate Task Traceability**: Prove every code artifact traces to a task, plan, and spec
- **Train Agent Control**: Demonstrate that AI agents can be constrained and directed through formal specification

Phase-1 is a foundational training phase. Success is measured by adherence to process, not by feature sophistication.

### Section 1.2 - Scope

The deliverable for Phase-1 is a simple CLI-based Todo application with optional chat capabilities. This application:

- Runs locally on a single machine
- Accepts commands via command-line interface
- Stores state in local files or in-memory structures
- Requires no network services, containers, or external infrastructure

## Article II: Hard Technical Constraints

### Section 2.1 - Forbidden Technologies (MUST NOT)

The following technologies, patterns, and architectures are EXPLICITLY FORBIDDEN in Phase-1:

**Infrastructure & Orchestration**:
- Kubernetes
- Docker or any containerization
- Cloud services (AWS, Azure, GCP, etc.)
- Virtual machines or hypervisors

**Messaging & Event Systems**:
- Kafka
- RabbitMQ, NATS, or any message broker
- Dapr or service mesh technologies
- Event streaming platforms
- Async event buses

**Network & Web**:
- HTTP APIs or REST endpoints
- Web servers (Flask, FastAPI, Django, Express, etc.)
- Web frontends (React, Vue, Angular, HTML/CSS/JS)
- GraphQL endpoints
- WebSocket servers

**Data Layer**:
- Databases (PostgreSQL, MySQL, MongoDB, Redis, etc.)
- ORMs (SQLAlchemy, Mongoose, etc.)
- Data lakes or warehouses
- Caching layers

**Architecture Patterns**:
- Microservices
- Service-oriented architecture
- Distributed systems
- Background worker processes
- Daemon processes

**External APIs**:
- Third-party API integrations (EXCEPT OpenAI ChatKit if required for chat feature)
- Webhooks
- External authentication services

### Section 2.2 - Permitted Technologies (MUST USE ONLY)

Phase-1 development MUST be constrained to:

- **Runtime**: Python 3.8+ only
- **Interface**: Command-line interface (CLI) using stdin/stdout/stderr
- **State**: Local filesystem (JSON, YAML, text files) or in-memory data structures
- **Libraries**: Python standard library and minimal third-party packages (e.g., Click for CLI, PyYAML for config)
- **AI Integration**: OpenAI ChatKit or similar ONLY if chat functionality is specified

## Article III: Architecture Rules

### Section 3.1 - Single-Process Constraint

The application MUST:
- Execute as a single Python process per invocation
- Complete all work within the process lifecycle
- Exit cleanly with appropriate status codes

The application MUST NOT:
- Fork background processes
- Maintain long-running services
- Use threading for concurrency (unless absolutely necessary and justified in spec)
- Use async/await patterns for event handling

### Section 3.2 - State Management

State persistence MUST:
- Use local filesystem (JSON or YAML files)
- Store files in a clearly defined directory (e.g., `~/.todo-cli/` or `./data/`)
- Implement simple read/write operations (no transactions, no locking beyond OS-level file locking)

State persistence MUST NOT:
- Use databases or database engines
- Implement distributed state or replication
- Use remote storage or cloud file systems

### Section 3.3 - Determinism

All application behavior MUST be deterministic:
- Same inputs produce same outputs
- No hidden state or side effects
- No randomness unless explicitly required and seeded
- Timestamps and UUIDs acceptable for IDs but must be testable

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

- **Phase-2+**: Web APIs, HTTP servers, REST endpoints
- **Phase-3+**: Microservices, service mesh, Dapr
- **Phase-4+**: Kafka, event streaming, message brokers
- **Phase-5+**: Kubernetes, container orchestration, cloud deployment
- **Phase-6+**: MCP (Model Context Protocol) integrations, agent-to-agent communication
- **Phase-7+**: Distributed systems, multi-region deployments, production hardening

### Section 7.2 - Scope Rejection

Any request to implement technologies or patterns from future phases MUST be rejected with:
- Clear citation of this Article (VII)
- Explanation that Phase-1 is intentionally minimal
- Guidance that the feature belongs to a later phase

Agents MUST NOT implement "simple versions" or "prototypes" of future-phase technologies.

## Article VIII: Quality Standards

### Section 8.1 - Deterministic Behavior

All code MUST exhibit deterministic behavior:
- Unit tests MUST pass consistently
- Same inputs MUST produce same outputs
- No flaky tests, no race conditions, no non-deterministic failures

### Section 8.2 - Readability

Code MUST be:
- Self-explanatory with clear variable and function names
- Commented where logic is non-obvious
- Structured with appropriate separation of concerns
- Formatted consistently (PEP 8 for Python)

Code MUST NOT:
- Use obscure one-liners or "clever" tricks
- Rely on implicit behavior or side effects
- Use magic numbers or undocumented constants

### Section 8.3 - No Magic

The application MUST NOT:
- Use metaprogramming or reflection unless explicitly justified in the Spec
- Implement auto-discovery or plugin systems
- Use dynamic code generation or eval()
- Hide behavior behind abstractions that obscure control flow

### Section 8.4 - No Hidden Automation

All automation MUST be:
- Explicitly specified in the Spec
- Documented in the Plan
- Implemented in traceable Tasks
- Visible and understandable to users

Scripts, hooks, or background automation that "just work" without user knowledge are FORBIDDEN.

## Article IX: Governance

### Section 9.1 - Constitutional Supremacy

This Constitution is the supreme governing document for Phase-1. In the event of conflict:

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
**Ratified**: 2025-12-29
**Last Amended**: 2025-12-29

---

## Appendix A: Quick Reference

**Forbidden**: Kafka, Dapr, Kubernetes, Docker, Cloud, Web, HTTP, Databases, Microservices, Message Queues, External APIs (except OpenAI if needed)

**Allowed**: Python CLI, Local files, In-memory state, stdin/stdout/stderr

**Pipeline**: Specify → Plan → Tasks → Implement → Validate (MANDATORY, NO EXCEPTIONS)

**Traceability**: Every file and function MUST reference Task ID and Spec section

**Agent Behavior**: Refuse to proceed without Spec. Clarify, never guess. Never invent requirements.

---

*This Constitution is binding on all agents, developers, and contributors during Phase-1. Compliance is mandatory.*
