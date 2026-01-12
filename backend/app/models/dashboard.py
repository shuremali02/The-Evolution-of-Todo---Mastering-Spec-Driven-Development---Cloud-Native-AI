"""
Task: T035
Spec: 006 Dashboard
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    tasks_due_today: int
    tasks_completed_today: int
    tasks_completed_week: int
    tasks_completed_last_week: int
    streak_days: int
    average_completion_time: float  # in hours
    high_priority_tasks: Optional[int] = 0
    medium_priority_tasks: Optional[int] = 0
    low_priority_tasks: Optional[int] = 0


class RecentActivityItem(BaseModel):
    id: str
    type: str  # 'task_created', 'task_completed', 'task_updated', 'task_deleted'
    task_id: str
    task_title: str
    priority: str  # 'low', 'medium', 'high'
    timestamp: str  # ISO date string
    description: str


class UpcomingDeadlineItem(BaseModel):
    id: str
    task_id: str
    title: str
    priority: str  # 'low', 'medium', 'high'
    due_date: str  # ISO date string
    days_until_due: int
    is_overdue: bool


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_activity: List[RecentActivityItem]
    upcoming_deadlines: List[UpcomingDeadlineItem]
    priority_distribution: dict  # {'low': int, 'medium': int, 'high': int}