"""
Task: T011
Spec: 005-task-management-ui/task-ui/spec.md - Backend Schema Update

Pydantic schemas for Task CRUD operations with UI enhancement fields.
"""

from pydantic import BaseModel, Field, model_validator
from datetime import datetime, timezone
from typing import Optional
from enum import Enum


class TaskPriority(str, Enum):
    """Task priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


def convert_to_utc(dt: datetime) -> datetime:
    """Convert datetime to UTC timezone-aware datetime, then remove tzinfo for database compatibility."""
    if dt.tzinfo is None:
        # Assume naive datetime is in UTC
        utc_dt = dt.replace(tzinfo=timezone.utc)
    else:
        # Convert to UTC
        utc_dt = dt.astimezone(timezone.utc)

    # Remove timezone info for database compatibility (stored as naive UTC)
    return utc_dt.replace(tzinfo=None)


class TaskCreate(BaseModel):
    """
    Request schema for creating a new task.

    Attributes:
        title: Task title (required, 1-200 characters)
        description: Task description (optional, max 1000 characters)
        priority: Task priority (optional, default: medium)
        due_date: Task due date (optional)
    """
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title (required)"
    )
    description: Optional[str] = Field(
        None,
        max_length=1000,
        description="Task description (optional)"
    )
    priority: TaskPriority = Field(
        default=TaskPriority.MEDIUM,
        description="Task priority level (optional)"
    )
    due_date: Optional[datetime] = Field(
        None,
        description="Task due date (optional)"
    )
    reminder: Optional[datetime] = Field(
        None,
        description="Task reminder datetime (optional)"
    )

    @model_validator(mode='after')
    def convert_timezones_to_utc(self):
        """Convert all datetime fields to UTC for consistent storage."""
        if self.due_date is not None:
            self.due_date = convert_to_utc(self.due_date)
        if self.reminder is not None:
            self.reminder = convert_to_utc(self.reminder)
        return self


class TaskUpdate(BaseModel):
    """
    Request schema for updating an existing task.

    All fields are optional - only provided fields will be updated.

    Attributes:
        title: New task title (optional, 1-200 characters)
        description: New task description (optional, max 1000 characters)
        completed: New completion status (optional)
        priority: New priority level (optional)
        due_date: New due date (optional)
    """
    title: Optional[str] = Field(
        None,
        min_length=1,
        max_length=200,
        description="Task title (optional)"
    )
    description: Optional[str] = Field(
        None,
        max_length=1000,
        description="Task description (optional)"
    )
    completed: Optional[bool] = Field(
        None,
        description="Completion status (optional)"
    )
    priority: Optional[TaskPriority] = Field(
        None,
        description="Task priority level (optional)"
    )
    due_date: Optional[datetime] = Field(
        None,
        description="Task due date (optional)"
    )
    reminder: Optional[datetime] = Field(
        None,
        description="Task reminder datetime (optional)"
    )

    @model_validator(mode='after')
    def convert_timezones_to_utc(self):
        """Convert all datetime fields to UTC for consistent storage."""
        if self.due_date is not None:
            self.due_date = convert_to_utc(self.due_date)
        if self.reminder is not None:
            self.reminder = convert_to_utc(self.reminder)
        return self


class TaskReorder(BaseModel):
    """
    Request schema for reordering tasks via drag and drop.

    Attributes:
        task_ids: List of task IDs in new order
    """
    task_ids: list[str] = Field(
        ...,
        description="List of task IDs in new order"
    )


class TaskResponse(BaseModel):
    """
    Response schema for task data.

    This is returned by all task endpoints (GET, POST, PUT, PATCH).

    Attributes:
        id: Task UUID
        title: Task title
        description: Task description (may be null)
        completed: Completion status
        user_id: Owner user UUID
        priority: Task priority level
        due_date: Task due date (may be null)
        reminder: Task reminder datetime (may be null)
        position: Position for ordering
        created_at: Creation timestamp (UTC)
        updated_at: Last update timestamp (UTC)
    """
    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    priority: TaskPriority
    due_date: Optional[datetime]
    reminder: Optional[datetime]
    position: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 (replaces orm_mode)


class TaskListResponse(BaseModel):
    """
    Response schema for list of tasks with pagination.

    Attributes:
        tasks: List of tasks
        total: Total number of tasks
        limit: Pagination limit
        offset: Pagination offset
    """
    tasks: list[TaskResponse]
    total: int
    limit: int
    offset: int
