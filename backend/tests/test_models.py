"""Tests for Pydantic data models."""

import pytest
from pydantic import ValidationError

from app.models import (
    DiagnosisResponse,
    Exercise,
    ObjectiveFindings,
    PatientInput,
    RiskFlag,
    RiskLevel,
    SubjectiveHistory,
    TreatmentPlan,
)


class TestSubjectiveHistory:
    """Tests for SubjectiveHistory model."""
    
    def test_valid_subjective_history(self):
        """Test creating a valid SubjectiveHistory."""
        history = SubjectiveHistory(
            chief_complaint="Lower back pain",
            symptom_duration="2 weeks",
            symptom_description="Sharp pain in lower back with radiation to left leg",
            aggravating_factors="Sitting for long periods",
            relieving_factors="Lying down",
        )
        assert history.chief_complaint == "Lower back pain"
        assert history.symptom_duration == "2 weeks"
    
    def test_missing_required_fields(self):
        """Test that missing required fields raise ValidationError."""
        with pytest.raises(ValidationError):
            SubjectiveHistory(
                chief_complaint="Pain",
                # Missing symptom_duration and symptom_description
            )
    
    def test_empty_chief_complaint(self):
        """Test that empty chief complaint raises ValidationError."""
        with pytest.raises(ValidationError):
            SubjectiveHistory(
                chief_complaint="",
                symptom_duration="1 week",
                symptom_description="Some pain",
            )


class TestObjectiveFindings:
    """Tests for ObjectiveFindings model."""
    
    def test_valid_objective_findings(self):
        """Test creating valid ObjectiveFindings."""
        findings = ObjectiveFindings(
            affected_region="Lumbar spine",
            range_of_motion_notes="Decreased flexion",
            strength_assessment="4/5 hip flexors",
            special_tests=["SLR positive", "Slump negative"],
        )
        assert findings.affected_region == "Lumbar spine"
        assert len(findings.special_tests) == 2
    
    def test_minimal_required_fields(self):
        """Test with only required fields."""
        findings = ObjectiveFindings(affected_region="Knee")
        assert findings.affected_region == "Knee"
        assert findings.range_of_motion_notes is None


class TestPatientInput:
    """Tests for PatientInput model."""
    
    def test_valid_patient_input(self):
        """Test creating a valid PatientInput."""
        patient = PatientInput(
            pain_scale=7,
            subjective=SubjectiveHistory(
                chief_complaint="Shoulder pain",
                symptom_duration="3 days",
                symptom_description="Aching in right shoulder",
            ),
            objective=ObjectiveFindings(
                affected_region="Right shoulder",
            ),
        )
        assert patient.pain_scale == 7
        assert patient.subjective.chief_complaint == "Shoulder pain"
    
    def test_pain_scale_validation(self):
        """Test that pain scale must be 0-10."""
        with pytest.raises(ValidationError):
            PatientInput(
                pain_scale=11,  # Invalid - max is 10
                subjective=SubjectiveHistory(
                    chief_complaint="Pain",
                    symptom_duration="1 day",
                    symptom_description="Pain description",
                ),
                objective=ObjectiveFindings(affected_region="Back"),
            )
    
    def test_negative_pain_scale(self):
        """Test that negative pain scale is invalid."""
        with pytest.raises(ValidationError):
            PatientInput(
                pain_scale=-1,
                subjective=SubjectiveHistory(
                    chief_complaint="Pain",
                    symptom_duration="1 day",
                    symptom_description="Pain description",
                ),
                objective=ObjectiveFindings(affected_region="Back"),
            )


class TestExercise:
    """Tests for Exercise model."""
    
    def test_valid_exercise(self):
        """Test creating a valid Exercise."""
        exercise = Exercise(
            name="Quad sets",
            description="Tighten thigh muscles",
            sets=3,
            reps=10,
            hold_seconds=5,
            frequency="3x daily",
        )
        assert exercise.name == "Quad sets"
        assert exercise.sets == 3
        assert exercise.reps == 10
    
    def test_exercise_validation(self):
        """Test exercise validation constraints."""
        with pytest.raises(ValidationError):
            Exercise(
                name="Invalid exercise",
                sets=0,  # Invalid - min is 1
                reps=10,
            )


class TestRiskFlag:
    """Tests for RiskFlag model."""
    
    def test_red_flag(self):
        """Test creating a red risk flag."""
        flag = RiskFlag(
            level=RiskLevel.RED,
            description="Cauda equina symptoms",
            recommended_action="Immediate referral to ER",
        )
        assert flag.level == RiskLevel.RED
        assert "Cauda equina" in flag.description
    
    def test_yellow_flag(self):
        """Test creating a yellow risk flag."""
        flag = RiskFlag(
            level=RiskLevel.YELLOW,
            description="Fear avoidance behavior",
            recommended_action="Consider psychological referral",
        )
        assert flag.level == RiskLevel.YELLOW


class TestDiagnosisResponse:
    """Tests for DiagnosisResponse model."""
    
    def test_valid_diagnosis_response(self):
        """Test creating a valid DiagnosisResponse."""
        response = DiagnosisResponse(
            differential_diagnosis=[
                "Lumbar strain",
                "Disc herniation",
                "Facet joint dysfunction",
            ],
            primary_diagnosis="Lumbar strain",
            clinical_reasoning="Based on mechanism of injury and exam findings",
            risk_flags=[],
            treatment_plan=TreatmentPlan(
                acute_phase="Rest and ice",
                recovery_phase="Progressive strengthening",
                maintenance="Core stability program",
            ),
            suggested_exercises=[
                Exercise(name="Bridging", sets=3, reps=10),
                Exercise(name="Bird-dog", sets=3, reps=10),
            ],
        )
        assert len(response.differential_diagnosis) == 3
        assert response.primary_diagnosis == "Lumbar strain"
        assert len(response.suggested_exercises) == 2
    
    def test_empty_differential_invalid(self):
        """Test that empty differential diagnosis is invalid."""
        with pytest.raises(ValidationError):
            DiagnosisResponse(
                differential_diagnosis=[],  # Invalid - needs at least 1
                primary_diagnosis="Something",
                clinical_reasoning="Reasoning",
                treatment_plan=TreatmentPlan(
                    acute_phase="Phase 1",
                    recovery_phase="Phase 2",
                    maintenance="Phase 3",
                ),
            )
