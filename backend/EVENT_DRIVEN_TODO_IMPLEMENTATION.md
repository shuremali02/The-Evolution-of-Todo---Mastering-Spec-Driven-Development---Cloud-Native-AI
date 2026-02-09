# Event-Driven Todo System Implementation

## Overview

This implementation adds event-driven architecture to the existing todo system using Kafka and Dapr. The system publishes events for every task operation (create, update, delete, complete) to a Kafka topic, with an audit service subscribing to these events and storing them in a PostgreSQL audit log.

## Components Implemented

### 1. Backend Service (Enhanced)
- **Location**: `backend/`
- **Changes**: Enhanced with Dapr event publishing capabilities
- **Event Publishing**: Every task operation (create, update, delete, complete) now publishes events to Kafka via Dapr
- **Dapr Integration**: Uses Dapr pub/sub component for event publishing

### 2. Audit Service
- **Location**: `services/audit-service/`
- **Function**: Subscribes to `task-events` topic and stores all events in audit log
- **Database**: Stores events in PostgreSQL `audit_log` table
- **API**: Provides `/api/{user_id}/audit` endpoint to view audit trail

### 3. Notification Service (Optional)
- **Location**: `services/notification-service/`
- **Function**: Subscribes to `task-events` topic and sends email notifications on task completion

### 4. Frontend Audit Trail Page
- **Location**: `frontend/app/audit/page.tsx`
- **Function**: Displays chronological history of all task operations for a user
- **Features**: Filtering by event type, sorting, pagination

### 5. Dapr Components
- **Location**: `dapr-components/`
- **Files**: `kafka-pubsub.yaml`, `statestore.yaml`
- **Configuration**: Pub/sub component for Kafka integration

### 6. Helm Chart
- **Location**: `charts/todo-platform/`
- **Function**: Deploys entire platform to Kubernetes with Dapr sidecars
- **Includes**: Backend, frontend, audit service, notification service, Kafka, PostgreSQL

### 7. CI/CD Pipeline
- **Location**: `.github/workflows/deploy-cloud.yml`
- **Function**: Automated deployment to DigitalOcean Kubernetes

## Event Schema

Each event follows this structure:
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

## Architecture Flow

1. User performs task operation (create, update, delete, complete)
2. Backend service processes the request and persists data
3. Backend service publishes event to Kafka via Dapr pub/sub
4. Audit service receives event from Kafka via Dapr pub/sub
5. Audit service stores event in PostgreSQL audit_log table
6. Frontend can retrieve audit trail via API endpoint

## Event Types

- `created`: When a task is created
- `updated`: When a task is updated
- `completed`: When a task is marked as completed
- `deleted`: When a task is deleted

## Database Schema

The audit_log table has the following schema:
- `id`: Primary key (auto-incrementing integer)
- `event_id`: Unique identifier for the event (UUID)
- `event_type`: Type of event (created, updated, completed, deleted)
- `user_id`: ID of the user who performed the action
- `task_id`: ID of the task that was affected
- `event_data`: JSON object containing task details
- `timestamp`: When the event occurred

## Deployment

The system can be deployed to DigitalOcean Kubernetes using the provided Helm chart. The CI/CD pipeline in `.github/workflows/deploy-cloud.yml` automates the deployment process.

## Security

- All audit trail access is secured with JWT authentication
- Users can only access their own audit trails
- Events are filtered by user_id to prevent unauthorized access

## Scalability

- Kafka provides horizontal scaling for event processing
- Dapr handles service discovery and communication
- Microservices architecture allows independent scaling of components
- PostgreSQL provides reliable event storage with ACID properties

## Testing

The implementation includes:
- Unit tests for audit model structure
- Integration tests for endpoint availability
- End-to-end testing capabilities through the frontend audit page

## Future Enhancements

- Dead letter queues for failed events
- Event replay capabilities
- Advanced filtering and search for audit trails
- Metrics and monitoring dashboards
- Additional notification channels (SMS, push notifications)