"""
Task: T027, T028, T029
Spec: 010-ai-chatbot/spec.md - Chat Endpoint

Chat API endpoint for processing natural language messages through the AI chatbot.
Implements JWT validation and integrates with the agent runner for message processing.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, Optional
from fastapi.responses import RedirectResponse

from app.database import get_session
from app.auth.dependencies import get_current_user_id
from ..schemas.chat import ChatRequest, ChatResponse
from ..services.conversation_service import ConversationService
from ..services.message_service import MessageService
from src.agents.agent_runner import AgentRunner

router = APIRouter()


@router.post("/api/v1/chat", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> ChatResponse:
    """
    Process a chat message through the AI agent.
    POST /api/chat - Send message & get AI response

    Args:
        chat_request: Request containing conversation ID (optional) and message
        session: Database session for persistence
        user_id: Authenticated user ID from JWT validation

    Returns:
        ChatResponse containing the AI's response and conversation details
    """
    try:
        # Initialize the agent runner
        agent_runner = AgentRunner()

        # Process the conversation with the AI agent
        result = await agent_runner.process_conversation(
            session=session,
            user_id=user_id,
            conversation_id=chat_request.conversation_id,
            message_content=chat_request.message
        )

        if not result.get("success", False):
            error_msg = result.get("error", "An unknown error occurred")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=error_msg
            )

        # Return the successful response
        return ChatResponse(
            conversation_id=result["conversation_id"],
            response=result["response"],
            tool_calls=result.get("tool_calls", [])
        )

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error (in a real implementation, use proper logging)
        print(f"Error in chat endpoint: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred while processing your request"
        )


@router.get("/api/v1/chat/conversations")
async def list_conversations(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> Dict[str, Any]:
    """
    List all conversations for the authenticated user.

    Args:
        session: Database session for querying
        user_id: Authenticated user ID from JWT validation

    Returns:
        Dictionary containing the list of user's conversations
    """
    try:
        agent_runner = AgentRunner()
        conversations = await agent_runner.list_user_conversations(
            session=session,
            user_id=user_id
        )

        return {
            "conversations": conversations
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving conversations: {str(e)}"
        )


@router.get("/api/v1/chat/conversations/{conversation_id}")
async def get_conversation_history(
    conversation_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> Dict[str, Any]:
    """
    Get the history of a specific conversation.

    Args:
        conversation_id: ID of the conversation to retrieve
        session: Database session for querying
        user_id: Authenticated user ID from JWT validation

    Returns:
        Dictionary containing the conversation history
    """
    try:
        agent_runner = AgentRunner()
        history = await agent_runner.get_conversation_history(
            session=session,
            conversation_id=conversation_id,
            user_id=user_id
        )

        return {
            "conversation_id": conversation_id,
            "history": history
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving conversation history: {str(e)}"
        )


@router.delete("/api/v1/chat/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> Dict[str, str]:
    """
    Delete a specific conversation.

    Args:
        conversation_id: ID of the conversation to delete
        session: Database session for the operation
        user_id: Authenticated user ID from JWT validation

    Returns:
        Dictionary confirming the deletion
    """
    try:
        # Verify the conversation belongs to the user
        conversation = await ConversationService.get_conversation_by_id(
            session, conversation_id, user_id
        )

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or doesn't belong to user"
            )

        # Delete the conversation
        success = await ConversationService.delete_conversation(
            session, conversation_id, user_id
        )

        if success:
            return {"detail": "Conversation deleted successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete conversation"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting conversation: {str(e)}"
        )


# Backward compatibility redirect endpoints
@router.post("/api/chat", response_model=ChatResponse)
async def chat_redirect(
    request: Request,
    chat_request: ChatRequest,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> ChatResponse:
    """
    Redirect from old endpoint to new endpoint with deprecation warning.
    """
    # Log deprecation warning
    print(f"WARNING: Legacy endpoint /api/chat accessed. Please update to use /api/v1/chat")

    # Forward to new endpoint
    return await chat(chat_request, session, user_id)


@router.get("/api/chat/conversations")
async def list_conversations_redirect(
    request: Request,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> Dict[str, Any]:
    """
    Redirect from old endpoint to new endpoint with deprecation warning.
    """
    print(f"WARNING: Legacy endpoint /api/chat/conversations accessed. Please update to use /api/v1/chat/conversations")

    return await list_conversations(session, user_id)


@router.get("/api/chat/conversations/{conversation_id}")
async def get_conversation_history_redirect(
    request: Request,
    conversation_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> Dict[str, Any]:
    """
    Redirect from old endpoint to new endpoint with deprecation warning.
    """
    print(f"WARNING: Legacy endpoint /api/chat/conversations/{{conversation_id}} accessed. Please update to use /api/v1/chat/conversations/{{conversation_id}}")

    return await get_conversation_history(conversation_id, session, user_id)


@router.delete("/api/chat/conversations/{conversation_id}")
async def delete_conversation_redirect(
    request: Request,
    conversation_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> Dict[str, str]:
    """
    Redirect from old endpoint to new endpoint with deprecation warning.
    """
    print(f"WARNING: Legacy endpoint /api/chat/conversations/{{conversation_id}} accessed. Please update to use /api/v1/chat/conversations/{{conversation_id}}")

    return await delete_conversation(conversation_id, session, user_id)