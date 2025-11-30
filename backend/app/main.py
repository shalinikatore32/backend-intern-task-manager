# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import users, tasks

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",         
    redoc_url="/redoc",      
)

# Allow frontend (Next.js) to call this API
origins = [
   settings.BACKEND_CORS_ORIGINS
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(tasks.router)

@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok"}

# Run with: uvicorn app.main:app --reload
