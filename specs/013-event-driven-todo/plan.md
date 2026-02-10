# Implementation Plan: Event-Driven Todo System

**Branch**: `013-event-driven-todo` | **Date**: 2026-01-31 | **Spec**: [Event-Driven Todo System Spec](./spec.md)
**Input**: Feature specification from `/specs/001-event-driven-todo/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Transform the existing todo system into an event-driven architecture using Kafka and Dapr. The system will publish events for every task operation (create, update, delete, complete) to a Kafka topic, with an audit service subscribing to these events and storing them in a PostgreSQL audit log. The architecture follows microservices patterns with loose coupling and asynchronous processing, deployed on DigitalOcean Kubernetes.

## Technical Context

**Language/Version**: Python 3.13+, JavaScript/TypeScript (Next.js 15+)
**Primary Dependencies**: FastAPI, Dapr, Kafka, PostgreSQL, Neon Postgres, Better Auth, httpx, pydantic, uuid
**Storage**: PostgreSQL (Neon) for primary data and audit logging
**Testing**: pytest for backend services, Jest for frontend, contract tests for API verification
**Target Platform**: Kubernetes (DigitalOcean K8s) with Dapr sidecar pattern
**Project Type**: Web application (frontend + backend + microservices)
**Performance Goals**: Event processing within 5 seconds, 99% availability, support 1000 concurrent users
**Constraints**: Must use Dapr for all Kafka interactions (no direct clients), idempotent event processing, zero downtime deployments
**Scale/Scope**: Support 1000 events/second, 7-day event retention, 100 concurrent users minimum

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase IV (Cloud-Native) Specific Checks

For features targeting Phase IV or later, verify:

- [x] Containerization requirements met (Docker/OCI format) - All services will be containerized
- [x] Stateless design (external state in DB/cache) - Services stateless, data in PostgreSQL/Kafka
- [x] Environment-based configuration (no hardcoded values) - Configuration via environment variables
- [x] SecurityContext defined (non-root, read-only filesystem) - Will implement in Kubernetes manifests
- [x] Health probes specified (liveness, readiness, startup) - All services will expose /health endpoints
- [x] Resource limits defined (requests and limits) - Kubernetes deployments will specify limits
- [x] Kubernetes manifests use Helm/Kustomize (no imperative YAML) - Using Helm charts for deployment
- [x] Image tagging strategy defined (no `latest` tag) - Using git SHA for image tags

### Cross-Phase Gates (always apply)

- [x] Tech stack matches constitution requirements - Uses FastAPI, PostgreSQL, Next.js as per constitution
- [x] Test coverage target defined (80% for Phase II+) - Maintaining 80%+ test coverage requirement
- [x] User isolation requirements met (Phase II+) - All queries will filter by user_id from JWT
- [x] API-first design principles followed (Phase II+) - Following RESTful patterns with OpenAPI
- [x] AI agent integration uses MCP pattern (Phase III+) - Existing MCP tools maintained in enhanced backend

## Project Structure

### Documentation (this feature)

```text
specs/001-event-driven-todo/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   ├── routers/
│   ├── middleware/
│   └── config/
└── tests/

frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── services/
└── tests/

services/
├── audit-service/
│   ├── src/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── tests/
└── notification-service/
    ├── src/
    ├── Dockerfile
    ├── requirements.txt
    └── tests/

charts/
├── todo-platform/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
└── individual-services/
    └── ...

dapr-components/
├── kafka-pubsub.yaml
└── statestore.yaml

.github/
└── workflows/
    └── deploy-cloud.yml
```

**Structure Decision**: Selected the web application + microservices structure to accommodate the frontend, enhanced backend with Dapr integration, and new audit/notification services. The existing frontend and backend are maintained while new event-driven services are added in the services/ directory following the Phase V architecture requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dapr complexity | Required by constitution (no direct Kafka clients) | Direct Kafka clients would violate Dapr-first mandate |
| Multiple services | Required by microservices pattern in constitution | Single service would violate loose coupling requirement |
