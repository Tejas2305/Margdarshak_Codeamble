from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession
)

from sqlalchemy.orm import (
    sessionmaker,
    declarative_base
)

from app.config import DATABASE_URL
# Create the database engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True
)

# Create a session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for all models
Base = declarative_base()


# Dependency used in APIs
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session