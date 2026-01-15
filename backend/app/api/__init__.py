"""
Task: T019
Spec: 002-authentication

API routers package.
Organizes all API route handlers.
"""

# Import routers here as they are created
from .auth import router as auth_router
# Example: from .tasks import router as tasks_router

__all__ = [
    # API routers
    "auth_router",
    # "dashboard_router",  # Now imported directly in main.py
    # "tasks_router",  # To be added later
]
