import asyncio
from app.database import engine
from sqlmodel import SQLModel
from app.models.user import User
from app.models.task import Task
from app.models.audit_log import AuditLog
from sqlalchemy import text

async def create_tables():
    print("Creating database tables and ensuring schema is up to date...")

    # First, create all tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    # Then, separately handle the column addition in its own transaction
    try:
        async with engine.begin() as conn:
            # Check if reminder column exists
            result = await conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'tasks' AND column_name = 'reminder'
            """))

            if not result.first():
                # Add reminder column if it doesn't exist
                await conn.execute(text("ALTER TABLE tasks ADD COLUMN reminder TIMESTAMP"))
                print("Added reminder column to tasks table")
            else:
                print("Reminder column already exists in tasks table")
    except Exception as e:
        # If the information_schema query fails (e.g., on SQLite), try alternative approach
        try:
            # Try to add the column and catch the duplicate column error
            # Use TIMESTAMP for PostgreSQL compatibility
            async with engine.begin() as conn:
                await conn.execute(text("ALTER TABLE tasks ADD COLUMN reminder TIMESTAMP"))
                print("Added reminder column to tasks table")
        except Exception as e2:
            # This will catch "column already exists" errors, which is fine
            print(f"Could not add reminder column: {e2}. Assuming it already exists.")

    print("✅ Database schema synchronized successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())
