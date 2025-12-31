"""
Task: T015
Spec: 003-task-crud - Task Request/Response Schemas

Pydantic schemas for Task CRUD operations.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):
    """
    Request schema for creating a new task.

    Attributes:
        title: Task title (required, 1-200 characters)
        description: Task description (optional, max 1000 characters)
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


class TaskUpdate(BaseModel):
    """
    Request schema for updating an existing task.

    All fields are optional - only provided fields will be updated.

    Attributes:
        title: New task title (optional, 1-200 characters)
        description: New task description (optional, max 1000 characters)
        completed: New completion status (optional)
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
        created_at: Creation timestamp (UTC)
        updated_at: Last update timestamp (UTC)
    """
    id: str
    title: str
    description: Optional[str]
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 (replaces orm_mode)
