"""FastAPI Main Application for PhysioMind CDSS.

This module initializes the FastAPI application with all routes,
middleware, and configuration for the Clinical Decision Support System.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analyze_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events."""
    # Startup
    print("PhysioMind CDSS starting up...")
    yield
    # Shutdown
    print("PhysioMind CDSS shutting down...")


app = FastAPI(
    title="PhysioMind CDSS API",
    description="""
    Clinical Decision Support System for Physiotherapists.
    
    PhysioMind helps physiotherapists generate evidence-based diagnostic
    reports and treatment plans using AI-powered analysis of patient data.
    
    ## Features
    
    - **AI-Powered Diagnosis**: Analyze patient symptoms and findings
    - **Structured Treatment Plans**: Phased approach to rehabilitation
    - **Risk Flag Detection**: Identify red and yellow flags
    - **Exercise Recommendations**: Evidence-based therapeutic exercises
    
    ## Important Disclaimer
    
    This is a clinical decision SUPPORT tool and does not replace
    professional clinical judgment. All AI-generated suggestions
    must be reviewed by qualified healthcare professionals.
    """,
    version="0.1.0",
    contact={
        "name": "PhysioMind Development Team",
        "email": "support@physiomind.example.com",
    },
    license_info={
        "name": "MIT",
    },
    lifespan=lifespan,
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze_router)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint providing API information."""
    return {
        "name": "PhysioMind CDSS API",
        "version": "0.1.0",
        "status": "operational",
        "documentation": "/docs",
    }
