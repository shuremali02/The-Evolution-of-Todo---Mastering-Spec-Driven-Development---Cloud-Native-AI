# Feature Specification: Event-Driven Todo System

**Feature Branch**: `0013-event-driven-todo`
**Created**: 2026-01-31
**Status**: Draft
**Input**: User description: "# Phase V Specification - Event-Driven Todo System

## Overview
Keep Phase IV features (basic todo CRUD + chatbot) but add event-driven architecture using Kafka + Dapr, then deploy to production cloud.

---

## Requirements

### R1: Kafka Topics
**Priority:** MUST HAVE

#### Topic: `task-events`
**Purpose:** All task operations (create, update, delete, complete)
**Partitions:** 6
**Retention:** 7 days

**Event Schema:**
```json
{
  "event_id": "uuid-v4",
  "event_type": "created|updated|completed|deleted",
  "timestamp": "2026-01-30T10:00:00Z",
  "user_id": "string",
  "task_id": 123,
  "task_data": {
    "title": "string",
    "description": "string",
    "completed": boolean
  }
}
```

---

### R2: Microservices Architecture
**Priority:** MUST HAVE

#### Service 1: Chat API (Enhanced from Phase IV)
**Responsibilities:**
- Handle HTTP requests (task CRUD, chat)
- **NEW:** Publish events to Kafka after every operation
- Run OpenAI Agents + MCP

**Changes from Phase IV:**
- Add Dapr Pub/Sub event publishing
- Keep all existing functionality

---

#### Service 2: Audit Service (NEW)
**Responsibilities:**
- Subscribe to `task-events` topic
- Store all events in `audit_log` table
- Provide audit trail API

**Database:**
```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  event_id UUID UNIQUE NOT NULL,
  event_type VARCHAR(50),
  user_id VARCHAR(255),
  task_id INTEGER,
  event_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE
);
```

**API:**
- `GET /api/{user_id}/audit` - View audit trail

---

#### Service 3: Notification Service (NEW - Optional)
**Responsibilities:**
- Subscribe to `task-events` topic
- Send email notification on task completion
- Log activity

---

### R3: Dapr Components
**Priority:** MUST HAVE

#### Pub/Sub Component (Kafka)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka-broker:9092"
  - name: consumerGroup
    value: "todo-services"
```

#### State Store Component (PostgreSQL)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    secretKeyRef:
      name: db-secret
      key: connection-string
```

---

### R4: Cloud Deployment
**Priority:** MUST HAVE

#### Kubernetes Cluster
- **Provider:** DigitalOcean Kubernetes (recommended)
- **Nodes:** 3 nodes, 4GB RAM each
- **Region:** Closest to you

#### Kafka Cluster
- **Option 1:** Redpanda Cloud (free serverless tier) - Recommended
- **Option 2:** Strimzi (self-hosted on K8s)

#### Container Registry
- DigitalOcean Container Registry (DOCR)

---

### R5: CI/CD Pipeline
**Priority:** MUST HAVE

#### GitHub Actions Workflow
**Triggers:** Push to `main` branch

**Steps:**
1. Run tests
2. Build Docker images (backend, audit-service)
3. Push to DOCR
4. Deploy to DOKS via Helm
5. Wait for rollout
6. Run health checks
7. Rollback on failure

---

## Acceptance Criteria

### AC1: Event Publishing
- [ ] Create task publishes "created" event
- [ ] Update task publishes "updated" event
- [ ] Delete task publishes "deleted" event
- [ ] Complete task publishes "completed" event
- [ ] Events include: event_id, timestamp, user_id, task_id, task_data

### AC2: Audit Service
- [ ] Service deployed and running
- [ ] Subscribes to task-events topic
- [ ] Stores all events in audit_log table
- [ ] GET /api/{user_id}/audit returns events

### AC3: Dapr Integration (Local)
- [ ] Dapr installed on Minikube
- [ ] Pub/Sub component configured
- [ ] Backend publishes events via Dapr
- [ ] Audit service consumes via Dapr

### AC4: Dapr Integration (Cloud)
- [ ] Dapr installed on DOKS
- [ ] Components point to Redpanda Cloud
- [ ] All services have Dapr sidecar

### AC5: Cloud Deployment
- [ ] DOKS cluster running (3 nodes)
- [ ] Redpanda Cloud Kafka connected
- [ ] All pods healthy
- [ ] Frontend accessible via LoadBalancer
- [ ] Backend API working

### AC6: CI/CD
- [ ] GitHub Actions workflow created
- [ ] Push to main triggers deployment
- [ ] Images build and push successfully
- [ ] Helm upgrade runs
- [ ] Health checks pass
- [ ] Rollback works on failure

### AC7: End-to-End
- [ ] Create task via UI → event in Kafka → stored in audit_log
- [ ] Complete task → event published
- [ ] Zero downtime during deployment"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Track Todo Tasks with Event Auditing (Priority: P1)

Users can create, update, complete, and delete todo tasks through the UI, with all operations automatically logged in an audit trail that can be viewed later. This ensures accountability and provides visibility into task changes over time.

**Why this priority**: This is the core functionality that extends the existing todo system with the new event-driven architecture, providing immediate value by enabling audit capabilities that are critical for enterprise systems.

**Independent Test**: Can be fully tested by creating tasks, performing various operations on them, and verifying that audit logs are generated and accessible. Delivers the core value of event-driven architecture with audit trail visibility.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they create a new todo task, **Then** the task is saved and an audit event is recorded showing the creation
2. **Given** a user has created a task, **When** they update the task, **Then** the changes are saved and an audit event is recorded showing the update
3. **Given** a user has created a task, **When** they delete the task, **Then** the task is removed and an audit event is recorded showing the deletion
4. **Given** a user has created a task, **When** they mark the task as complete, **Then** the status is updated and an audit event is recorded showing the completion

---

### User Story 2 - View Complete Audit Trail (Priority: P2)

Users can access a dedicated audit trail page to see a chronological history of all actions performed on their tasks, including who made changes and when they occurred.

**Why this priority**: This provides transparency and accountability for users, allowing them to track the history of their tasks and understand how they evolved over time.

**Independent Test**: Can be tested by performing various task operations, then navigating to the audit trail page to verify that all events are properly displayed in chronological order with relevant details.

**Acceptance Scenarios**:

1. **Given** a user has performed multiple task operations, **When** they visit the audit trail page, **Then** they see a chronological list of all events related to their tasks
2. **Given** audit events exist for a user's tasks, **When** they filter the audit trail, **Then** they can see events of specific types (created, updated, deleted, completed)

---

### User Story 3 - Event-Driven System Reliability (Priority: P3)

The system reliably processes and stores all task events even when individual services experience temporary failures, ensuring no audit data is lost.

**Why this priority**: This ensures the integrity and reliability of the audit system, which is crucial for maintaining trust in the system's ability to track changes accurately.

**Independent Test**: Can be tested by simulating service failures during task operations and verifying that events are eventually processed and stored once services recover.

**Acceptance Scenarios**:

1. **Given** the audit service is temporarily unavailable, **When** a user performs a task operation, **Then** the event is eventually processed once the service recovers
2. **Given** the system experiences high load, **When** multiple task operations occur simultaneously, **Then** all events are captured and stored without loss

---

### Edge Cases

- What happens when Kafka is temporarily unavailable during a task operation? The system should queue events and retry delivery when connectivity is restored.
- How does the system handle duplicate events to prevent double-processing? Each event should be uniquely identified and the system should handle duplicates gracefully.
- What if a user attempts to access audit events for tasks they don't own? The system should return only events related to tasks owned by the authenticated user.
- How does the system behave when the audit log database is full or experiencing performance issues? The system should continue to function but may temporarily delay audit logging with appropriate error handling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST publish events to Kafka for every task operation (create, update, delete, complete) via Dapr Pub/Sub
- **FR-002**: System MUST store all task-related events in an audit log database with event_id, timestamp, user_id, task_id, and event_data
- **FR-003**: Users MUST be able to access their audit trail through a dedicated API endpoint at `/api/{user_id}/audit`
- **FR-004**: System MUST ensure events are processed exactly once to prevent duplicate audit records
- **FR-005**: System MUST validate JWT tokens and ensure users can only access their own audit events
- **FR-006**: System MUST provide real-time audit event processing with maximum 5-second delay from task operation to audit record
- **FR-007**: System MUST maintain audit event data for at least 7 days as specified in the event schema
- **FR-008**: System MUST handle service failures gracefully and ensure eventual consistency of audit logs
- **FR-009**: System MUST support concurrent task operations without losing audit events
- **FR-010**: System MUST include comprehensive error handling and logging for event processing failures

### Key Entities

- **Task Event**: Represents a state change operation on a task, containing event_id (UUID), event_type (created|updated|completed|deleted), timestamp, user_id, task_id, and task_data
- **Audit Log**: Persistent record of all task events for a user, containing id, event_id, event_type, user_id, task_id, event_data (JSONB), and timestamp
- **User**: Identity associated with task operations and audit trail access, authenticated via JWT tokens
- **Task**: Core todo item with title, description, completion status, and ownership tied to a user

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of task operations result in corresponding audit events being stored in the audit log within 5 seconds
- **SC-002**: Users can access their complete audit trail with 99% availability and response times under 2 seconds
- **SC-003**: System maintains zero data loss of audit events even during temporary service outages
- **SC-004**: Audit trail displays events in correct chronological order with 100% accuracy
- **SC-005**: System supports 1000 concurrent users performing task operations without audit event loss
- **SC-006**: Users report 90% satisfaction with audit trail visibility and completeness when surveyed
- **SC-007**: Audit log retention policy maintains events for exactly 7 days as specified
