"""
Task: T025, T026
Spec: 002-authentication/data-model.md - Pydantic Schemas

Request and response schemas for authentication endpoints.
"""

from pydantic import BaseModel, EmailStr, Field
from pydantic.functional_validators import field_validator
from datetime import datetime


class UserCreate(BaseModel):
    """
    User registration request schema.

    Used for: POST /api/v1/auth/signup
    """
    username: str = Field(
        ...,
        min_length=3,
        max_length=20,
        description="Username (3-20 chars, alphanumeric/_/- only, first char letter/number)"
    )
    email: EmailStr = Field(
        ...,
        description="User email address (must be valid email format)"
    )
    password: str = Field(
        ...,
        min_length=8,
        description="User password (minimum 8 characters)"
    )
    confirm_password: str = Field(
        ...,
        description="Password confirmation (must match password)"
    )

    @field_validator('username')
    def validate_username(cls, v):
        """
        Validate username format:
        - 3-20 characters
        - Alphanumeric, underscore, hyphen only
        - First character must be letter or number
        """
        if len(v) < 3 or len(v) > 20:
            raise ValueError('Username must be between 3 and 20 characters')

        # Check that it only contains allowed characters
        import re
        if not re.match(r'^[a-zA-Z0-9][a-zA-Z0-9_-]*$', v):
            raise ValueError('Username must start with letter/number and contain only letters, numbers, underscores, and hyphens')

        return v.lower()  # Store in lowercase for case-insensitive uniqueness

    @field_validator('confirm_password')
    def passwords_match(cls, v, values):
        """
        Validate that password and confirm_password match.
        """
        if 'password' in values.data and v != values.data['password']:
            raise ValueError('Passwords do not match')
        return v


class UserLogin(BaseModel):
    """
    User login request schema.

    Used for: POST /api/v1/auth/login
    """
    email_or_username: str = Field(
        ...,
        description="User email or username for login"
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
    username: str = Field(
        ...,
        description="User username"
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


class PasswordChange(BaseModel):
    """
    Password change request schema.

    Used for: POST /api/v1/auth/change-password
    """
    current_password: str = Field(
        ...,
        description="Current password for verification"
    )
    new_password: str = Field(
        ...,
        min_length=8,
        description="New password (minimum 8 characters)"
    )
    confirm_password: str = Field(
        ...,
        description="New password confirmation (must match new_password)"
    )

    @field_validator('confirm_password')
    def passwords_match(cls, v, values):
        """
        Validate that new_password and confirm_password match.
        """
        if 'new_password' in values.data and v != values.data['new_password']:
            raise ValueError('New passwords do not match')
        return v


class EmailUpdate(BaseModel):
    """
    Email update request schema.

    Used for: POST /api/v1/auth/update-email
    """
    new_email: EmailStr = Field(
        ...,
        description="New email address"
    )
    password: str = Field(
        ...,
        description="Current password for verification"
    )
