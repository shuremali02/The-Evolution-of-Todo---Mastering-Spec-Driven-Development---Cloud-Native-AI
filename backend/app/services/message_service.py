"""
Task: T013
Spec: 010-ai-chatbot/spec.md - Message Service

Service layer for managing Message entities with proper user isolation.
All operations enforce user_id validation for security.
"""

import json
from typing import Optional, List, Dict, Any
from sqlmodel import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone

from app.models.message import Message, MessageRole


class MessageService:
    """Service for managing Message entities with user isolation."""

    @staticmethod
    async def create_message(
        session: AsyncSession,
        user_id: str,
        conversation_id: str,
        role: MessageRole,
        content: str,
        tool_calls: Optional[List[Dict[str, Any]]] = None,
        tool_responses: Optional[List[Dict[str, Any]]] = None
    ) -> Message:
        """
        Create a new message in the specified conversation.

        Args:
            session: Database session
            user_id: ID of the user creating the message
            conversation_id: ID of the conversation to add the message to
            role: Role of the message sender (user or assistant)
            content: Content of the message
            tool_calls: Optional tool calls made during the message (will be converted to JSON string)
            tool_responses: Optional responses from tools (will be converted to JSON string)

        Returns:
            Created Message object
        """
        # Convert tool_calls and tool_responses to JSON strings if they exist
        tool_calls_json = json.dumps(tool_calls) if tool_calls else None
        tool_responses_json = json.dumps(tool_responses) if tool_responses else None

        message = Message(
            user_id=user_id,
            conversation_id=conversation_id,
            role=role,
            content=content,
            tool_calls=tool_calls_json,
            tool_responses=tool_responses_json
        )
        session.add(message)
        await session.commit()
        await session.refresh(message)
        return message

    @staticmethod
    async def get_message_by_id(
        session: AsyncSession, message_id: str, user_id: str
    ) -> Optional[Message]:
        """
        Retrieve a message by ID for the specified user.

        Args:
            session: Database session
            message_id: ID of the message to retrieve
            user_id: ID of the user requesting the message

        Returns:
            Message object if found and owned by user, None otherwise
        """
        statement = select(Message).where(
            and_(
                Message.id == message_id,
                Message.user_id == user_id
            )
        )
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_messages_by_conversation(
        session: AsyncSession, conversation_id: str, user_id: str
    ) -> List[Message]:
        """
        Retrieve all messages for the specified conversation and user.

        Args:
            session: Database session
            conversation_id: ID of the conversation to retrieve messages from
            user_id: ID of the user requesting the messages

        Returns:
            List of Message objects in the conversation owned by the user
        """
        statement = select(Message).where(
            and_(
                Message.conversation_id == conversation_id,
                Message.user_id == user_id
            )
        ).order_by(Message.created_at.asc())
        result = await session.execute(statement)
        return result.scalars().all()

    @staticmethod
    async def get_latest_messages_by_conversation(
        session: AsyncSession, conversation_id: str, user_id: str, limit: int = 50
    ) -> List[Message]:
        """
        Retrieve the latest messages for the specified conversation and user, with limit.

        Args:
            session: Database session
            conversation_id: ID of the conversation to retrieve messages from
            user_id: ID of the user requesting the messages
            limit: Maximum number of messages to return (default: 50)

        Returns:
            List of Message objects in the conversation owned by the user, limited by count
        """
        statement = select(Message).where(
            and_(
                Message.conversation_id == conversation_id,
                Message.user_id == user_id
            )
        ).order_by(Message.created_at.desc()).limit(limit)

        result = await session.execute(statement)
        messages = result.scalars().all()

        # Return messages in chronological order (oldest first)
        return list(reversed(messages))

    @staticmethod
    async def truncate_old_messages(
        session: AsyncSession, conversation_id: str, user_id: str, max_messages: int = 50
    ) -> int:
        """
        Remove oldest messages in a conversation if it exceeds the maximum count.

        Args:
            session: Database session
            conversation_id: ID of the conversation to truncate
            user_id: ID of the user requesting the truncation
            max_messages: Maximum number of messages to keep (default: 50)

        Returns:
            Number of messages deleted
        """
        # First, count total messages in the conversation for this user
        count_statement = select(func.count(Message.id)).where(
            and_(
                Message.conversation_id == conversation_id,
                Message.user_id == user_id
            )
        )
        result = await session.execute(count_statement)
        total_messages = result.scalar_one()

        if total_messages <= max_messages:
            return 0  # No truncation needed

        # Get IDs of messages to delete (the oldest ones)
        delete_statement = (
            select(Message.id)
            .where(
                and_(
                    Message.conversation_id == conversation_id,
                    Message.user_id == user_id
                )
            )
            .order_by(Message.created_at.asc())
            .limit(total_messages - max_messages)
        )
        delete_result = await session.execute(delete_statement)
        message_ids_to_delete = [row[0] for row in delete_result.all()]

        if not message_ids_to_delete:
            return 0

        # Delete the oldest messages
        delete_query = select(Message).where(Message.id.in_(message_ids_to_delete))
        messages_to_delete = (await session.execute(delete_query)).scalars().all()

        for message in messages_to_delete:
            await session.delete(message)

        await session.commit()
        return len(message_ids_to_delete)

    @staticmethod
    async def delete_message(
        session: AsyncSession, message_id: str, user_id: str
    ) -> bool:
        """
        Delete a message for the specified user.

        Args:
            session: Database session
            message_id: ID of the message to delete
            user_id: ID of the user requesting deletion

        Returns:
            True if deletion was successful, False otherwise
        """
        message = await MessageService.get_message_by_id(session, message_id, user_id)
        if not message:
            return False

        await session.delete(message)
        await session.commit()
        return True