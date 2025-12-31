"""
Task: T018, T026, T031, T036, T042, T047
Spec: 003-task-crud - Task CRUD API Endpoints

REST API endpoints for task management with JWT authentication and user isolation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from app.database import get_session
from app.auth.dependencies import get_current_user_id
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """
    Get all tasks for the authenticated user.

    Task: T018
    Spec: US-1 View All Tasks

    Returns:
        List of tasks sorted by creation date (newest first)

    Security:
        - Requires valid JWT token
        - Returns only tasks belonging to authenticated user
    """
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    results = await session.execute(statement)
    tasks = results.scalars().all()
    return tasks


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a new task for the authenticated user.

    Task: T026
    Spec: US-2 Create Task

    Args:
        task_data: Task creation data (title required, description optional)

    Returns:
        Created task with auto-generated ID and timestamps

    Security:
        - Requires valid JWT token
        - Task automatically assigned to authenticated user
    """
    task = Task(**task_data.model_dump(), user_id=user_id)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """
    Get a specific task by ID.

    Task: T031
    Spec: US-3 View Single Task

    Args:
        task_id: Task UUID

    Returns:
        Task details if found and owned by user

    Raises:
        404: Task not found or doesn't belong to user

    Security:
        - Requires valid JWT token
        - Returns 404 (not 403) for unauthorized access to prevent enumeration
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """
    Update a task's fields.

    Task: T036
    Spec: US-4 Update Task

    Args:
        task_id: Task UUID
        task_data: Fields to update (all optional)

    Returns:
        Updated task with refreshed updated_at timestamp

    Raises:
        404: Task not found or doesn't belong to user

    Security:
        - Requires valid JWT token
        - Can only update tasks owned by authenticated user
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """
    Mark a task as completed.

    Task: T042
    Spec: US-5 Toggle Task Completion

    Args:
        task_id: Task UUID

    Returns:
        Task with completed=True and refreshed updated_at

    Raises:
        404: Task not found or doesn't belong to user

    Security:
        - Requires valid JWT token
        - Can only complete tasks owned by authenticated user
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.completed = True
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """
    Delete a task permanently.

    Task: T047
    Spec: US-6 Delete Task

    Args:
        task_id: Task UUID

    Returns:
        204 No Content on success

    Raises:
        404: Task not found or doesn't belong to user

    Security:
        - Requires valid JWT token
        - Can only delete tasks owned by authenticated user
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await session.delete(task)
    await session.commit()
    return None
