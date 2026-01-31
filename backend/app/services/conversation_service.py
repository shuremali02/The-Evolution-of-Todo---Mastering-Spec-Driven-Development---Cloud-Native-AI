"""
Task: T012
Spec: 010-ai-chatbot/spec.md - Conversation Service

Service layer for managing Conversation entities with proper user isolation.
All operations enforce user_id validation for security.
"""

from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.models.conversation import Conversation
from app.models.message import Message


class ConversationService:
    """Service for managing Conversation entities with user isolation."""

    @staticmethod
    async def create_conversation(session: AsyncSession, user_id: str) -> Conversation:
        """
        Create a new conversation for the specified user.

        Args:
            session: Database session
            user_id: ID of the user creating the conversation

        Returns:
            Created Conversation object
        """
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        await session.commit()
        await session.refresh(conversation)
        return conversation

    @staticmethod
    async def get_conversation_by_id(
        session: AsyncSession, conversation_id: str, user_id: str
    ) -> Optional[Conversation]:
        """
        Retrieve a conversation by ID for the specified user.

        Args:
            session: Database session
            conversation_id: ID of the conversation to retrieve
            user_id: ID of the user requesting the conversation

        Returns:
            Conversation object if found and owned by user, None otherwise
        """
        statement = select(Conversation).where(
            and_(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            )
        )
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_conversations(
        session: AsyncSession, user_id: str
    ) -> List[Conversation]:
        """
        Retrieve all conversations for the specified user.

        Args:
            session: Database session
            user_id: ID of the user whose conversations to retrieve

        Returns:
            List of Conversation objects owned by the user
        """
        statement = select(Conversation).where(Conversation.user_id == user_id)
        result = await session.execute(statement)
        return result.scalars().all()

    @staticmethod
    async def update_conversation_updated_at(
        session: AsyncSession, conversation_id: str, user_id: str
    ) -> bool:
        """
        Update the updated_at timestamp for the specified conversation.

        Args:
            session: Database session
            conversation_id: ID of the conversation to update
            user_id: ID of the user requesting the update

        Returns:
            True if update was successful, False otherwise
        """
        conversation = await ConversationService.get_conversation_by_id(
            session, conversation_id, user_id
        )
        if not conversation:
            return False

        conversation.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)  # Update to current time
        session.add(conversation)
        await session.commit()
        await session.refresh(conversation)
        return True

    @staticmethod
    async def delete_conversation(
        session: AsyncSession, conversation_id: str, user_id: str
    ) -> bool:
        """
        Delete a conversation for the specified user.

        Args:
            session: Database session
            conversation_id: ID of the conversation to delete
            user_id: ID of the user requesting deletion

        Returns:
            True if deletion was successful, False otherwise
        """
        conversation = await ConversationService.get_conversation_by_id(
            session, conversation_id, user_id
        )
        if not conversation:
            return False

        await session.delete(conversation)
        await session.commit()
        return True