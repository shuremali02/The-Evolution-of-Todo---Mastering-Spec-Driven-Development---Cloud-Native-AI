"""
Task: T015
Spec: 002-authentication/contracts/jwt-spec.md

JWT token creation and validation using python-jose.
"""

import os
from datetime import datetime, timedelta
from typing import Dict
from jose import JWTError, jwt

# JWT Configuration from environment
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Validate secret key is set
if not JWT_SECRET_KEY:
    raise ValueError(
        "JWT_SECRET_KEY environment variable is not set. "
        "Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
    )


def create_access_token(user_id: str) -> str:
    """
    Generate a JWT access token for authenticated user.

    Args:
        user_id: User UUID to include in token subject (sub claim)

    Returns:
        Encoded JWT token string

    Example:
        >>> token = create_access_token("550e8400-e29b-41d4-a716-446655440000")
        >>> token.startswith("eyJ")  # JWT prefix
        True
    """
    # Calculate expiration time
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)

    # Create payload with required claims
    to_encode = {
        "sub": user_id,  # Subject (user ID)
        "exp": expire,  # Expiration time
        "iat": datetime.utcnow()  # Issued at time
    }

    # Encode and return JWT
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def decode_jwt(token: str) -> Dict[str, any]:
    """
    Decode and validate a JWT token.

    Args:
        token: JWT token string to decode

    Returns:
        Decoded payload dictionary with claims

    Raises:
        JWTError: If token is invalid, expired, or signature verification fails

    Example:
        >>> token = create_access_token("user-id")
        >>> payload = decode_jwt(token)
        >>> payload["sub"]
        'user-id'
    """
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError as e:
        # Re-raise JWTError for caller to handle
        raise e
