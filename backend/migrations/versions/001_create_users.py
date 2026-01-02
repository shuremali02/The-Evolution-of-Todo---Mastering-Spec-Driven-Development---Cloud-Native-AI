"""
Task: T023
Spec: 002-authentication/data-model.md - User Entity Migration

Create users table with authentication fields.

Revision ID: 001
Revises:
Create Date: 2025-12-31
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Create users table with:
    - UUID primary key
    - Unique email (case-insensitive via index)
    - Hashed password (BCrypt)
    - Timestamp fields
    """
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create unique index on email (case-insensitive)
    op.create_index(
        'ix_users_email',
        'users',
        ['email'],
        unique=True
    )


def downgrade() -> None:
    """Drop users table and indexes."""
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
