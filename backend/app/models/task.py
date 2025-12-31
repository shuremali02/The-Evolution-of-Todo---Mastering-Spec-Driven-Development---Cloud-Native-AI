"""
Task: T013
Spec: 003-task-crud - Task Data Model

Task SQLModel for storing user tasks with foreign key to users table.
"""

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from app.models.user import User


class Task(SQLModel, table=True):
    """
    Task model representing a user's task.

    Each task belongs to exactly one user (enforced by foreign key).
    Tasks are isolated by user_id for multi-tenant data separation.
    """
    __tablename__ = "tasks"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="Unique task identifier (UUID)"
    )
    title: str = Field(
        max_length=200,
        nullable=False,
        description="Task title (required, 1-200 characters)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional task description (max 1000 characters)"
    )
    completed: bool = Field(
        default=False,
        description="Completion status (defaults to false)"
    )
    user_id: str = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="Owner user ID (foreign key to users table, indexed for fast queries)"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Task creation timestamp (UTC)"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Task last update timestamp (UTC)"
    )

    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="tasks")
