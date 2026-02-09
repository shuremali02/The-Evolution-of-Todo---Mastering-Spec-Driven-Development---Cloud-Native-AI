"""
Task: T007
Spec: 001-event-driven-todo/spec.md - Audit Log Database Table

SQLModel database model for audit log entries.
"""

from sqlmodel import SQLModel, Field, create_engine, Session
from datetime import datetime
from typing import Optional
import uuid
from sqlalchemy import Column
from sqlalchemy.sql.sqltypes import JSON


class AuditLog(SQLModel, table=True):
    """
    Audit log table to store all task-related events for tracking and compliance.

    Task: T007
    Spec: 001-event-driven-todo/spec.md - Audit Log Database Table
    """
    __tablename__ = "audit_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: str = Field(unique=True, nullable=False, default_factory=lambda: str(uuid.uuid4()))
    event_type: str = Field(nullable=False)  # created, updated, completed, deleted
    user_id: str = Field(nullable=False, index=True)  # Foreign key to users table
    task_id: int = Field(nullable=False)  # Foreign key to tasks table
    event_data: dict = Field(sa_column=Column(JSON, nullable=False, default=dict))
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# Indexes for performance
AuditLog.__table_args__ = (
    # Index on user_id for quick user-specific queries
    # Index on timestamp for chronological ordering
    # Index on event_type for filtering by event type
)