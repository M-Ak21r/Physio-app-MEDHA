/**
 * Zod validation schemas for PhysioMind CDSS.
 * 
 * These schemas provide runtime validation for form data
 * before submission to the backend API.
 */

import { z } from 'zod';

/** Subjective history validation schema */
export const SubjectiveHistorySchema = z.object({
  chief_complaint: z
    .string()
    .min(1, 'Chief complaint is required')
    .max(500, 'Chief complaint must be less than 500 characters'),
  symptom_duration: z
    .string()
    .min(1, 'Symptom duration is required')
    .max(100, 'Symptom duration must be less than 100 characters'),
  symptom_description: z
    .string()
    .min(1, 'Symptom description is required')
    .max(2000, 'Symptom description must be less than 2000 characters'),
  aggravating_factors: z
    .string()
    .max(500, 'Aggravating factors must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  relieving_factors: z
    .string()
    .max(500, 'Relieving factors must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  previous_treatments: z
    .string()
    .max(1000, 'Previous treatments must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  medical_history: z
    .string()
    .max(1000, 'Medical history must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

/** Objective findings validation schema */
export const ObjectiveFindingsSchema = z.object({
  affected_region: z
    .string()
    .min(1, 'Affected region is required')
    .max(100, 'Affected region must be less than 100 characters'),
  range_of_motion_notes: z
    .string()
    .max(1000, 'ROM notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  strength_assessment: z
    .string()
    .max(1000, 'Strength assessment must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  special_tests: z.array(z.string()).optional(),
  posture_observations: z
    .string()
    .max(500, 'Posture observations must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  gait_analysis: z
    .string()
    .max(500, 'Gait analysis must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  palpation_findings: z
    .string()
    .max(500, 'Palpation findings must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  neurological_screening: z
    .string()
    .max(500, 'Neurological screening must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

/** Complete patient input validation schema */
export const PatientInputSchema = z.object({
  patient_id: z
    .string()
    .max(50, 'Patient ID must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  pain_scale: z
    .number()
    .int('Pain scale must be a whole number')
    .min(0, 'Pain scale must be at least 0')
    .max(10, 'Pain scale must be at most 10'),
  subjective: SubjectiveHistorySchema,
  objective: ObjectiveFindingsSchema,
  imaging_reports: z
    .string()
    .max(2000, 'Imaging reports must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  additional_notes: z
    .string()
    .max(1000, 'Additional notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

/** Type inference from Zod schemas */
export type SubjectiveHistoryInput = z.infer<typeof SubjectiveHistorySchema>;
export type ObjectiveFindingsInput = z.infer<typeof ObjectiveFindingsSchema>;
export type PatientInputForm = z.infer<typeof PatientInputSchema>;

/** Validate patient input data */
export function validatePatientInput(data: unknown) {
  return PatientInputSchema.safeParse(data);
}
