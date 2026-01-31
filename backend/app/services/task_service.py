"""
Task: T014
Spec: 010-ai-chatbot/spec.md - Task Service

Service layer for managing Task entities with proper user isolation.
All operations enforce user_id validation for security.
"""

from typing import Optional, List
from sqlmodel import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.models.task import Task, TaskPriority


class TaskService:
    """Service for managing Task entities with user isolation."""

    @staticmethod
    async def create_task(
        session: AsyncSession,
        user_id: str,
        title: str,
        description: Optional[str] = None,
        priority: TaskPriority = TaskPriority.MEDIUM,
        due_date: Optional[str] = None,
        reminder: Optional[str] = None
    ) -> Task:
        """
        Create a new task for the specified user.

        Args:
            session: Database session
            user_id: ID of the user creating the task
            title: Title of the task
            description: Optional description of the task
            priority: Priority level of the task
            due_date: Optional due date for the task
            reminder: Optional reminder datetime for the task

        Returns:
            Created Task object
        """
        task = Task(
            title=title,
            description=description,
            user_id=user_id,
            priority=priority,
            due_date=due_date,
            reminder=reminder
        )
        session.add(task)
        await session.commit()
        await session.refresh(task)
        return task

    @staticmethod
    async def get_task_by_id(
        session: AsyncSession, task_id: str, user_id: str
    ) -> Optional[Task]:
        """
        Retrieve a task by ID for the specified user.

        Args:
            session: Database session
            task_id: ID of the task to retrieve
            user_id: ID of the user requesting the task

        Returns:
            Task object if found and owned by user, None otherwise
        """
        statement = select(Task).where(
            and_(
                Task.id == task_id,
                Task.user_id == user_id
            )
        )
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_tasks(
        session: AsyncSession, user_id: str, status: Optional[str] = None
    ) -> List[Task]:
        """
        Retrieve all tasks for the specified user with optional status filter.

        Args:
            session: Database session
            user_id: ID of the user whose tasks to retrieve
            status: Optional status filter ('all', 'pending', 'completed')

        Returns:
            List of Task objects owned by the user
        """
        statement = select(Task).where(Task.user_id == user_id)

        if status and status != 'all':
            if status == 'pending':
                statement = statement.where(Task.completed == False)
            elif status == 'completed':
                statement = statement.where(Task.completed == True)

        statement = statement.order_by(Task.position.asc(), Task.created_at.desc())
        result = await session.execute(statement)
        return result.scalars().all()

    @staticmethod
    async def update_task(
        session: AsyncSession,
        task_id: str,
        user_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        completed: Optional[bool] = None,
        priority: Optional[TaskPriority] = None,
        due_date: Optional[str] = None,
        reminder: Optional[str] = None
    ) -> Optional[Task]:
        """
        Update a task for the specified user.

        Args:
            session: Database session
            task_id: ID of the task to update
            user_id: ID of the user requesting the update
            title: New title for the task (optional)
            description: New description for the task (optional)
            completed: New completion status (optional)
            priority: New priority level (optional)
            due_date: New due date (optional)
            reminder: New reminder datetime (optional)

        Returns:
            Updated Task object if successful, None otherwise
        """
        task = await TaskService.get_task_by_id(session, task_id, user_id)
        if not task:
            return None

        update_data = {}
        if title is not None:
            update_data['title'] = title
        if description is not None:
            update_data['description'] = description
        if completed is not None:
            update_data['completed'] = completed
        if priority is not None:
            update_data['priority'] = priority
        if due_date is not None:
            update_data['due_date'] = due_date
        if reminder is not None:
            update_data['reminder'] = reminder

        for key, value in update_data.items():
            setattr(task, key, value)

        session.add(task)
        await session.commit()
        await session.refresh(task)
        return task

    @staticmethod
    async def complete_task(
        session: AsyncSession, task_id: str, user_id: str
    ) -> Optional[Task]:
        """
        Mark a task as completed for the specified user.

        Args:
            session: Database session
            task_id: ID of the task to mark as completed
            user_id: ID of the user requesting the completion

        Returns:
            Updated Task object if successful, None otherwise
        """
        return await TaskService.update_task(
            session, task_id, user_id, completed=True
        )

    @staticmethod
    async def delete_task(
        session: AsyncSession, task_id: str, user_id: str
    ) -> bool:
        """
        Delete a task for the specified user.

        Args:
            session: Database session
            task_id: ID of the task to delete
            user_id: ID of the user requesting deletion

        Returns:
            True if deletion was successful, False otherwise
        """
        task = await TaskService.get_task_by_id(session, task_id, user_id)
        if not task:
            return False

        await session.delete(task)
        await session.commit()
        return True