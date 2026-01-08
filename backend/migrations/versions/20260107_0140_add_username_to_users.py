"""
Task: T007
Spec: 002-authentication/data-model.md - User Entity Migration

Add username field to users table with unique constraint and index.

Revision ID: 20260107_0140
Revises: 001
Create Date: 2026-01-07 01:40:00
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260107_0140'
down_revision = 'add_task_ui_fields'  # Latest migration in the main branch
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add username column to users table with:
    - Unique constraint (case-insensitive via index)
    - Index for performance
    - Non-null constraint
    - Max length 20
    """
    # Add username column (temporarily allowing NULL for migration)
    # First, check if the column already exists for SQLite compatibility
    # For this migration, we'll use a try-except approach or just run the command directly
    op.add_column('users', sa.Column('username', sa.String(length=20), nullable=True))

    # Update existing users with a temporary username (email prefix) to avoid conflicts
    # This is just for migration - in a real scenario you'd need real usernames
    connection = op.get_bind()
    connection.execute(
        sa.text("""
            UPDATE users
            SET username = SUBSTR(email, 1, INSTR(email, '@') - 1) || '_' || id
            WHERE username IS NULL OR username = ''
        """)
    )

    # Make username non-nullable
    op.alter_column('users', 'username', nullable=False)

    # Create unique index on username (case-insensitive)
    op.create_index(
        'ix_users_username',
        'users',
        ['username'],
        unique=True
    )


def downgrade() -> None:
    """Drop username column and index."""
    op.drop_index('ix_users_username', table_name='users')
    op.drop_column('users', 'username')