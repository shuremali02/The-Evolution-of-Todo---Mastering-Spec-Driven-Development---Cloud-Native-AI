"""
Task: T034
Spec: 006 Dashboard
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime, timedelta
from ..models.task import Task, TaskPriority
from ..models.user import User
from ..models.dashboard import DashboardStats, RecentActivityItem, UpcomingDeadlineItem
from fastapi import HTTPException
import uuid


async def get_dashboard_stats(db: AsyncSession, user_id: str) -> DashboardStats:
    """
    Get dashboard statistics for a user
    """
    # Get all tasks for the user
    statement = select(Task).where(Task.user_id == user_id)
    result = await db.execute(statement)
    all_tasks = result.scalars().all()

    total_tasks = len(all_tasks)
    completed_tasks = len([t for t in all_tasks if t.completed])
    pending_tasks = total_tasks - completed_tasks

    # Calculate overdue tasks
    today = datetime.utcnow().date()
    overdue_tasks = len([t for t in all_tasks if not t.completed and t.due_date and t.due_date.date() < today])

    # Calculate tasks due today
    tasks_due_today = len([t for t in all_tasks if not t.completed and t.due_date and t.due_date.date() == today])

    # Calculate tasks completed today
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    tasks_completed_today = len([t for t in all_tasks if t.completed and t.updated_at and today_start <= t.updated_at <= today_end])

    # Calculate tasks completed this week
    week_start = today - timedelta(days=today.weekday())  # Monday of current week
    week_end = week_start + timedelta(days=7)
    tasks_completed_week = len([t for t in all_tasks
                                if t.completed and t.updated_at and
                                week_start <= t.updated_at.date() <= week_end])

    # Calculate tasks completed last week
    last_week_start = week_start - timedelta(days=7)
    last_week_end = week_start
    tasks_completed_last_week = len([t for t in all_tasks
                                    if t.completed and t.updated_at and
                                    last_week_start <= t.updated_at.date() <= last_week_end])

    # Calculate streak (simple calculation - consecutive days with task completion)
    streak_days = await calculate_streak(db, user_id)

    # Calculate average completion time
    avg_completion_time = await calculate_avg_completion_time(db, user_id)

    # Calculate priority distribution
    high_priority_tasks = len([t for t in all_tasks if t.priority == TaskPriority.HIGH])
    medium_priority_tasks = len([t for t in all_tasks if t.priority == TaskPriority.MEDIUM])
    low_priority_tasks = len([t for t in all_tasks if t.priority == TaskPriority.LOW])

    return DashboardStats(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        overdue_tasks=overdue_tasks,
        tasks_due_today=tasks_due_today,
        tasks_completed_today=tasks_completed_today,
        tasks_completed_week=tasks_completed_week,
        tasks_completed_last_week=tasks_completed_last_week,
        streak_days=streak_days,
        average_completion_time=avg_completion_time,
        high_priority_tasks=high_priority_tasks,
        medium_priority_tasks=medium_priority_tasks,
        low_priority_tasks=low_priority_tasks
    )


async def calculate_streak(db: AsyncSession, user_id: str) -> int:
    """
    Calculate the current completion streak for a user
    """
    # This is a simplified implementation - in a real app you'd want to track daily completion
    # For now, we'll return a default value
    return 0


async def calculate_avg_completion_time(db: AsyncSession, user_id: str) -> float:
    """
    Calculate average time taken to complete tasks
    """
    # This is a simplified implementation - in a real app you'd need to track creation and completion times
    # For now, we'll return a default value
    return 0.0


async def get_recent_activity(db: AsyncSession, user_id: str, limit: int = 10) -> List[RecentActivityItem]:
    """
    Get recent activity for a user
    """
    # This would typically come from an activity log table
    # For now, we'll return sample data based on task updates
    statement = select(Task).where(
        Task.user_id == user_id
    ).order_by(Task.updated_at.desc()).limit(limit)
    result = await db.execute(statement)
    recent_tasks = result.scalars().all()

    activities = []
    for task in recent_tasks:
        # Determine activity type based on task status
        activity_type = 'task_updated'
        if task.created_at == task.updated_at:
            activity_type = 'task_created'
        elif task.completed:
            activity_type = 'task_completed'

        # Calculate days until due
        days_until_due = 0
        is_overdue = False
        if task.due_date:
            days_until_due = (task.due_date.date() - datetime.utcnow().date()).days
            is_overdue = days_until_due < 0

        activities.append(RecentActivityItem(
            id=str(uuid.uuid4()),
            type=activity_type,
            task_id=task.id,
            task_title=task.title,
            priority=task.priority.value if hasattr(task.priority, 'value') else task.priority,
            timestamp=task.updated_at.isoformat() if task.updated_at else task.created_at.isoformat(),
            description=f"{activity_type.replace('_', ' ').title()} task: {task.title}"
        ))

    return activities


async def get_upcoming_deadlines(db: AsyncSession, user_id: str, days_ahead: int = 7) -> List[UpcomingDeadlineItem]:
    """
    Get upcoming deadlines for a user
    """
    today = datetime.utcnow().date()
    future_date = today + timedelta(days=days_ahead)

    statement = select(Task).where(
        Task.user_id == user_id,
        Task.due_date != None,
        Task.due_date >= today,
        Task.due_date <= future_date,
        Task.completed == False
    ).order_by(Task.due_date.asc())
    result = await db.execute(statement)
    tasks = result.scalars().all()

    deadlines = []
    for task in tasks:
        days_until_due = (task.due_date.date() - today).days
        is_overdue = days_until_due < 0

        deadlines.append(UpcomingDeadlineItem(
            id=str(uuid.uuid4()),
            task_id=task.id,
            title=task.title,
            priority=task.priority.value if hasattr(task.priority, 'value') else task.priority,
            due_date=task.due_date.isoformat(),
            days_until_due=days_until_due,
            is_overdue=is_overdue
        ))

    return deadlines