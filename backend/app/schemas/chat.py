"""
Task: T027
Spec: 010-ai-chatbot/spec.md - Chat Schema

Pydantic schemas for chat API request and response validation.
Ensures proper data validation and serialization for the chat endpoint.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ChatRequest(BaseModel):
    """
    Request schema for the chat endpoint.

    Defines the expected structure for incoming chat requests.
    """
    conversation_id: Optional[str] = Field(
        None,
        description="ID of the conversation to continue (creates new if not provided)"
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="User's natural language message"
    )


class ChatResponse(BaseModel):
    """
    Response schema for the chat endpoint.

    Defines the expected structure for outgoing chat responses.
    """
    conversation_id: str = Field(
        ...,
        description="The conversation ID"
    )
    response: str = Field(
        ...,
        description="AI assistant's response"
    )
    tool_calls: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="List of MCP tools invoked"
    )

    class Config:
        from_attributes = True  # Enable ORM mode for compatibility with SQLModel