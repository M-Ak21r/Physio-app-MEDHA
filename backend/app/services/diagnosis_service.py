"""Diagnosis Service for PhysioMind CDSS.

This module provides the core diagnosis functionality using
OpenAI GPT-4o with structured outputs via Pydantic models.
"""

import json
import os
from typing import Optional

from pydantic import ValidationError

from app.models import (
    DiagnosisResponse,
    Exercise,
    PatientInput,
    RiskFlag,
    RiskLevel,
    TreatmentPlan,
)


class DiagnosisService:
    """Service for generating AI-powered diagnoses.
    
    Uses OpenAI's GPT-4o model with structured outputs to generate
    evidence-based diagnostic reports for physiotherapy patients.
    """
    
    def __init__(self):
        """Initialize the diagnosis service."""
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "gpt-4o"
        self._medical_protocols: list[str] = []
        
    async def _retrieve_medical_protocols(
        self, 
        affected_region: str, 
        symptoms: str
    ) -> list[str]:
        """Simulate RAG retrieval of relevant medical protocols.
        
        In production, this would query a vector database containing
        evidence-based physiotherapy protocols and guidelines.
        
        Args:
            affected_region: The primary body region affected.
            symptoms: Description of symptoms.
            
        Returns:
            List of relevant medical protocol summaries.
        """
        # Simulated RAG retrieval - in production, this would query
        # a vector database with embeddings of medical literature
        protocols = [
            f"Evidence-based guidelines for {affected_region} conditions",
            "Clinical practice guidelines from APTA",
            "Physiotherapy outcome measures and assessment tools",
            "Red flag screening protocols for musculoskeletal conditions",
        ]
        return protocols
    
    def _build_system_prompt(self, protocols: list[str]) -> str:
        """Build the system prompt with retrieved protocols.
        
        Args:
            protocols: List of retrieved medical protocols.
            
        Returns:
            The complete system prompt for the LLM.
        """
        protocol_context = "\n".join(f"- {p}" for p in protocols)
        
        return f"""You are a clinical decision support system for physiotherapists.
Your role is to analyze patient assessment data and provide evidence-based
diagnostic suggestions and treatment plans.

IMPORTANT DISCLAIMERS:
- You are a decision SUPPORT tool, not a replacement for clinical judgment
- All suggestions must be reviewed by a qualified physiotherapist
- When in doubt, recommend referral to appropriate specialists

RETRIEVED MEDICAL PROTOCOLS:
{protocol_context}

RESPONSE REQUIREMENTS:
1. Provide differential diagnoses ranked by likelihood
2. Identify any red or yellow flags requiring immediate attention
3. Suggest a phased treatment approach (acute, recovery, maintenance)
4. Recommend appropriate therapeutic exercises with dosage
5. Base recommendations on evidence-based practice

Always err on the side of caution with risk flags."""

    def _build_user_prompt(self, patient_data: PatientInput) -> str:
        """Build the user prompt from patient data.
        
        Args:
            patient_data: The patient assessment input.
            
        Returns:
            Formatted user prompt for the LLM.
        """
        subjective = patient_data.subjective
        objective = patient_data.objective
        
        prompt = f"""PATIENT ASSESSMENT DATA

SUBJECTIVE HISTORY:
- Chief Complaint: {subjective.chief_complaint}
- Duration: {subjective.symptom_duration}
- Description: {subjective.symptom_description}
- Aggravating Factors: {subjective.aggravating_factors or 'Not specified'}
- Relieving Factors: {subjective.relieving_factors or 'Not specified'}
- Previous Treatments: {subjective.previous_treatments or 'None reported'}
- Medical History: {subjective.medical_history or 'Not specified'}

PAIN ASSESSMENT:
- Pain Scale (0-10): {patient_data.pain_scale}/10

OBJECTIVE FINDINGS:
- Affected Region: {objective.affected_region}
- Range of Motion: {objective.range_of_motion_notes or 'Not assessed'}
- Strength: {objective.strength_assessment or 'Not assessed'}
- Special Tests: {', '.join(objective.special_tests) if objective.special_tests else 'Not performed'}
- Posture: {objective.posture_observations or 'Not noted'}
- Gait: {objective.gait_analysis or 'Not assessed'}
- Palpation: {objective.palpation_findings or 'Not noted'}
- Neurological: {objective.neurological_screening or 'Not assessed'}

IMAGING REPORTS:
{patient_data.imaging_reports or 'No imaging available'}

ADDITIONAL NOTES:
{patient_data.additional_notes or 'None'}

Please analyze this assessment and provide a structured diagnostic report."""
        
        return prompt
    
    async def analyze(self, patient_data: PatientInput) -> DiagnosisResponse:
        """Analyze patient data and generate diagnosis.
        
        Uses RAG to retrieve relevant protocols, then generates
        a structured diagnostic response using GPT-4o.
        
        Args:
            patient_data: The patient assessment input data.
            
        Returns:
            DiagnosisResponse with complete diagnostic information.
            
        Raises:
            ConnectionError: If the AI service is unavailable.
            ValueError: If patient data is invalid.
        """
        # Retrieve relevant medical protocols (RAG simulation)
        protocols = await self._retrieve_medical_protocols(
            patient_data.objective.affected_region,
            patient_data.subjective.symptom_description,
        )
        
        # In production, this would call OpenAI API with structured outputs
        # For now, we generate a mock response that matches our schema
        if self.api_key:
            # Production: Call OpenAI API
            return await self._call_openai(patient_data, protocols)
        else:
            # Development: Return mock diagnosis
            return self._generate_mock_diagnosis(patient_data)
    
    async def _call_openai(
        self, 
        patient_data: PatientInput, 
        protocols: list[str]
    ) -> DiagnosisResponse:
        """Call OpenAI API with structured outputs.
        
        Args:
            patient_data: The patient assessment input.
            protocols: Retrieved medical protocols for context.
            
        Returns:
            Parsed DiagnosisResponse from the AI.
            
        Raises:
            ConnectionError: If the API call fails.
        """
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(api_key=self.api_key)
            
            system_prompt = self._build_system_prompt(protocols)
            user_prompt = self._build_user_prompt(patient_data)
            
            # Use structured outputs with response_format
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "diagnosis_response",
                        "strict": True,
                        "schema": DiagnosisResponse.model_json_schema(),
                    },
                },
                temperature=0.3,  # Lower temperature for more consistent outputs
            )
            
            content = response.choices[0].message.content
            if content:
                return DiagnosisResponse.model_validate_json(content)
            else:
                raise ConnectionError("Empty response from AI service")
            
        except ImportError:
            raise ConnectionError("OpenAI package not installed")
        except Exception as e:
            # If API call fails, fall back to mock response in development
            if os.getenv("ENVIRONMENT") == "development":
                return self._generate_mock_diagnosis(patient_data)
            raise ConnectionError(f"AI service error: {str(e)}")
    
    def _generate_mock_diagnosis(
        self, 
        patient_data: PatientInput
    ) -> DiagnosisResponse:
        """Generate a mock diagnosis for development/testing.
        
        Args:
            patient_data: The patient assessment input.
            
        Returns:
            A realistic mock DiagnosisResponse.
        """
        region = patient_data.objective.affected_region.lower()
        pain_level = patient_data.pain_scale
        
        # Generate contextual mock data based on input
        risk_flags = []
        if pain_level >= 8:
            risk_flags.append(
                RiskFlag(
                    level=RiskLevel.YELLOW,
                    description="High pain level may indicate acute condition",
                    recommended_action="Monitor closely and consider pain management referral",
                )
            )
        
        if "night" in patient_data.subjective.symptom_description.lower():
            risk_flags.append(
                RiskFlag(
                    level=RiskLevel.RED,
                    description="Night pain reported - rule out serious pathology",
                    recommended_action="Recommend medical evaluation to exclude red flags",
                )
            )
        
        exercises = [
            Exercise(
                name="Gentle Range of Motion",
                description=f"Gentle active movements of the {region}",
                sets=2,
                reps=10,
                frequency="2-3 times daily",
                precautions="Stop if pain increases significantly",
            ),
            Exercise(
                name="Isometric Strengthening",
                description="Hold muscle contraction without movement",
                sets=3,
                reps=10,
                hold_seconds=5,
                frequency="Daily",
                precautions="Maintain neutral spine position",
            ),
            Exercise(
                name="Stretching Program",
                description=f"Targeted stretches for {region} musculature",
                sets=2,
                reps=3,
                hold_seconds=30,
                frequency="2-3 times daily",
                precautions="Stretch to tension, not pain",
            ),
        ]
        
        treatment_plan = TreatmentPlan(
            acute_phase=f"Focus on pain management and protection of {region}. "
                "Apply ice/heat as appropriate. Limit aggravating activities. "
                "Consider manual therapy for pain relief.",
            recovery_phase=f"Progressive loading of {region}. Introduce "
                "strengthening exercises. Address movement dysfunctions. "
                "Work on functional restoration.",
            maintenance="Long-term exercise program for prevention. "
                "Address lifestyle factors. Self-management strategies. "
                "Periodic reassessment as needed.",
            precautions="Avoid sudden increases in activity. "
                "Progress exercises gradually based on response.",
            expected_timeline="6-12 weeks for full recovery with compliance",
        )
        
        return DiagnosisResponse(
            differential_diagnosis=[
                f"{region.title()} strain/sprain",
                f"{region.title()} mechanical dysfunction",
                f"Myofascial pain syndrome - {region}",
            ],
            primary_diagnosis=f"{region.title()} mechanical dysfunction with "
                "associated muscle guarding",
            clinical_reasoning=f"Based on the subjective history of "
                f"{patient_data.subjective.chief_complaint} with duration of "
                f"{patient_data.subjective.symptom_duration}, and objective "
                f"findings in the {region} region, the presentation is "
                "consistent with a mechanical musculoskeletal condition. "
                "The pain pattern and response to movement support this diagnosis.",
            risk_flags=risk_flags,
            treatment_plan=treatment_plan,
            suggested_exercises=exercises,
            prognosis="Good prognosis with appropriate treatment and patient compliance. "
                "Expected improvement in symptoms within 4-6 weeks.",
            follow_up_recommendations="Re-assess in 2 weeks. Progress exercises "
                "as tolerated. Consider discharge after achieving functional goals.",
            references=[
                "Clinical Practice Guidelines - APTA",
                "Evidence-based rehabilitation protocols",
            ],
        )
