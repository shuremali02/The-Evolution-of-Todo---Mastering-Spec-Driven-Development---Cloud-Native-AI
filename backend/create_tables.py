import asyncio
from app.database import engine
from sqlmodel import SQLModel
from app.models.user import User
from app.models.task import Task

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    print("✅ Users and Tasks tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())
