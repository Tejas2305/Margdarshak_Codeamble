from fastapi import FastAPI

from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
import app.models  # noqa: F401

app = FastAPI(title="Margadarshak")


@app.on_event("startup")
async def on_startup():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)


app.include_router(auth_router)
app.include_router(user_router)

@app.get("/")
async def root():
    return {"message": "backend is running"}