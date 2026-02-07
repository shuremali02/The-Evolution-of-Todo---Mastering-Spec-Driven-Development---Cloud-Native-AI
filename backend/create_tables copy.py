import asyncio
from app.database import engine
from sqlmodel import SQLModel
from app.models.user import User
from app.models.task import Task
from app.models.conversation import Conversation
from app.models.message import Message

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    print("✅ Users, Tasks, Conversations, and Messages tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())
