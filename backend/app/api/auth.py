"""
Task: T027, T028
Spec: 002-authentication/spec.md - Authentication Endpoints

Authentication API endpoints for user registration and login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.database import get_session
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserResponse, AuthResponse, PasswordChange, EmailUpdate
from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token
from app.auth.dependencies import get_current_user_id

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    """
    Register a new user account.

    **User Story**: US-1 (User Registration)

    **Process**:
    1. Check if email already exists (case-insensitive)
    2. Check if username already exists (case-insensitive)
    3. Hash password with BCrypt
    4. Create user record in database
    5. Generate JWT token with user_id and username in claims
    6. Return token and user info

    **Request Body**:
    - username: Unique username (3-20 chars, alphanumeric/_/- only)
    - email: Valid email address
    - password: Minimum 8 characters
    - confirm_password: Must match password

    **Responses**:
    - 201: User created successfully, JWT token returned
    - 400: Invalid email format, password too short, or validation error (handled by Pydantic)
    - 409: Email or username already registered
    - 422: Validation error (Pydantic)

    **Security**:
    - Password is hashed with BCrypt (never stored in plaintext)
    - Email uniqueness enforced (case-insensitive)
    - Username uniqueness enforced (case-insensitive)
    - JWT token contains user_id and username in claims
    """
    # Check if email already exists (case-insensitive)
    statement = select(User).where(User.email == user_data.email.lower())
    result = await session.execute(statement)
    existing_email_user = result.scalar_one_or_none()

    if existing_email_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Check if username already exists (case-insensitive)
    statement = select(User).where(User.username == user_data.username.lower())
    result = await session.execute(statement)
    existing_username_user = result.scalar_one_or_none()

    if existing_username_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken"
        )

    # Hash password
    hashed_password = hash_password(user_data.password)

    # Create user
    new_user = User(
        username=user_data.username.lower(),  # Store username in lowercase
        email=user_data.email.lower(),  # Store email in lowercase
        hashed_password=hashed_password,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    # Generate JWT token with username
    access_token = create_access_token(user_id=new_user.id, username=new_user.username)

    # Return auth response
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=new_user.id,
            username=new_user.username,
            email=new_user.email,
            created_at=new_user.created_at
        )
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: UserLogin,
    session: AsyncSession = Depends(get_session)
):
    """
    Authenticate existing user with email or username and password.

    **User Story**: US-2 (User Login)

    **Process**:
    1. Find user by email or username (case-insensitive)
    2. Verify password against hashed password
    3. Generate JWT token with user_id and username in claims
    4. Return token and user info

    **Request Body**:
    - email_or_username: User email or username
    - password: User password

    **Responses**:
    - 200: Login successful, JWT token returned
    - 401: Invalid email/username or password
    - 422: Validation error (Pydantic)

    **Security**:
    - Does not reveal whether email/username or password is wrong (prevents enumeration)
    - Case-insensitive email/username matching
    - BCrypt password verification
    - JWT token contains user_id and username in claims
    """
    # Find user by email or username (case-insensitive)
    statement = select(User).where(
        (User.email == credentials.email_or_username.lower()) |
        (User.username == credentials.email_or_username.lower())
    )
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    # Check if user exists and password is correct
    if not user or not verify_password(credentials.password, user.hashed_password):
        # Generic error message (don't reveal if email/username or password is wrong)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password"
        )

    # Generate JWT token with username
    access_token = create_access_token(user_id=user.id, username=user.username)

    # Return auth response
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            created_at=user.created_at
        )
    )


@router.get("/protected")
async def protected_endpoint(
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session)
):
    """
    Test protected endpoint that requires JWT authentication.

    **User Story**: US-3 (Protected Route Access)

    **Purpose**: Demonstrates JWT validation working correctly.

    **Process**:
    1. Extract JWT from Authorization header
    2. Validate token and extract user_id from sub claim
    3. Return success message with authenticated user info

    **Headers Required**:
    - Authorization: Bearer <jwt-token>

    **Responses**:
    - 200: Token valid, user authenticated
    - 401: Token missing, invalid, or expired

    **Security**:
    - Enforces JWT validation via get_current_user_id dependency
    - User ID extracted from token (not from request body)
    - Can be used to test token expiration and validation
    """
    # Fetch user info to return in response
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "message": "Access granted to protected resource",
        "authenticated_user_id": user_id,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at.isoformat()
        }
    }


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session)
):
    """
    Change user's password after verifying current password.

    **User Story**: US-6 (Password Change)

    **Process**:
    1. Verify current password against stored hash
    2. Hash new password with BCrypt
    3. Update password in database
    4. Return success message

    **Request Body**:
    - current_password: User's current password
    - new_password: New password (minimum 8 characters)
    - confirm_password: Must match new_password

    **Responses**:
    - 200: Password changed successfully
    - 401: Current password is incorrect
    - 400: New password too short or passwords don't match
    - 422: Validation error (Pydantic)

    **Security**:
    - Requires current password verification
    - New password is hashed with BCrypt
    - Only authenticated user can change their own password
    """
    # Get current user
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Verify current password
    if not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )

    # Hash new password
    new_hashed_password = hash_password(password_data.new_password)

    # Update password
    user.hashed_password = new_hashed_password
    user.updated_at = datetime.utcnow()

    await session.commit()

    return {"message": "Password changed successfully"}


@router.post("/update-email")
async def update_email(
    email_data: EmailUpdate,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session)
):
    """
    Update user's email address after verifying current password.

    **User Story**: US-7 (Email Update)

    **Process**:
    1. Verify current password against stored hash
    2. Check if new email is already registered to another user
    3. Update email in database
    4. Return success message with new email

    **Request Body**:
    - new_email: New email address
    - password: Current password for verification

    **Responses**:
    - 200: Email updated successfully
    - 401: Current password is incorrect
    - 400: Invalid email format
    - 409: New email already registered to another account
    - 422: Validation error (Pydantic)

    **Security**:
    - Requires current password verification
    - Checks for email uniqueness
    - Only authenticated user can update their own email
    """
    # Get current user
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Verify current password
    if not verify_password(email_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Password is incorrect"
        )

    # Check if new email is already registered to another user (case-insensitive)
    statement = select(User).where(
        (User.email == email_data.new_email.lower()) &
        (User.id != user_id)  # Exclude current user
    )
    result = await session.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered to another account"
        )

    # Update email
    user.email = email_data.new_email.lower()
    user.updated_at = datetime.utcnow()

    await session.commit()

    return {
        "message": "Email updated successfully",
        "email": user.email
    }


@router.post("/logout")
async def logout():
    """
    Logout user (client-side operation, no server-side action needed).

    **User Story**: US-5 (User Logout)

    **Process**:
    1. Return success message
    2. Client should clear JWT token from storage

    **Responses**:
    - 200: Logout successful message

    **Security**:
    - No server-side session management (stateless JWT)
    - Client responsible for clearing token
    """
    return {"message": "Logged out successfully"}
