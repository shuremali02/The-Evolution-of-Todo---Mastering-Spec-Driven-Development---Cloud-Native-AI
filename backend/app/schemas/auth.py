"""
Task: T025, T026
Spec: 002-authentication/data-model.md - Pydantic Schemas

Request and response schemas for authentication endpoints.
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class UserCreate(BaseModel):
    """
    User registration request schema.

    Used for: POST /api/v1/auth/signup
    """
    email: EmailStr = Field(
        ...,
        description="User email address (must be valid email format)"
    )
    password: str = Field(
        ...,
        min_length=8,
        description="User password (minimum 8 characters)"
    )


class UserLogin(BaseModel):
    """
    User login request schema.

    Used for: POST /api/v1/auth/login
    """
    email: EmailStr = Field(
        ...,
        description="User email address"
    )
    password: str = Field(
        ...,
        description="User password"
    )


class UserResponse(BaseModel):
    """
    User entity response (public user information).

    Used in: AuthResponse
    """
    id: str = Field(
        ...,
        description="User UUID"
    )
    email: str = Field(
        ...,
        description="User email address"
    )
    created_at: datetime = Field(
        ...,
        description="Account creation timestamp"
    )

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)


class AuthResponse(BaseModel):
    """
    Authentication response with JWT token and user info.

    Used for: POST /api/v1/auth/signup, POST /api/v1/auth/login
    """
    access_token: str = Field(
        ...,
        description="JWT access token (attach to Authorization header)"
    )
    token_type: str = Field(
        default="bearer",
        description="Token type (always 'bearer')"
    )
    user: UserResponse = Field(
        ...,
        description="Authenticated user information"
    )
