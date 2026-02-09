"""
Task: T020
Spec: 001-event-driven-todo/spec.md - Audit Trail API Endpoint

API endpoint to retrieve audit trail for a specific user.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from app.database import get_session
from app.auth.dependencies import get_current_user_id
from app.models.task import Task
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/{user_id}", response_model=dict)
async def get_audit_trail(
    user_id: str,
    session: AsyncSession = Depends(get_session),
    authenticated_user_id: str = Depends(get_current_user_id)
):
    """
    Get audit trail for a specific user.

    Task: T020
    Spec: 001-event-driven-todo/spec.md - Audit Trail API

    Args:
        user_id: The user ID to retrieve audit trail for
        session: Database session
        authenticated_user_id: The currently authenticated user ID (for security check)

    Returns:
        Dictionary containing user_id and list of audit events

    Raises:
        403: If requesting user is not the same as the target user_id

    Security:
        - Requires valid JWT token
        - Users can only access their own audit trail
    """
    # Security check: ensure the authenticated user is accessing their own audit trail
    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own audit trail"
        )

    try:
        # Query audit log entries for the user
        statement = select(AuditLog).where(AuditLog.user_id == user_id).order_by(AuditLog.timestamp.desc())
        result = await session.execute(statement)
        audit_logs = result.scalars().all()

        # Convert to response format
        events = [
            {
                "event_id": log.event_id,
                "event_type": log.event_type,
                "task_id": log.task_id,
                "event_data": log.event_data,
                "timestamp": log.timestamp.isoformat()
            }
            for log in audit_logs
        ]

        return {
            "user_id": user_id,
            "events": events
        }
    except Exception as e:
        print(f"Error retrieving audit trail: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve audit trail"
        )