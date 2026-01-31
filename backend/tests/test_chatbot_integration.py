"""
Task: T033
Spec: 010-ai-chatbot/spec.md - Chatbot Integration Tests

Integration tests for the AI chatbot functionality to verify the complete user flow.
Tests the API endpoints, agent integration, and database operations.
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import get_session
from app.models import User, Task, Conversation, Message
from app.auth.jwt import create_access_token
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock
import json


# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_session():
    """Override the get_session dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Override the session dependency
app.dependency_overrides[get_session] = override_get_session


@pytest.fixture(scope="module")
def test_app():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="module")
def sample_user():
    """Create a sample user for testing."""
    user = User(
        id="test_user_123",
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_test_password",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    return user


@pytest.fixture(scope="module")
def auth_token(sample_user):
    """Create a JWT token for the sample user."""
    data = {"sub": sample_user.id}
    token = create_access_token(data=data, expires_delta=timedelta(hours=1))
    return token


def test_chat_endpoint_success(test_app, sample_user, auth_token):
    """Test successful chat message processing."""
    # Add the user to the database
    db = TestingSessionLocal()
    try:
        db.add(sample_user)
        db.commit()

        # Mock the AI agent response to avoid actual OpenAI calls
        with patch('src.agents.agent_runner.AgentRunner.process_conversation') as mock_process:
            mock_response = {
                "conversation_id": "test_conv_123",
                "response": "I have added the task 'Buy groceries' to your list.",
                "tool_calls": [{"name": "add_task", "arguments": {"title": "Buy groceries"}}],
                "success": True
            }
            mock_process.return_value = mock_response

            # Send a POST request to the chat endpoint
            response = test_app.post(
                "/api/chat",
                headers={"Authorization": f"Bearer auth_token"},
                json={
                    "message": "Add a task to buy groceries"
                }
            )

            # Assertions
            assert response.status_code == 200
            response_data = response.json()
            assert "conversation_id" in response_data
            assert "response" in response_data
            assert "tool_calls" in response_data
            assert response_data["response"] == "I have added the task 'Buy groceries' to your list."

    finally:
        db.close()


def test_chat_endpoint_with_existing_conversation(test_app, sample_user, auth_token):
    """Test chat message processing with an existing conversation."""
    db = TestingSessionLocal()
    try:
        db.add(sample_user)
        db.commit()

        # Mock the AI agent response
        with patch('src.agents.agent_runner.AgentRunner.process_conversation') as mock_process:
            mock_response = {
                "conversation_id": "existing_conv_456",
                "response": "I found 3 tasks in your list.",
                "tool_calls": [{"name": "list_tasks", "arguments": {"status": "all"}}],
                "success": True
            }
            mock_process.return_value = mock_response

            # Send a POST request with an existing conversation ID
            response = test_app.post(
                "/api/chat",
                headers={"Authorization": f"Bearer auth_token"},
                json={
                    "conversation_id": "existing_conv_456",
                    "message": "Show me my tasks"
                }
            )

            # Assertions
            assert response.status_code == 200
            response_data = response.json()
            assert response_data["conversation_id"] == "existing_conv_456"
            assert "response" in response_data

    finally:
        db.close()


def test_list_conversations_endpoint(test_app, sample_user, auth_token):
    """Test listing user's conversations."""
    db = TestingSessionLocal()
    try:
        # Add user and some conversations to the database
        db.add(sample_user)

        conv1 = Conversation(
            id="conv_1",
            user_id=sample_user.id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        conv2 = Conversation(
            id="conv_2",
            user_id=sample_user.id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.add(conv1)
        db.add(conv2)
        db.commit()

        # Mock the agent runner
        with patch('src.agents.agent_runner.AgentRunner.list_user_conversations') as mock_list:
            mock_list.return_value = [
                {"id": "conv_1", "created_at": "2023-01-01T00:00:00", "updated_at": "2023-01-01T00:00:00"},
                {"id": "conv_2", "created_at": "2023-01-02T00:00:00", "updated_at": "2023-01-02T00:00:00"}
            ]

            # Send a GET request to list conversations
            response = test_app.get(
                "/api/chat/conversations",
                headers={"Authorization": f"Bearer auth_token"}
            )

            # Assertions
            assert response.status_code == 200
            response_data = response.json()
            assert "conversations" in response_data
            assert len(response_data["conversations"]) >= 2

    finally:
        db.close()


def test_get_conversation_history(test_app, sample_user, auth_token):
    """Test getting conversation history."""
    db = TestingSessionLocal()
    try:
        db.add(sample_user)

        # Create a conversation
        conversation = Conversation(
            id="test_conv_history",
            user_id=sample_user.id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()

        # Mock the agent runner
        with patch('src.agents.agent_runner.AgentRunner.get_conversation_history') as mock_history:
            mock_history.return_value = [
                {
                    "role": "user",
                    "content": "Hello",
                    "timestamp": "2023-01-01T00:00:00",
                    "tool_calls": []
                },
                {
                    "role": "assistant",
                    "content": "Hi there!",
                    "timestamp": "2023-01-01T00:01:00",
                    "tool_calls": []
                }
            ]

            # Send a GET request to get conversation history
            response = test_app.get(
                f"/api/chat/conversations/test_conv_history",
                headers={"Authorization": f"Bearer auth_token"}
            )

            # Assertions
            assert response.status_code == 200
            response_data = response.json()
            assert "history" in response_data
            assert len(response_data["history"]) == 2
            assert response_data["history"][0]["role"] == "user"
            assert response_data["history"][1]["role"] == "assistant"

    finally:
        db.close()


def test_chat_endpoint_invalid_token(test_app):
    """Test chat endpoint with invalid token."""
    response = test_app.post(
        "/api/chat",
        headers={"Authorization": "Bearer invalid_token"},
        json={
            "message": "Test message"
        }
    )

    # Should return 401 for invalid token
    assert response.status_code == 401


def test_chat_endpoint_missing_message(test_app, auth_token):
    """Test chat endpoint with missing message."""
    response = test_app.post(
        "/api/chat",
        headers={"Authorization": f"Bearer auth_token"},
        json={}
    )

    # Should return 422 for validation error (missing required field)
    assert response.status_code == 422


def test_unauthorized_access_to_conversation(test_app, sample_user):
    """Test unauthorized access to another user's conversation."""
    db = TestingSessionLocal()
    try:
        # Add sample user to the database
        db.add(sample_user)

        # Create a conversation belonging to a different user
        other_user_conv = Conversation(
            id="other_users_conv",
            user_id="different_user_123",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(other_user_conv)
        db.commit()

        # Try to access the conversation with the sample user's token
        response = test_app.get(
            "/api/chat/conversations/other_users_conv",
            headers={"Authorization": f"Bearer auth_token"}
        )

        # Should return 404 or 403 since the conversation doesn't belong to the user
        assert response.status_code in [403, 404]

    finally:
        db.close()


if __name__ == "__main__":
    pytest.main([__file__])