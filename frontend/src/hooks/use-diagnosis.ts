/**
 * API hooks for PhysioMind CDSS using TanStack Query.
 * 
 * Provides React hooks for interacting with the FastAPI backend.
 */

'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import type { AnalysisRequest, AnalysisResponse, PatientInput } from '@/types';

/** Base API URL - configure via environment variable */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Analyze patient data and get AI-generated diagnosis.
 */
async function analyzePatient(data: PatientInput): Promise<AnalysisResponse> {
  const request: AnalysisRequest = { patient_data: data };
  
  const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail?.message || 'Analysis failed');
  }
  
  return response.json();
}

/**
 * Check API health status.
 */
async function checkHealth(): Promise<{ status: string; service: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/health`);
  
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  
  return response.json();
}

/**
 * Hook for analyzing patient data.
 * Uses TanStack Query mutation for optimal caching and state management.
 */
export function useAnalyzePatient() {
  return useMutation({
    mutationFn: analyzePatient,
    onError: (error) => {
      console.error('Analysis error:', error);
    },
  });
}

/**
 * Hook for checking API health status.
 */
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
    staleTime: 30000, // Consider fresh for 30 seconds
    retry: 3,
    retryDelay: 1000,
  });
}
