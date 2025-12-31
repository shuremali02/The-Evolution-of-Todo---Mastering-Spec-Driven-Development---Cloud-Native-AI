"""
Task: T022, T014
Spec: 002-authentication/data-model.md - User Entity
Spec: 003-task-crud - User-Task Relationship

User account model for authentication with task relationship.
"""

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from app.models.task import Task


class User(SQLModel, table=True):
    """
    User account for authentication.

    Attributes:
        id: UUID primary key (auto-generated)
        email: Unique email address (login credential)
        hashed_password: BCrypt hashed password (never plaintext)
        created_at: Account creation timestamp
        updated_at: Last modification timestamp
    """
    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="UUID primary key"
    )
    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        nullable=False,
        description="User email address (login credential)"
    )
    hashed_password: str = Field(
        max_length=255,
        nullable=False,
        description="BCrypt hashed password (never plaintext)"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Account creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Last modification timestamp"
    )

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")
