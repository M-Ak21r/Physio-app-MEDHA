"""Tests for analyze endpoint."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


class TestHealthEndpoint:
    """Tests for health check endpoint."""
    
    def test_health_check(self):
        """Test that health check returns healthy status."""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "PhysioMind CDSS"


class TestRootEndpoint:
    """Tests for root endpoint."""
    
    def test_root(self):
        """Test that root endpoint returns API info."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "PhysioMind CDSS API"
        assert "version" in data
        assert data["status"] == "operational"


class TestAnalyzeEndpoint:
    """Tests for /analyze endpoint."""
    
    @pytest.fixture
    def valid_patient_data(self):
        """Return valid patient input data."""
        return {
            "patient_data": {
                "pain_scale": 6,
                "subjective": {
                    "chief_complaint": "Lower back pain",
                    "symptom_duration": "2 weeks",
                    "symptom_description": "Dull aching pain in lower back",
                    "aggravating_factors": "Sitting",
                    "relieving_factors": "Walking",
                },
                "objective": {
                    "affected_region": "Lumbar spine",
                    "range_of_motion_notes": "Decreased flexion to 50%",
                    "strength_assessment": "4/5 bilateral hip flexors",
                    "special_tests": ["SLR negative bilaterally"],
                },
            }
        }
    
    def test_analyze_valid_input(self, valid_patient_data):
        """Test analyze endpoint with valid input."""
        response = client.post("/api/v1/analyze", json=valid_patient_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "diagnosis" in data
        assert "differential_diagnosis" in data["diagnosis"]
        assert "treatment_plan" in data["diagnosis"]
        assert "suggested_exercises" in data["diagnosis"]
    
    def test_analyze_missing_required_fields(self):
        """Test analyze endpoint with missing required fields."""
        invalid_data = {
            "patient_data": {
                "pain_scale": 5,
                # Missing subjective and objective
            }
        }
        response = client.post("/api/v1/analyze", json=invalid_data)
        assert response.status_code == 422  # Validation error
    
    def test_analyze_invalid_pain_scale(self, valid_patient_data):
        """Test analyze endpoint with invalid pain scale."""
        valid_patient_data["patient_data"]["pain_scale"] = 15
        response = client.post("/api/v1/analyze", json=valid_patient_data)
        assert response.status_code == 422
    
    def test_analyze_response_structure(self, valid_patient_data):
        """Test that analyze response has correct structure."""
        response = client.post("/api/v1/analyze", json=valid_patient_data)
        assert response.status_code == 200
        
        data = response.json()
        diagnosis = data["diagnosis"]
        
        # Check diagnosis structure
        assert isinstance(diagnosis["differential_diagnosis"], list)
        assert len(diagnosis["differential_diagnosis"]) > 0
        assert "primary_diagnosis" in diagnosis
        assert "clinical_reasoning" in diagnosis
        
        # Check treatment plan structure
        treatment = diagnosis["treatment_plan"]
        assert "acute_phase" in treatment
        assert "recovery_phase" in treatment
        assert "maintenance" in treatment
        
        # Check exercises structure
        exercises = diagnosis["suggested_exercises"]
        assert isinstance(exercises, list)
        for exercise in exercises:
            assert "name" in exercise
            assert "sets" in exercise
            assert "reps" in exercise
