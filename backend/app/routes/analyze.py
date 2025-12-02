"""Analyze endpoint for PhysioMind CDSS.

This module provides the main /analyze endpoint that processes
patient data and returns AI-generated diagnostic reports.
"""

import time
from typing import Any

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from app.models import (
    AnalysisRequest,
    AnalysisResponse,
    DiagnosisResponse,
    ErrorResponse,
)
from app.services.diagnosis_service import DiagnosisService

router = APIRouter(prefix="/api/v1", tags=["Analysis"])

diagnosis_service = DiagnosisService()


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={
        200: {"description": "Successful analysis", "model": AnalysisResponse},
        400: {"description": "Invalid input", "model": ErrorResponse},
        500: {"description": "Internal server error", "model": ErrorResponse},
        503: {"description": "AI service unavailable", "model": ErrorResponse},
    },
    summary="Analyze patient data and generate diagnosis",
    description="""
    Accepts patient assessment data including subjective history,
    objective findings, and pain scale. Returns an AI-generated
    diagnostic report with differential diagnosis, risk flags,
    treatment plan, and suggested exercises.
    
    The endpoint uses a RAG pipeline to retrieve relevant medical
    protocols before generating the response.
    """,
)
async def analyze_patient_data(request: AnalysisRequest) -> Any:
    """Process patient data and generate AI-powered diagnosis.
    
    Args:
        request: The analysis request containing patient data.
        
    Returns:
        AnalysisResponse with diagnostic information.
        
    Raises:
        HTTPException: For validation errors or service failures.
    """
    start_time = time.time()
    
    try:
        # Process the diagnosis using the service
        diagnosis: DiagnosisResponse = await diagnosis_service.analyze(
            request.patient_data
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        return AnalysisResponse(
            success=True,
            diagnosis=diagnosis,
            processing_time_ms=round(processing_time, 2),
            model_version="gpt-4o-2024-01-25",
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error_code": "VALIDATION_ERROR",
                "message": str(e),
            },
        )
    except ConnectionError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "success": False,
                "error_code": "AI_SERVICE_UNAVAILABLE",
                "message": "The AI service is currently unavailable. Please try again later.",
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error_code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred during analysis.",
                "details": {"error": str(e)} if str(e) else None,
            },
        )


@router.get("/health", summary="Health check endpoint")
async def health_check() -> dict[str, str]:
    """Return service health status."""
    return {"status": "healthy", "service": "PhysioMind CDSS"}
