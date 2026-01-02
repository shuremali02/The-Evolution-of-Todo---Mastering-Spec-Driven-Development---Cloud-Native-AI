"""
Task: T014
Spec: 002-authentication/research.md - Password Hashing

Password hashing and verification using BCrypt directly.
"""

import bcrypt


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using BCrypt.

    Args:
        password: Plaintext password to hash

    Returns:
        BCrypt hashed password (includes salt)

    Example:
        >>> hashed = hash_password("mysecretpassword")
        >>> hashed.startswith("$2b$")  # BCrypt prefix
        True

    Note:
        BCrypt has a 72-byte limit. Passwords are truncated if longer.
    """
    # BCrypt has a 72-byte limit, truncate if necessary
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]

    # Generate salt and hash with 12 rounds
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)

    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a BCrypt hash.

    Args:
        plain_password: Plaintext password to verify
        hashed_password: BCrypt hash to verify against

    Returns:
        True if password matches, False otherwise

    Example:
        >>> hashed = hash_password("correct")
        >>> verify_password("correct", hashed)
        True
        >>> verify_password("wrong", hashed)
        False
    """
    # BCrypt has a 72-byte limit, truncate if necessary
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]

    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)
