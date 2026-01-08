"""Add priority, due_date, position to tasks

Task: T012
Spec: 005-task-management-ui/task-ui/spec.md - Backend Migration

Revision ID: add_task_ui_fields
Revises: fix_uuid_types
Create Date: 2026-01-02 06:00:00.000000+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_task_ui_fields'
down_revision: Union[str, None] = 'fix_uuid_types'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add priority column as string (SQLite doesn't support enums natively)
    op.add_column('tasks', sa.Column(
        'priority',
        sa.String(20),
        nullable=False,
        server_default='medium'
    ))

    # Add due_date column (nullable)
    op.add_column('tasks', sa.Column(
        'due_date',
        sa.DateTime(),
        nullable=True
    ))

    # Add position column for drag-and-drop ordering
    op.add_column('tasks', sa.Column(
        'position',
        sa.Integer(),
        nullable=False,
        server_default='0'
    ))


def downgrade() -> None:
    # Remove the columns in reverse order
    op.drop_column('tasks', 'position')
    op.drop_column('tasks', 'due_date')
    op.drop_column('tasks', 'priority')
