"""
Task: T010
Spec: 005-task-management-ui/task-ui/spec.md - Backend Model Update

Task SQLModel for storing user tasks with foreign key to users table.
Extended with priority, due_date, and position fields for UI enhancements.
"""

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING, Literal
import uuid
import enum

if TYPE_CHECKING:
    from app.models.user import User


class TaskPriority(str, enum.Enum):
    """Task priority levels for UI enhancements."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


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

    # UI Enhancement Fields
    priority: TaskPriority = Field(
        default=TaskPriority.MEDIUM,
        description="Task priority level (low, medium, high)"
    )
    due_date: Optional[datetime] = Field(
        default=None,
        description="Optional due date for task deadline"
    )
    position: int = Field(
        default=0,
        description="Position for drag-and-drop ordering"
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
        description="Task creation timestamp (UTC)"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
        description="Task last update timestamp (UTC)"
    )

    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="tasks")
