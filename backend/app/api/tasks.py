"""
Task: T013, T014, T015, T016
Spec: 005-task-management-ui/task-ui/spec.md - Task CRUD API Endpoints with UI Enhancements

REST API endpoints for task management with JWT authentication and user isolation.
Extended with search, sort, filter, priority, due_date, and reorder functionality.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime, timezone

from app.database import get_session
from app.auth.dependencies import get_current_user_id
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse, TaskReorder

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


@router.get("", response_model=TaskListResponse)
async def get_tasks(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id),
    search: Optional[str] = Query(None, description="Search in title and description"),
    filter_status: Optional[str] = Query("all", description="Filter by status: all, active, completed"),
    sort: Optional[str] = Query("newest", description="Sort by: newest, oldest, title_asc, title_desc, priority, due_date"),
    limit: int = Query(100, ge=1, le=1000, description="Pagination limit"),
    offset: int = Query(0, ge=0, description="Pagination offset")
):
    """
    Get all tasks for the authenticated user with search, sort, and filter options.

    Task: T013
    Spec: US-1 Search Tasks, US-2 Sort Tasks

    Args:
        search: Search term to match in title or description
        filter_status: Filter by completion status (all, active, completed)
        sort: Sort order (newest, oldest, title_asc, title_desc, priority, due_date)
        limit: Number of tasks to return (1-1000)
        offset: Number of tasks to skip for pagination

    Returns:
        TaskListResponse with tasks and pagination metadata

    Security:
        - Requires valid JWT token
        - Returns only tasks belonging to authenticated user
    """
    statement = select(Task).where(Task.user_id == user_id)

    # Apply search filter
    if search:
        search_term = f"%{search}%"
        statement = statement.where(
            (Task.title.ilike(search_term)) | (Task.description.ilike(search_term))
        )

    # Apply status filter
    if filter_status == "active":
        statement = statement.where(Task.completed == False)
    elif filter_status == "completed":
        statement = statement.where(Task.completed == True)

    # Apply sorting
    if sort == "newest":
        statement = statement.order_by(Task.created_at.desc())
    elif sort == "oldest":
        statement = statement.order_by(Task.created_at.asc())
    elif sort == "title_asc":
        statement = statement.order_by(Task.title.asc())
    elif sort == "title_desc":
        statement = statement.order_by(Task.title.desc())
    elif sort == "priority":
        statement = statement.order_by(Task.priority.asc())
    elif sort == "due_date":
        statement = statement.order_by(Task.due_date.asc())
    elif sort == "position":
        statement = statement.order_by(Task.position.asc())

    # Apply pagination
    statement = statement.offset(offset).limit(limit)

    results = await session.execute(statement)
    tasks = results.scalars().all()

    # Get total count for pagination metadata
    count_statement = select(Task).where(Task.user_id == user_id)
    if search:
        count_statement = count_statement.where(
            (Task.title.ilike(search_term)) | (Task.description.ilike(search_term))
        )
    if filter_status == "active":
        count_statement = count_statement.where(Task.completed == False)
    elif filter_status == "completed":
        count_statement = count_statement.where(Task.completed == True)

    count_results = await session.execute(count_statement)
    total = len(count_results.scalars().all())

    return TaskListResponse(
        tasks=tasks,
        total=total,
        limit=limit,
        offset=offset
    )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a new task for the authenticated user.

    Task: T014
    Spec: US-3 Priority Levels, US-4 Due Dates

    Args:
        task_data: Task creation data with optional priority, due_date, and reminder

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

    Task: T015
    Spec: US-3 Priority Levels, US-4 Due Dates

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

    Task: T015
    Spec: US-3 Priority Levels, US-4 Due Dates

    Args:
        task_id: Task UUID
        task_data: Fields to update (all optional including priority, due_date, and reminder)

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

    task.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
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

    Task: T015
    Spec: US-4 Due Dates

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
    task.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
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

    Task: T015
    Spec: US-4 Due Dates

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


@router.patch("/reorder", response_model=dict)
async def reorder_tasks(
    reorder_data: TaskReorder,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
):
    """
    Reorder tasks by updating their position field.

    Task: T016
    Spec: US-10 Drag & Drop Reordering

    Args:
        reorder_data: List of task IDs in new order

    Returns:
        Success message with updated task count

    Security:
        - Requires valid JWT token
        - Can only reorder tasks owned by authenticated user
    """
    # Get all tasks that need to be reordered
    statement = select(Task).where(
        Task.id.in_(reorder_data.task_ids),
        Task.user_id == user_id
    )
    result = await session.execute(statement)
    tasks = result.scalars().all()

    # Verify all tasks belong to the user
    if len(tasks) != len(reorder_data.task_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or more tasks not found or don't belong to user"
        )

    # Update positions based on the new order
    for index, task_id in enumerate(reorder_data.task_ids):
        for task in tasks:
            if task.id == task_id:
                task.position = index
                task.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
                break

    await session.commit()
    return {
        "success": True,
        "message": f"Successfully reordered {len(reorder_data.task_ids)} tasks",
        "count": len(reorder_data.task_ids)
    }
