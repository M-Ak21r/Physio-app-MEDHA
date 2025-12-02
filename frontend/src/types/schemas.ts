/**
 * TypeScript interfaces for PhysioMind CDSS.
 * 
 * These interfaces mirror the Pydantic models in the backend,
 * providing a single source of truth for the API contract.
 */

/** Risk flag severity levels */
export type RiskLevel = 'red' | 'yellow' | 'green';

/** Patient's subjective history and symptoms */
export interface SubjectiveHistory {
  /** Primary reason for visit */
  chief_complaint: string;
  /** How long symptoms have been present */
  symptom_duration: string;
  /** Detailed description of symptoms */
  symptom_description: string;
  /** Activities or movements that worsen symptoms */
  aggravating_factors?: string;
  /** Activities or treatments that reduce symptoms */
  relieving_factors?: string;
  /** Previous treatments attempted */
  previous_treatments?: string;
  /** Relevant medical history */
  medical_history?: string;
}

/** Objective clinical findings from physical examination */
export interface ObjectiveFindings {
  /** Primary body region affected */
  affected_region: string;
  /** Range of motion assessment findings */
  range_of_motion_notes?: string;
  /** Muscle strength findings */
  strength_assessment?: string;
  /** Special tests performed and results */
  special_tests?: string[];
  /** Postural assessment notes */
  posture_observations?: string;
  /** Gait pattern observations */
  gait_analysis?: string;
  /** Findings from palpation */
  palpation_findings?: string;
  /** Neurological screening results */
  neurological_screening?: string;
}

/** Complete patient assessment input */
export interface PatientInput {
  /** Optional patient identifier */
  patient_id?: string;
  /** Pain intensity on 0-10 scale */
  pain_scale: number;
  /** Subjective history */
  subjective: SubjectiveHistory;
  /** Objective findings */
  objective: ObjectiveFindings;
  /** Summary of any imaging reports */
  imaging_reports?: string;
  /** Any additional clinical notes */
  additional_notes?: string;
}

/** Suggested therapeutic exercise */
export interface Exercise {
  /** Exercise name */
  name: string;
  /** How to perform the exercise */
  description?: string;
  /** Number of sets */
  sets: number;
  /** Number of repetitions per set */
  reps: number;
  /** Hold duration in seconds if applicable */
  hold_seconds?: number;
  /** How often to perform */
  frequency?: string;
  /** Important precautions or contraindications */
  precautions?: string;
}

/** Clinical risk flag indicating potential concerns */
export interface RiskFlag {
  /** Severity level of the risk flag */
  level: RiskLevel;
  /** Description of the risk concern */
  description: string;
  /** Recommended follow-up action */
  recommended_action?: string;
}

/** Structured treatment plan with phased approach */
export interface TreatmentPlan {
  /** Acute phase treatment recommendations (0-2 weeks) */
  acute_phase: string;
  /** Recovery phase treatment recommendations (2-8 weeks) */
  recovery_phase: string;
  /** Long-term maintenance recommendations */
  maintenance: string;
  /** General precautions and contraindications */
  precautions?: string;
  /** Expected recovery timeline */
  expected_timeline?: string;
}

/** AI-generated diagnostic response */
export interface DiagnosisResponse {
  /** List of possible diagnoses in order of likelihood */
  differential_diagnosis: string[];
  /** Most likely diagnosis based on findings */
  primary_diagnosis: string;
  /** Explanation of diagnostic reasoning */
  clinical_reasoning: string;
  /** List of clinical risk flags */
  risk_flags: RiskFlag[];
  /** Structured treatment plan */
  treatment_plan: TreatmentPlan;
  /** List of suggested therapeutic exercises */
  suggested_exercises: Exercise[];
  /** Expected outcome with treatment */
  prognosis?: string;
  /** Recommendations for follow-up care */
  follow_up_recommendations?: string;
  /** Evidence-based references used in analysis */
  references?: string[];
}

/** Request wrapper for patient analysis */
export interface AnalysisRequest {
  /** The patient input data */
  patient_data: PatientInput;
}

/** Response wrapper for analysis results */
export interface AnalysisResponse {
  /** Whether the analysis was successful */
  success: boolean;
  /** The diagnostic response */
  diagnosis: DiagnosisResponse;
  /** Time taken to process the request in milliseconds */
  processing_time_ms?: number;
  /** AI model version used for analysis */
  model_version?: string;
}

/** Standardized error response */
export interface ErrorResponse {
  /** Always false for error responses */
  success: false;
  /** Machine-readable error code */
  error_code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}
