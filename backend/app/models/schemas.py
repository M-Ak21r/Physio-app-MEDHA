"""Pydantic Data Schemas for PhysioMind CDSS.

These schemas define the contract between frontend and backend,
providing type safety and validation for the AI workflow.
"""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    """Risk flag severity levels."""

    RED = "red"
    YELLOW = "yellow"
    GREEN = "green"


class SubjectiveHistory(BaseModel):
    """Patient's subjective history and symptoms.
    
    Captures the patient's description of their condition,
    including symptom duration, character, and aggravating factors.
    """

    chief_complaint: str = Field(
        ...,
        description="Primary reason for visit",
        min_length=1,
        max_length=500,
    )
    symptom_duration: str = Field(
        ...,
        description="How long symptoms have been present",
        max_length=100,
    )
    symptom_description: str = Field(
        ...,
        description="Detailed description of symptoms",
        max_length=2000,
    )
    aggravating_factors: Optional[str] = Field(
        None,
        description="Activities or movements that worsen symptoms",
        max_length=500,
    )
    relieving_factors: Optional[str] = Field(
        None,
        description="Activities or treatments that reduce symptoms",
        max_length=500,
    )
    previous_treatments: Optional[str] = Field(
        None,
        description="Previous treatments attempted",
        max_length=1000,
    )
    medical_history: Optional[str] = Field(
        None,
        description="Relevant medical history",
        max_length=1000,
    )


class ObjectiveFindings(BaseModel):
    """Objective clinical findings from physical examination.
    
    Contains measurable observations from the physiotherapist's
    assessment, including range of motion, strength, and special tests.
    """

    affected_region: str = Field(
        ...,
        description="Primary body region affected",
        max_length=100,
    )
    range_of_motion_notes: Optional[str] = Field(
        None,
        description="Range of motion assessment findings",
        max_length=1000,
    )
    strength_assessment: Optional[str] = Field(
        None,
        description="Muscle strength findings",
        max_length=1000,
    )
    special_tests: Optional[list[str]] = Field(
        None,
        description="Special tests performed and results",
    )
    posture_observations: Optional[str] = Field(
        None,
        description="Postural assessment notes",
        max_length=500,
    )
    gait_analysis: Optional[str] = Field(
        None,
        description="Gait pattern observations",
        max_length=500,
    )
    palpation_findings: Optional[str] = Field(
        None,
        description="Findings from palpation",
        max_length=500,
    )
    neurological_screening: Optional[str] = Field(
        None,
        description="Neurological screening results",
        max_length=500,
    )


class PatientInput(BaseModel):
    """Complete patient assessment input.
    
    Combines subjective history and objective findings with
    pain assessment for comprehensive clinical evaluation.
    """

    patient_id: Optional[str] = Field(
        None,
        description="Optional patient identifier",
        max_length=50,
    )
    pain_scale: int = Field(
        ...,
        ge=0,
        le=10,
        description="Pain intensity on 0-10 scale",
    )
    subjective: SubjectiveHistory
    objective: ObjectiveFindings
    imaging_reports: Optional[str] = Field(
        None,
        description="Summary of any imaging reports (X-ray, MRI, etc.)",
        max_length=2000,
    )
    additional_notes: Optional[str] = Field(
        None,
        description="Any additional clinical notes",
        max_length=1000,
    )


class Exercise(BaseModel):
    """Suggested therapeutic exercise.
    
    Defines a specific exercise with dosage parameters
    for the treatment plan.
    """

    name: str = Field(
        ...,
        description="Exercise name",
        max_length=100,
    )
    description: Optional[str] = Field(
        None,
        description="How to perform the exercise",
        max_length=500,
    )
    sets: int = Field(
        ...,
        ge=1,
        le=10,
        description="Number of sets",
    )
    reps: int = Field(
        ...,
        ge=1,
        le=50,
        description="Number of repetitions per set",
    )
    hold_seconds: Optional[int] = Field(
        None,
        ge=1,
        le=60,
        description="Hold duration in seconds if applicable",
    )
    frequency: Optional[str] = Field(
        None,
        description="How often to perform (e.g., '2x daily')",
        max_length=50,
    )
    precautions: Optional[str] = Field(
        None,
        description="Important precautions or contraindications",
        max_length=200,
    )


class RiskFlag(BaseModel):
    """Clinical risk flag indicating potential concerns.
    
    Highlights important clinical findings that require
    attention or further investigation.
    """

    level: RiskLevel = Field(
        ...,
        description="Severity level of the risk flag",
    )
    description: str = Field(
        ...,
        description="Description of the risk concern",
        max_length=500,
    )
    recommended_action: Optional[str] = Field(
        None,
        description="Recommended follow-up action",
        max_length=300,
    )


class TreatmentPlan(BaseModel):
    """Structured treatment plan with phased approach.
    
    Organizes treatment into acute, recovery, and maintenance
    phases for comprehensive rehabilitation planning.
    """

    acute_phase: str = Field(
        ...,
        description="Acute phase treatment recommendations (0-2 weeks)",
        max_length=1000,
    )
    recovery_phase: str = Field(
        ...,
        description="Recovery phase treatment recommendations (2-8 weeks)",
        max_length=1000,
    )
    maintenance: str = Field(
        ...,
        description="Long-term maintenance recommendations",
        max_length=1000,
    )
    precautions: Optional[str] = Field(
        None,
        description="General precautions and contraindications",
        max_length=500,
    )
    expected_timeline: Optional[str] = Field(
        None,
        description="Expected recovery timeline",
        max_length=200,
    )


class DiagnosisResponse(BaseModel):
    """AI-generated diagnostic response.
    
    Contains the complete diagnostic output including
    differential diagnosis, risk flags, treatment plan,
    and suggested exercises.
    """

    differential_diagnosis: list[str] = Field(
        ...,
        description="List of possible diagnoses in order of likelihood",
        min_length=1,
    )
    primary_diagnosis: str = Field(
        ...,
        description="Most likely diagnosis based on findings",
        max_length=200,
    )
    clinical_reasoning: str = Field(
        ...,
        description="Explanation of diagnostic reasoning",
        max_length=2000,
    )
    risk_flags: list[RiskFlag] = Field(
        default_factory=list,
        description="List of clinical risk flags",
    )
    treatment_plan: TreatmentPlan = Field(
        ...,
        description="Structured treatment plan",
    )
    suggested_exercises: list[Exercise] = Field(
        default_factory=list,
        description="List of suggested therapeutic exercises",
    )
    prognosis: Optional[str] = Field(
        None,
        description="Expected outcome with treatment",
        max_length=500,
    )
    follow_up_recommendations: Optional[str] = Field(
        None,
        description="Recommendations for follow-up care",
        max_length=500,
    )
    references: Optional[list[str]] = Field(
        None,
        description="Evidence-based references used in analysis",
    )


class AnalysisRequest(BaseModel):
    """Request wrapper for patient analysis.
    
    Contains the patient input data for the AI analysis endpoint.
    """

    patient_data: PatientInput


class AnalysisResponse(BaseModel):
    """Response wrapper for analysis results.
    
    Contains the diagnosis response along with metadata
    about the analysis process.
    """

    success: bool = Field(
        ...,
        description="Whether the analysis was successful",
    )
    diagnosis: DiagnosisResponse = Field(
        ...,
        description="The diagnostic response",
    )
    processing_time_ms: Optional[float] = Field(
        None,
        description="Time taken to process the request in milliseconds",
    )
    model_version: Optional[str] = Field(
        None,
        description="AI model version used for analysis",
    )


class ErrorResponse(BaseModel):
    """Standardized error response.
    
    Provides consistent error formatting for API responses.
    """

    success: bool = Field(
        default=False,
        description="Always False for error responses",
    )
    error_code: str = Field(
        ...,
        description="Machine-readable error code",
    )
    message: str = Field(
        ...,
        description="Human-readable error message",
    )
    details: Optional[dict] = Field(
        None,
        description="Additional error details",
    )
