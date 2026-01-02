"""
Task: T018
Spec: 002-authentication/data-model.md

Pydantic schemas package.
Exports all request/response schemas for API validation.
"""

# Import schemas here as they are created
from .auth import UserCreate, UserLogin, UserResponse, AuthResponse
# Example: from .task import TaskCreate, TaskUpdate, TaskResponse

__all__ = [
    # Authentication schemas
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "AuthResponse",
    # Task schemas will be added later
]
