import asyncio
import json
import os
import uuid
from datetime import datetime
from typing import Dict, Optional

import uvicorn
from dapr.ext.fastapi import DaprApp
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlmodel import Field, Session, SQLModel, create_engine, select
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Audit Service", description="Handles task events and stores audit logs")
dapr_app = DaprApp(app)


class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: str = Field(unique=True, nullable=False)
    event_type: str
    user_id: str
    task_id: int
    event_data: Dict = Field(default={}, sa_column_kwargs={"server_default": "{}"})
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TaskEventData(BaseModel):
    title: str
    description: str
    completed: bool


class TaskEvent(BaseModel):
    event_id: str
    event_type: str
    timestamp: str
    user_id: str
    task_id: int
    task_data: TaskEventData


# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/todo_db")
engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@app.on_event('startup')
def startup_event():
    create_db_and_tables()


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "audit-service"}


@app.get("/api/{user_id}/audit")
def get_audit_trail(user_id: str):
    """Get audit trail for a specific user"""
    with Session(engine) as session:
        statement = select(AuditLog).where(AuditLog.user_id == user_id).order_by(AuditLog.timestamp.desc())
        audit_logs = session.exec(statement).all()

        return {
            "user_id": user_id,
            "events": [
                {
                    "event_id": log.event_id,
                    "event_type": log.event_type,
                    "task_id": log.task_id,
                    "event_data": log.event_data,
                    "timestamp": log.timestamp.isoformat()
                }
                for log in audit_logs
            ]
        }


@dapr_app.subscribe(pubsub='kafka-pubsub', topic='task-events')
def handle_task_event(event_data: dict) -> None:
    """Handle incoming task events from Kafka"""
    print(f"Audit Service received event: {event_data}")

    try:
        # Validate event structure
        validated_event = TaskEvent(**event_data)

        # Store in audit log
        with Session(engine) as session:
            # Check if event already exists (for deduplication)
            existing_event = session.exec(
                select(AuditLog).where(AuditLog.event_id == validated_event.event_id)
            ).first()

            if existing_event:
                print(f"Event {validated_event.event_id} already exists, skipping")
                return

            # Create new audit log entry
            audit_log = AuditLog(
                event_id=validated_event.event_id,
                event_type=validated_event.event_type,
                user_id=validated_event.user_id,
                task_id=validated_event.task_id,
                event_data=validated_event.task_data.dict(),
                timestamp=datetime.fromisoformat(validated_event.timestamp.replace('Z', '+00:00'))
            )

            session.add(audit_log)
            session.commit()

            print(f"Stored audit event: {validated_event.event_id}")
    except Exception as e:
        print(f"Error processing event: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)