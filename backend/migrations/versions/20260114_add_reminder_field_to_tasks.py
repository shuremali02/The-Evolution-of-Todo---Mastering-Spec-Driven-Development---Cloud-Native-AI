"""
Task: T1008 - Add reminder support to backend API
Spec: dashboard-fixes/spec.md - Reminder functionality

Add reminder field to tasks table to support task reminder functionality.

Revision ID: 20260114_add_reminder_field_to_tasks
Revises: 20260107_fix_username_state
Create Date: 2026-01-14 03:30:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
import datetime


# revision identifiers, used by Alembic.
revision = '20260114_add_reminder_field_to_tasks'
down_revision = '20260107_fix_username_state'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add reminder column to tasks table.
    """
    # Add the reminder column to the tasks table
    op.add_column('tasks', sa.Column('reminder', sa.DateTime(), nullable=True))


def downgrade() -> None:
    """
    Remove reminder column from tasks table.
    """
    # Drop the reminder column from the tasks table
    op.drop_column('tasks', 'reminder')