"""
Task: T010
Spec: 010-ai-chatbot/spec.md - Conversation Model

Conversation model for storing user chat conversations with AI chatbot.
Each conversation belongs to exactly one user for multi-tenant data separation.
"""

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.message import Message


class Conversation(SQLModel, table=True):
    """
    Conversation model representing a user's chat session with the AI chatbot.

    Each conversation belongs to exactly one user (enforced by foreign key).
    Conversations are isolated by user_id for multi-tenant data separation.
    """
    __tablename__ = "conversations"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="Unique conversation identifier (UUID)"
    )
    user_id: str = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="Owner user ID (foreign key to users table, indexed for fast queries)"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
        description="Conversation creation timestamp (UTC)"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
        description="Conversation last update timestamp (UTC)"
    )

    # Relationship to user and messages
    user: Optional["User"] = Relationship(back_populates="conversations")
    messages: list["Message"] = Relationship(back_populates="conversation")