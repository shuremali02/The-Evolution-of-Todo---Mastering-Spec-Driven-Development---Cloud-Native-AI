"""
Task: T010
Spec: 010-ai-chatbot/spec.md - Message Model

Message model for storing user and AI chatbot conversation messages.
Each message belongs to exactly one user and one conversation for proper isolation.
"""

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING, Literal, Dict, Any
import uuid
import enum

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.conversation import Conversation


class MessageRole(str, enum.Enum):
    """Message roles for conversation participants."""
    USER = "user"
    ASSISTANT = "assistant"


class Message(SQLModel, table=True):
    """
    Message model representing individual chat messages in a conversation.

    Each message belongs to exactly one user and one conversation (enforced by foreign keys).
    Messages are isolated by user_id for multi-tenant data separation.
    """
    __tablename__ = "messages"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="Unique message identifier (UUID)"
    )
    user_id: str = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="Owner user ID (foreign key to users table, indexed for fast queries)"
    )
    conversation_id: str = Field(
        foreign_key="conversations.id",
        nullable=False,
        index=True,
        description="Associated conversation ID (foreign key to conversations table, indexed for fast queries)"
    )
    role: MessageRole = Field(
        nullable=False,
        description="Sender role (user or assistant)"
    )
    content: str = Field(
        max_length=10000,
        nullable=False,
        description="Message content (required, max 10000 characters)"
    )
    tool_calls: Optional[str] = Field(
        default=None,
        description="MCP tool calls made during this message (JSON string)"
    )
    tool_responses: Optional[str] = Field(
        default=None,
        description="Responses from MCP tools (JSON string)"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
        description="Message creation timestamp (UTC)"
    )

    # Relationships
    user: Optional["User"] = Relationship(back_populates="messages")
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")