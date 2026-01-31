"""
Task: T026
Spec: 010-ai-chatbot/spec.md - Official MCP Server

Official MCP server implementation for task management tools.
Uses the official mcp.server.fastmcp package with proper context management.
"""

from dataclasses import dataclass
from typing import Optional
import contextlib
from enum import Enum
from datetime import datetime
from mcp.server.fastmcp import FastMCP, Context
from sqlmodel import Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.models.task import Task
from app.models.user import User
from sqlmodel import select
import os

# Import the existing TaskPriority from the models
from app.models.task import TaskPriority


@dataclass
class AppContext:
    """Application context passed to tools via lifespan."""
    database_url: str


@contextlib.asynccontextmanager
async def app_lifespan(server: FastMCP):
    """
    Manage application lifecycle.
    Initialize resources on startup, clean up on shutdown.
    """
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        # If DATABASE_URL is not set, use the same configuration as the main backend
        database_url = "sqlite+aiosqlite:///./todo_app.db"  # Use aiosqlite for async operations

    try:
        yield AppContext(database_url=database_url)
    finally:
        # Cleanup resources if needed
        pass


# Initialize FastMCP server with lifespan
mcp = FastMCP(
    name="task-manager",
    lifespan=app_lifespan,
    stateless_http=True,
    json_response=True,
)

# Configure HTTP path (when mounted in Starlette/FastAPI)
mcp.settings.streamable_http_path = "/"


@mcp.tool(description="Create a new task in the user's task list")
async def add_task(
    user_id: str,
    title: str,
    description: Optional[str] = None,
    priority: str = "medium",
    *,
    ctx: Context,
) -> dict:
    """
    MCP tool for adding tasks to user's task list.
    Validates user permissions and creates new tasks with proper isolation.
    """
    print(f"MCP Server: add_task function called with user_id: {user_id}, title: {title}")

    # Get database URL from context
    app_context: AppContext = ctx.request_context.lifespan_context
    database_url = app_context.database_url

    # Debug: print the database URL to see what's being used
    print(f"MCP Server: Using database URL: {database_url}")

    engine = create_async_engine(database_url)

    try:
        async with AsyncSession(engine) as session:
            print(f"MCP Server: Starting session for add_task with user_id: {user_id}, title: {title}")

            # Validate user exists
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            print(f"MCP Server: User lookup result: {user is not None}")

            if not user:
                print(f"MCP Server: Creating user {user_id}")
                # Create user if they don't exist (for testing purposes)
                # In production, users should be created through auth system
                # For SQLite testing, we'll use a basic hash that satisfies NOT NULL constraint
                # In production with Neon, proper auth system will handle this
                basic_hash = "pbkdf2:sha256:260000$hash_example$valid_hash_value"

                user = User(
                    id=user_id,
                    email=f"{user_id}@example.com",
                    username=f"user_{user_id}",
                    hashed_password=basic_hash
                )
                session.add(user)
                await session.commit()
                await session.refresh(user)
                print(f"MCP Server: User created successfully")

            # Validate priority
            try:
                priority_enum = TaskPriority(priority.lower())
                print(f"MCP Server: Priority validated: {priority_enum}")
            except ValueError:
                print(f"MCP Server: Invalid priority '{priority}' provided")
                return {
                    "error": f"Invalid priority '{priority}'. Must be one of: high, medium, low"
                }

            # Create task
            print(f"MCP Server: Creating task with title: {title[:200]}")
            task = Task(
                user_id=user_id,
                title=title[:200],  # Enforce max length
                description=description[:1000] if description else None,
                priority=priority_enum,
                completed=False,
            )

            session.add(task)
            print(f"MCP Server: Task added to session, committing...")
            await session.commit()
            print(f"MCP Server: Session committed, refreshing task...")
            await session.refresh(task)
            print(f"MCP Server: Task created successfully with ID: {task.id}")

            response = {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority.value,
                "completed": task.completed,
                "created_at": task.created_at.isoformat(),
            }
            print(f"MCP Server: Returning task creation response")
            return response

    except Exception as e:
        print(f"MCP Server: Exception in add_task: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to create task: {str(e)}"}


@mcp.tool(description="Retrieve tasks from the user's task list")
async def list_tasks(
    user_id: str,
    status: str = "all",
    priority: Optional[str] = None,
    *,
    ctx: Context,
) -> dict:
    """
    List all tasks for a user with optional filtering.

    Args:
        user_id: ID of the user (UUID)
        status: Filter by status - one of: all, pending, completed (default: all)
        priority: Optional filter by priority - one of: high, medium, low, none
        category: Optional filter by category - one of: work, personal, shopping, health, other

    Returns:
        dict: List of tasks matching filters with count
    """
    print(f"MCP Server: list_tasks function called with user_id: {user_id}, status: {status}")

    # Get database URL from context
    app_context: AppContext = ctx.request_context.lifespan_context
    database_url = app_context.database_url

    # Debug: print the database URL to see what's being used
    print(f"MCP Server: Using database URL: {database_url}")

    engine = create_async_engine(database_url)

    try:
        async with AsyncSession(engine) as session:
            print(f"MCP Server: Starting session for list_tasks with user_id: {user_id}")

            # Verify user exists
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            print(f"MCP Server: User lookup result: {user is not None}")

            if not user:
                print(f"MCP Server: Creating user {user_id}")
                # Create user if they don't exist (for testing purposes)
                # In production, users should be created through auth system
                # For SQLite testing, we'll use a basic hash that satisfies NOT NULL constraint
                # In production with Neon, proper auth system will handle this
                basic_hash = "pbkdf2:sha256:260000$hash_example$valid_hash_value"

                user = User(
                    id=user_id,
                    email=f"{user_id}@example.com",
                    username=f"user_{user_id}",
                    hashed_password=basic_hash
                )
                session.add(user)
                await session.commit()
                await session.refresh(user)
                print(f"MCP Server: User created successfully")

            # Build query
            print(f"MCP Server: Building query for tasks with user_id: {user_id}")
            query = select(Task).where(Task.user_id == user_id)

            # Apply status filter
            if status == "pending":
                query = query.where(Task.completed == False)
            elif status == "completed":
                query = query.where(Task.completed == True)
            elif status != "all":
                print(f"MCP Server: Invalid status '{status}' provided")
                return {
                    "error": f"Invalid status '{status}'. Must be one of: all, pending, completed"
                }

            # Apply priority filter
            if priority:
                try:
                    priority_enum = TaskPriority(priority.lower())
                    query = query.where(Task.priority == priority_enum)
                except ValueError:
                    print(f"MCP Server: Invalid priority '{priority}' provided")
                    return {
                        "error": f"Invalid priority '{priority}'. Must be one of: high, medium, low"
                    }


            # Execute query
            print(f"MCP Server: Executing query to fetch tasks")
            query = query.order_by(Task.created_at.desc())
            result = await session.execute(query)
            tasks = result.scalars().all()
            print(f"MCP Server: Retrieved {len(tasks)} tasks")

            response = {
                "count": len(tasks),
                "tasks": [
                    {
                        "id": task.id,
                        "title": task.title,
                        "description": task.description,
                        "priority": task.priority.value,
                        "completed": task.completed,
                        "created_at": task.created_at.isoformat(),
                        "updated_at": task.updated_at.isoformat(),
                    }
                    for task in tasks
                ],
            }
            print(f"MCP Server: Returning response with {len(tasks)} tasks")
            return response

    except Exception as e:
        print(f"MCP Server: Exception in list_tasks: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": f"Failed to retrieve tasks: {str(e)}"}


@mcp.tool(description="Mark a task as complete in the user's task list")
async def complete_task(
    user_id: str,
    task_id: str,
    completed: bool = True,
    *,
    ctx: Context
) -> dict:
    """
    Mark a task as complete or incomplete.

    Args:
        user_id: ID of the user who owns the task (UUID)
        task_id: ID of the task to update
        completed: Set to True to mark complete, False to mark incomplete (default: True)

    Returns:
        dict: Updated task status
    """
    print(f"MCP Server: complete_task function called with user_id: {user_id}, task_id: {task_id}")

    # Get database URL from context
    app_context: AppContext = ctx.request_context.lifespan_context
    database_url = app_context.database_url

    # Debug: print the database URL to see what's being used
    print(f"MCP Server: Using database URL: {database_url}")

    engine = create_async_engine(database_url)

    try:
        async with AsyncSession(engine) as session:
            # Get task
            result = await session.execute(select(Task).where(Task.id == task_id))
            task = result.scalar_one_or_none()

            if not task:
                return {"error": f"Task with id {task_id} not found"}

            # Verify ownership
            if task.user_id != user_id:
                return {"error": "Not authorized to update this task"}

            # Update completion status
            task.completed = completed
            task.updated_at = datetime.utcnow()

            session.add(task)
            await session.commit()
            await session.refresh(task)

            return {
                "id": task.id,
                "title": task.title,
                "completed": task.completed,
                "updated_at": task.updated_at.isoformat(),
            }

    except Exception as e:
        return {"error": f"Failed to update task: {str(e)}"}


@mcp.tool(description="Delete a task from the user's task list")
async def delete_task(user_id: str, task_id: str, *, ctx: Context) -> dict:
    """
    Delete a task from the user's todo list.

    Args:
        user_id: ID of the user who owns the task (UUID)
        task_id: ID of the task to delete

    Returns:
        dict: Confirmation of deletion
    """
    print(f"MCP Server: delete_task function called with user_id: {user_id}, task_id: {task_id}")

    # Get database URL from context
    app_context: AppContext = ctx.request_context.lifespan_context
    database_url = app_context.database_url

    # Debug: print the database URL to see what's being used
    print(f"MCP Server: Using database URL: {database_url}")

    engine = create_async_engine(database_url)

    try:
        async with AsyncSession(engine) as session:
            # Get task
            result = await session.execute(select(Task).where(Task.id == task_id))
            task = result.scalar_one_or_none()

            if not task:
                return {"error": f"Task with id {task_id} not found"}

            # Verify ownership
            if task.user_id != user_id:
                return {"error": "Not authorized to delete this task"}

            # Delete task
            task_title = task.title
            await session.delete(task)
            await session.commit()

            return {
                "success": True,
                "message": f"Task '{task_title}' (id: {task_id}) deleted successfully",
            }

    except Exception as e:
        return {"error": f"Failed to delete task: {str(e)}"}


@mcp.tool(description="Update task details in the user's task list")
async def update_task(
    user_id: str,
    task_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    priority: Optional[str] = None,
    *,
    ctx: Context,
) -> dict:
    """
    Update task details (title, description, priority, or category).

    Args:
        user_id: ID of the user who owns the task (UUID)
        task_id: ID of the task to update
        title: New task title (optional, 1-200 characters)
        description: New task description (optional, max 1000 characters)
        priority: New priority - one of: high, medium, low, none (optional)
        category: New category - one of: work, personal, shopping, health, other (optional)

    Returns:
        dict: Updated task details
    """
    print(f"MCP Server: update_task function called with user_id: {user_id}, task_id: {task_id}")

    # Get database URL from context
    app_context: AppContext = ctx.request_context.lifespan_context
    database_url = app_context.database_url

    # Debug: print the database URL to see what's being used
    print(f"MCP Server: Using database URL: {database_url}")

    engine = create_async_engine(database_url)

    try:
        async with AsyncSession(engine) as session:
            # Get task
            result = await session.execute(select(Task).where(Task.id == task_id))
            task = result.scalar_one_or_none()

            if not task:
                return {"error": f"Task with id {task_id} not found"}

            # Verify ownership
            if task.user_id != user_id:
                return {"error": "Not authorized to update this task"}

            # Update fields
            if title is not None:
                task.title = title[:200]  # Enforce max length

            if description is not None:
                task.description = description[:1000] if description else None

            if priority is not None:
                try:
                    task.priority = TaskPriority(priority.lower())
                except ValueError:
                    return {
                        "error": f"Invalid priority '{priority}'. Must be one of: high, medium, low"
                    }


            task.updated_at = datetime.utcnow()

            session.add(task)
            await session.commit()
            await session.refresh(task)

            return {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority.value,
                "completed": task.completed,
                "updated_at": task.updated_at.isoformat(),
            }

    except Exception as e:
        return {"error": f"Failed to update task: {str(e)}"}


# Example of how to run the server with proper streamable-http transport
if __name__ == "__main__":
    import asyncio

    # Use the proper run method with streamable-http transport
    print("Starting MCP Server for task management tools...")
    print("Tools available:")
    # Note: tools are registered but not directly accessible until after server starts
    print("  - add_task")
    print("  - list_tasks")
    print("  - complete_task")
    print("  - delete_task")
    print("  - update_task")

    # Run the server with streamable-http transport using the mcp instance
    mcp.run(transport="streamable-http")