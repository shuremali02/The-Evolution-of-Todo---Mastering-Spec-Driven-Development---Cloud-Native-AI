"""
Task: T016
Spec: 002-authentication/contracts/jwt-spec.md - Token Validation

FastAPI dependency for extracting and validating user ID from JWT tokens.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError

from .jwt import decode_jwt

# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    FastAPI dependency to extract and validate user ID from JWT.

    This dependency:
    1. Extracts JWT token from Authorization header
    2. Validates token signature and expiration
    3. Extracts user_id from 'sub' claim
    4. Returns user_id for use in route handlers

    Args:
        credentials: HTTP Bearer credentials from Authorization header

    Returns:
        User ID (UUID string) extracted from JWT

    Raises:
        HTTPException(401): If token is missing, invalid, expired, or missing subject

    Usage in endpoints:
        @router.get("/protected")
        async def protected_route(user_id: str = Depends(get_current_user_id)):
            # user_id is now guaranteed to be valid
            return {"message": f"Hello user {user_id}"}

    Example:
        # Request with valid token
        GET /api/v1/protected HTTP/1.1
        Authorization: Bearer eyJhbGci...

        # Response
        {"message": "Hello user 550e8400-e29b-41d4-a716-446655440000"}
    """
    token = credentials.credentials

    try:
        # Decode and validate token
        payload = decode_jwt(token)

        # Extract user ID from subject claim
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject claim",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id

    except JWTError:
        # Token is invalid or expired
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        # Unexpected error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
