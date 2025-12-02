/**
 * Diagnosis Store - Zustand state management for PhysioMind CDSS.
 * 
 * Manages client-side state for the diagnosis workflow including
 * form data, loading states, and results.
 */

import { create } from 'zustand';
import type { PatientInput, DiagnosisResponse } from '@/types';

/** Initial patient input state */
const initialPatientInput: PatientInput = {
  pain_scale: 5,
  subjective: {
    chief_complaint: '',
    symptom_duration: '',
    symptom_description: '',
    aggravating_factors: '',
    relieving_factors: '',
    previous_treatments: '',
    medical_history: '',
  },
  objective: {
    affected_region: '',
    range_of_motion_notes: '',
    strength_assessment: '',
    special_tests: [],
    posture_observations: '',
    gait_analysis: '',
    palpation_findings: '',
    neurological_screening: '',
  },
  imaging_reports: '',
  additional_notes: '',
};

/** Navigation section for the sidebar */
export type SidebarSection = 'patients' | 'history' | 'settings';

/** Diagnosis store state interface */
interface DiagnosisState {
  // Form state
  patientInput: PatientInput;
  setPatientInput: (input: Partial<PatientInput>) => void;
  updateSubjective: (data: Partial<PatientInput['subjective']>) => void;
  updateObjective: (data: Partial<PatientInput['objective']>) => void;
  resetForm: () => void;
  
  // Analysis state
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  diagnosisResult: DiagnosisResponse | null;
  setDiagnosisResult: (result: DiagnosisResponse | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // UI state
  activeSidebarSection: SidebarSection;
  setActiveSidebarSection: (section: SidebarSection) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

/** Zustand store for diagnosis state */
export const useDiagnosisStore = create<DiagnosisState>((set) => ({
  // Form state
  patientInput: initialPatientInput,
  setPatientInput: (input) =>
    set((state) => ({
      patientInput: { ...state.patientInput, ...input },
    })),
  updateSubjective: (data) =>
    set((state) => ({
      patientInput: {
        ...state.patientInput,
        subjective: { ...state.patientInput.subjective, ...data },
      },
    })),
  updateObjective: (data) =>
    set((state) => ({
      patientInput: {
        ...state.patientInput,
        objective: { ...state.patientInput.objective, ...data },
      },
    })),
  resetForm: () =>
    set({
      patientInput: initialPatientInput,
      diagnosisResult: null,
      error: null,
    }),
  
  // Analysis state
  isAnalyzing: false,
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  diagnosisResult: null,
  setDiagnosisResult: (result) => set({ diagnosisResult: result }),
  error: null,
  setError: (error) => set({ error }),
  
  // UI state
  activeSidebarSection: 'patients',
  setActiveSidebarSection: (section) => set({ activeSidebarSection: section }),
  isSidebarOpen: true,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));
