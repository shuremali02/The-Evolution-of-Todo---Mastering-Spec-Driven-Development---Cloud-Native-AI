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
from app.schemas.auth import UserCreate, UserLogin, UserResponse, AuthResponse
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
    2. Hash password with BCrypt
    3. Create user record in database
    4. Generate JWT token with user_id in sub claim
    5. Return token and user info

    **Request Body**:
    - email: Valid email address
    - password: Minimum 8 characters

    **Responses**:
    - 201: User created successfully, JWT token returned
    - 400: Invalid email format or password too short (handled by Pydantic)
    - 409: Email already registered
    - 422: Validation error (Pydantic)

    **Security**:
    - Password is hashed with BCrypt (never stored in plaintext)
    - Email uniqueness enforced (case-insensitive)
    - JWT token contains user_id in sub claim
    """
    # Check if email already exists (case-insensitive)
    statement = select(User).where(User.email == user_data.email.lower())
    result = await session.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(user_data.password)

    # Create user
    new_user = User(
        email=user_data.email.lower(),  # Store email in lowercase
        hashed_password=hashed_password,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    # Generate JWT token
    access_token = create_access_token(user_id=new_user.id)

    # Return auth response
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=new_user.id,
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
    Authenticate existing user with email and password.

    **User Story**: US-2 (User Login)

    **Process**:
    1. Find user by email (case-insensitive)
    2. Verify password against hashed password
    3. Generate JWT token with user_id in sub claim
    4. Return token and user info

    **Request Body**:
    - email: User email address
    - password: User password

    **Responses**:
    - 200: Login successful, JWT token returned
    - 401: Invalid email or password
    - 422: Validation error (Pydantic)

    **Security**:
    - Does not reveal whether email or password is wrong (prevents enumeration)
    - Case-insensitive email matching
    - BCrypt password verification
    - JWT token contains user_id in sub claim
    """
    # Find user by email (case-insensitive)
    statement = select(User).where(User.email == credentials.email.lower())
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    # Check if user exists and password is correct
    if not user or not verify_password(credentials.password, user.hashed_password):
        # Generic error message (don't reveal if email or password is wrong)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    access_token = create_access_token(user_id=user.id)

    # Return auth response
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
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
            "email": user.email,
            "created_at": user.created_at.isoformat()
        }
    }
