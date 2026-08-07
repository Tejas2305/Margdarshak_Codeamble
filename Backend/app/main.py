from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.reports import router as reports_router
from app.routers.emergency_contacts import router as emergency_contacts_router
from app.routers.map import router as map_router
import app.models  # noqa: F401
from app.routers.sos import router as sos_router
app = FastAPI(title="Margadarshak")
app.include_router(sos_router)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(reports_router)
app.include_router(emergency_contacts_router)
app.include_router(map_router)

@app.get("/")
async def root():
    return {"message": "backend is running"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": "Invalid content"})


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})