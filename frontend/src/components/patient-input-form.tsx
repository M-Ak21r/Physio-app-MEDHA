'use client';

/**
 * PatientInputForm - Complex form for capturing patient assessment data.
 * 
 * Includes subjective history, pain scale, and objective findings.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Stethoscope, 
  Activity, 
  AlertCircle,
  Send,
  RotateCcw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useDiagnosisStore } from '@/stores';
import { useAnalyzePatient } from '@/hooks';

/** Common special tests for musculoskeletal assessment */
const COMMON_SPECIAL_TESTS = [
  'SLR (Straight Leg Raise)',
  'Slump Test',
  'FABER Test',
  'Patrick\'s Test',
  'Phalen\'s Test',
  'Tinel\'s Sign',
  'Spurling\'s Test',
  'Hawkins-Kennedy Test',
  'Neer\'s Impingement',
  'Empty Can Test',
  'McMurray\'s Test',
  'Lachman\'s Test',
  'Anterior Drawer Test',
];

/** Animation variants */
const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export function PatientInputForm() {
  const {
    patientInput,
    setPatientInput,
    updateSubjective,
    updateObjective,
    resetForm,
    setIsAnalyzing,
    setDiagnosisResult,
    setError,
    isAnalyzing,
  } = useDiagnosisStore();
  
  const analyzePatient = useAnalyzePatient();
  const [selectedTests, setSelectedTests] = useState<string[]>(
    patientInput.objective.special_tests || []
  );
  
  const handleSpecialTestChange = (test: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedTests, test]
      : selectedTests.filter(t => t !== test);
    setSelectedTests(updated);
    updateObjective({ special_tests: updated });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzePatient.mutateAsync(patientInput);
      setDiagnosisResult(result.diagnosis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleReset = () => {
    setSelectedTests([]);
    resetForm();
  };
  
  const getPainScaleColor = (value: number) => {
    if (value <= 3) return 'text-green-600';
    if (value <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Subjective History Section */}
      <motion.div
        variants={sectionVariants}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              <CardTitle className="text-lg">Subjective History</CardTitle>
            </div>
            <CardDescription>
              Patient&apos;s description of their condition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chief_complaint">Chief Complaint *</Label>
              <Input
                id="chief_complaint"
                placeholder="Primary reason for visit"
                value={patientInput.subjective.chief_complaint}
                onChange={(e) => updateSubjective({ chief_complaint: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symptom_duration">Symptom Duration *</Label>
                <Input
                  id="symptom_duration"
                  placeholder="e.g., 2 weeks, 3 months"
                  value={patientInput.subjective.symptom_duration}
                  onChange={(e) => updateSubjective({ symptom_duration: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient ID (Optional)</Label>
                <Input
                  id="patient_id"
                  placeholder="e.g., PT-12345"
                  value={patientInput.patient_id || ''}
                  onChange={(e) => setPatientInput({ patient_id: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptom_description">Symptom Description *</Label>
              <Textarea
                id="symptom_description"
                placeholder="Describe the nature, location, and character of symptoms"
                value={patientInput.subjective.symptom_description}
                onChange={(e) => updateSubjective({ symptom_description: e.target.value })}
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aggravating_factors">Aggravating Factors</Label>
                <Textarea
                  id="aggravating_factors"
                  placeholder="Activities that worsen symptoms"
                  value={patientInput.subjective.aggravating_factors || ''}
                  onChange={(e) => updateSubjective({ aggravating_factors: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relieving_factors">Relieving Factors</Label>
                <Textarea
                  id="relieving_factors"
                  placeholder="Activities that reduce symptoms"
                  value={patientInput.subjective.relieving_factors || ''}
                  onChange={(e) => updateSubjective({ relieving_factors: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="previous_treatments">Previous Treatments</Label>
              <Textarea
                id="previous_treatments"
                placeholder="Previous treatments attempted and their outcomes"
                value={patientInput.subjective.previous_treatments || ''}
                onChange={(e) => updateSubjective({ previous_treatments: e.target.value })}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medical_history">Medical History</Label>
              <Textarea
                id="medical_history"
                placeholder="Relevant medical history, surgeries, conditions"
                value={patientInput.subjective.medical_history || ''}
                onChange={(e) => updateSubjective({ medical_history: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Pain Assessment Section */}
      <motion.div
        variants={sectionVariants}
        custom={1}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-600" />
              <CardTitle className="text-lg">Pain Assessment</CardTitle>
            </div>
            <CardDescription>Rate pain intensity on a 0-10 scale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Pain Scale (0-10)</Label>
                <span className={`text-2xl font-bold ${getPainScaleColor(patientInput.pain_scale)}`}>
                  {patientInput.pain_scale}/10
                </span>
              </div>
              <Slider
                value={[patientInput.pain_scale]}
                onValueChange={(value) => setPatientInput({ pain_scale: value[0] })}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>No Pain</span>
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
                <span>Worst</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Objective Findings Section */}
      <motion.div
        variants={sectionVariants}
        custom={2}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <CardTitle className="text-lg">Objective Findings</CardTitle>
            </div>
            <CardDescription>Clinical examination findings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affected_region">Affected Region *</Label>
              <Input
                id="affected_region"
                placeholder="e.g., Lumbar spine, Right shoulder"
                value={patientInput.objective.affected_region}
                onChange={(e) => updateObjective({ affected_region: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="range_of_motion">Range of Motion</Label>
                <Textarea
                  id="range_of_motion"
                  placeholder="ROM assessment findings"
                  value={patientInput.objective.range_of_motion_notes || ''}
                  onChange={(e) => updateObjective({ range_of_motion_notes: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strength">Strength Assessment</Label>
                <Textarea
                  id="strength"
                  placeholder="Muscle strength findings"
                  value={patientInput.objective.strength_assessment || ''}
                  onChange={(e) => updateObjective({ strength_assessment: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Special Tests Performed</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-md">
                {COMMON_SPECIAL_TESTS.map((test) => (
                  <div key={test} className="flex items-center space-x-2">
                    <Checkbox
                      id={test}
                      checked={selectedTests.includes(test)}
                      onCheckedChange={(checked) => 
                        handleSpecialTestChange(test, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={test}
                      className="text-sm text-slate-700 cursor-pointer"
                    >
                      {test}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="posture">Posture Observations</Label>
                <Textarea
                  id="posture"
                  placeholder="Postural assessment notes"
                  value={patientInput.objective.posture_observations || ''}
                  onChange={(e) => updateObjective({ posture_observations: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gait">Gait Analysis</Label>
                <Textarea
                  id="gait"
                  placeholder="Gait pattern observations"
                  value={patientInput.objective.gait_analysis || ''}
                  onChange={(e) => updateObjective({ gait_analysis: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="palpation">Palpation Findings</Label>
                <Textarea
                  id="palpation"
                  placeholder="Findings from palpation"
                  value={patientInput.objective.palpation_findings || ''}
                  onChange={(e) => updateObjective({ palpation_findings: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="neurological">Neurological Screening</Label>
                <Textarea
                  id="neurological"
                  placeholder="Reflexes, sensation, motor findings"
                  value={patientInput.objective.neurological_screening || ''}
                  onChange={(e) => updateObjective({ neurological_screening: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Imaging & Additional Notes */}
      <motion.div
        variants={sectionVariants}
        custom={3}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-teal-600" />
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imaging">Imaging Reports</Label>
              <Textarea
                id="imaging"
                placeholder="Summary of X-ray, MRI, CT findings"
                value={patientInput.imaging_reports || ''}
                onChange={(e) => setPatientInput({ imaging_reports: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additional_notes">Additional Clinical Notes</Label>
              <Textarea
                id="additional_notes"
                placeholder="Any other relevant information"
                value={patientInput.additional_notes || ''}
                onChange={(e) => setPatientInput({ additional_notes: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Action Buttons */}
      <motion.div
        variants={sectionVariants}
        custom={4}
        initial="hidden"
        animate="visible"
        className="flex gap-4 sticky bottom-6"
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1"
          disabled={isAnalyzing}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Form
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Generate Diagnosis
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
