"""
Task: T006
Spec: 002-authentication/plan.md - FastAPI Application Setup

FastAPI application entry point with CORS middleware for Phase-2 web application.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create FastAPI application
app = FastAPI(
    title="Hackathon Todo API",
    description="Multi-user task management API with JWT authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
# Allow frontend (Next.js) to make requests from different origin
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,  # Required for httpOnly cookies
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "hackathon-todo-api"}


# Root endpoint
@app.get("/")
async def root():
    """API root endpoint."""
    return {
        "message": "Hackathon Todo API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


# Register API routers here
from app.api import auth_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.tasks import router as tasks_router  # Task: T019

app.include_router(auth_router)
# Include dashboard routes first to avoid conflicts with /tasks/{task_id}
app.include_router(dashboard_router, prefix="/api/v1")  # Dashboard endpoints
app.include_router(tasks_router)  # Task: T019
