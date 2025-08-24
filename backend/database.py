from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os
from typing import AsyncGenerator

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./spec2lab.db")

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    future=True
)

# Create async session factory
async_session = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def create_db_and_tables():
    """Create database tables if they don't exist."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session for FastAPI endpoints."""
    async with async_session() as session:
        yield session

async def close_db():
    """Close database connections."""
    await engine.dispose()