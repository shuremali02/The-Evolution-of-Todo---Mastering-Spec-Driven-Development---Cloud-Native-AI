"""
Task: T017, T022
Spec: 002-authentication/data-model.md

Database models package.
Exports all SQLModel entities for use in application.
"""

from .user import User

__all__ = [
    "User",
    # Additional models will be added here
    # "Task",
]
