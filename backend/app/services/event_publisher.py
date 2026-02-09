"""
Task: T011
Spec: 001-event-driven-todo/spec.md - Dapr Event Publishing Service

Service to publish task events to Kafka via Dapr pub/sub component.
"""

import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, Any
from dapr.clients import DaprClient
from app.models.task import Task


class EventPublisher:
    def __init__(self):
        self.pubsub_name = "kafka-pubsub"
        self.topic_name = "task-events"

    def _create_task_event(self, event_type: str, task: Task, user_id: str) -> Dict[str, Any]:
        """Create standardized task event structure."""
        return {
            "event_id": str(uuid.uuid4()),
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "user_id": user_id,
            "task_id": task.id,
            "task_data": {
                "title": task.title,
                "description": task.description or "",
                "completed": task.completed
            }
        }

    def publish_task_created(self, task: Task, user_id: str):
        """Publish task created event."""
        event = self._create_task_event("created", task, user_id)
        self._publish_event(event)

    def publish_task_updated(self, task: Task, user_id: str):
        """Publish task updated event."""
        event = self._create_task_event("updated", task, user_id)
        self._publish_event(event)

    def publish_task_deleted(self, task: Task, user_id: str):
        """Publish task deleted event."""
        event = self._create_task_event("deleted", task, user_id)
        self._publish_event(event)

    def publish_task_completed(self, task: Task, user_id: str):
        """Publish task completed event."""
        event = self._create_task_event("completed", task, user_id)
        self._publish_event(event)

    def _publish_event(self, event: Dict[str, Any]):
        """Publish event to Dapr pub/sub."""
        try:
            with DaprClient() as client:
                # Publish event to Kafka via Dapr
                result = client.publish_event(
                    pubsub_name=self.pubsub_name,
                    topic_name=self.topic_name,
                    data=json.dumps(event),
                    data_content_type='application/json'
                )
                print(f"Published event {event['event_id']} ({event['event_type']}) to {self.topic_name}")
        except Exception as e:
            print(f"Failed to publish event: {str(e)}")
            # In a production environment, you might want to implement retry logic here


# Global instance
event_publisher = EventPublisher()