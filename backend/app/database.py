"""
Task: T007
Spec: 002-authentication/data-model.md - Database Connection

SQLModel async session management for Neon PostgreSQL database.
"""

import os
from pathlib import Path
from sqlmodel import create_engine, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from typing import AsyncGenerator

# Load environment variables from .env file
from dotenv import load_dotenv

# Get the backend directory path
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / '.env'

# Load .env file if it exists
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create async engine for Neon PostgreSQL
# echo=True enables SQL query logging (set to False in production)
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get async database session.

    Usage in FastAPI endpoints:
        @router.get("/endpoint")
        async def endpoint(session: AsyncSession = Depends(get_session)):
            # Use session here
            pass

    Yields:
        AsyncSession: SQLAlchemy async session
    """
    async with async_session_maker() as session:
        yield session


async def init_db():
    """
    Initialize database tables.

    Note: In production, use Alembic migrations instead.
    This is useful for testing or initial setup.
    """
    from sqlmodel import SQLModel

    async with engine.begin() as conn:
        # Create all tables defined in SQLModel models
        await conn.run_sync(SQLModel.metadata.create_all)
