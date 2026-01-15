"""
Task: T033, T036, T037
Spec: 006 Dashboard
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ....database import get_session
from ....auth.dependencies import get_current_user_id
from ....models.user import User
from ....models.dashboard import DashboardStats, RecentActivityItem, UpcomingDeadlineItem
from ....services.dashboard_service import (
    get_dashboard_stats,
    get_recent_activity,
    get_upcoming_deadlines
)

router = APIRouter()


@router.get("/tasks/stats", response_model=DashboardStats)
async def get_task_statistics(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_session)
):
    """
    Get dashboard statistics for the authenticated user
    """
    try:
        stats = await get_dashboard_stats(db, user_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks/recent", response_model=List[RecentActivityItem])
async def get_recent_activities(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_session)
):
    """
    Get recent activity for the authenticated user
    """
    try:
        activities = await get_recent_activity(db, user_id)
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks/upcoming", response_model=List[UpcomingDeadlineItem])
async def get_upcoming_deadlines_endpoint(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_session)
):
    """
    Get upcoming deadlines for the authenticated user
    """
    try:
        deadlines = await get_upcoming_deadlines(db, user_id)
        return deadlines
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))