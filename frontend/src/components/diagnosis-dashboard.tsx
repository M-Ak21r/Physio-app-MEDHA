'use client';

/**
 * DiagnosisDashboard - Main workspace component for PhysioMind CDSS.
 * 
 * Provides the primary interface for patient data input and diagnosis results.
 */

import { motion, type Variants } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ClipboardList,
  Dumbbell,
  Stethoscope 
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDiagnosisStore } from '@/stores';
import type { DiagnosisResponse, Exercise, RiskFlag } from '@/types';

/** Animation variants for cards */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
};

/** Props for ExerciseCard component */
interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

/** Exercise recommendation card */
function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card variant="outline" className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-teal-600" />
            <CardTitle className="text-base">{exercise.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {exercise.description && (
            <p className="text-sm text-slate-600 mb-3">{exercise.description}</p>
          )}
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary">{exercise.sets} sets</Badge>
            <Badge variant="secondary">{exercise.reps} reps</Badge>
            {exercise.hold_seconds && (
              <Badge variant="secondary">{exercise.hold_seconds}s hold</Badge>
            )}
          </div>
          {exercise.frequency && (
            <p className="text-xs text-slate-500 mt-2">{exercise.frequency}</p>
          )}
          {exercise.precautions && (
            <p className="text-xs text-yellow-600 mt-2 italic">
              ⚠️ {exercise.precautions}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/** Props for RiskFlagCard component */
interface RiskFlagCardProps {
  flag: RiskFlag;
  index: number;
}

/** Risk flag alert card */
function RiskFlagCard({ flag, index }: RiskFlagCardProps) {
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'red':
        return 'danger';
      case 'yellow':
        return 'warning';
      default:
        return 'success';
    }
  };
  
  const getIcon = (level: string) => {
    switch (level) {
      case 'red':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'yellow':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };
  
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card variant="outline" className="border-l-4 border-l-inherit" style={{
        borderLeftColor: flag.level === 'red' ? '#ef4444' : flag.level === 'yellow' ? '#f59e0b' : '#22c55e'
      }}>
        <CardContent className="py-3">
          <div className="flex items-start gap-3">
            {getIcon(flag.level)}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={getBadgeVariant(flag.level)}>
                  {flag.level.toUpperCase()} FLAG
                </Badge>
              </div>
              <p className="text-sm text-slate-700">{flag.description}</p>
              {flag.recommended_action && (
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Action:</strong> {flag.recommended_action}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/** Diagnosis result display component */
interface DiagnosisResultProps {
  diagnosis: DiagnosisResponse;
}

function DiagnosisResult({ diagnosis }: DiagnosisResultProps) {
  return (
    <div className="space-y-6">
      {/* Primary Diagnosis */}
      <motion.div
        variants={cardVariants}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <CardTitle>Primary Diagnosis</CardTitle>
            </div>
            <CardDescription>Most likely diagnosis based on findings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-teal-700 mb-4">
              {diagnosis.primary_diagnosis}
            </p>
            
            <div className="mb-4">
              <h4 className="font-medium text-slate-700 mb-2">Differential Diagnosis</h4>
              <div className="flex flex-wrap gap-2">
                {diagnosis.differential_diagnosis.map((dx, i) => (
                  <Badge key={i} variant="outline">{dx}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Clinical Reasoning</h4>
              <p className="text-sm text-slate-600">{diagnosis.clinical_reasoning}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Risk Flags */}
      {diagnosis.risk_flags.length > 0 && (
        <motion.div
          variants={cardVariants}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <CardTitle>Risk Flags</CardTitle>
              </div>
              <CardDescription>Important clinical considerations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {diagnosis.risk_flags.map((flag, i) => (
                <RiskFlagCard key={i} flag={flag} index={i} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Treatment Plan */}
      <motion.div
        variants={cardVariants}
        custom={2}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-teal-600" />
              <CardTitle>Treatment Plan</CardTitle>
            </div>
            <CardDescription>Phased rehabilitation approach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-700 mb-1">
                  <Badge variant="default" className="mr-2">Phase 1</Badge>
                  Acute Phase (0-2 weeks)
                </h4>
                <p className="text-sm text-slate-600 pl-4 border-l-2 border-teal-200">
                  {diagnosis.treatment_plan.acute_phase}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-700 mb-1">
                  <Badge variant="secondary" className="mr-2">Phase 2</Badge>
                  Recovery Phase (2-8 weeks)
                </h4>
                <p className="text-sm text-slate-600 pl-4 border-l-2 border-slate-200">
                  {diagnosis.treatment_plan.recovery_phase}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-700 mb-1">
                  <Badge variant="outline" className="mr-2">Phase 3</Badge>
                  Maintenance
                </h4>
                <p className="text-sm text-slate-600 pl-4 border-l-2 border-slate-200">
                  {diagnosis.treatment_plan.maintenance}
                </p>
              </div>
              
              {diagnosis.treatment_plan.expected_timeline && (
                <p className="text-sm text-teal-600 mt-4">
                  <strong>Expected Timeline:</strong> {diagnosis.treatment_plan.expected_timeline}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Suggested Exercises */}
      {diagnosis.suggested_exercises.length > 0 && (
        <motion.div
          variants={cardVariants}
          custom={3}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" />
                <CardTitle>Suggested Exercises</CardTitle>
              </div>
              <CardDescription>Evidence-based therapeutic exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diagnosis.suggested_exercises.map((exercise, i) => (
                  <ExerciseCard key={i} exercise={exercise} index={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Prognosis & Follow-up */}
      {(diagnosis.prognosis || diagnosis.follow_up_recommendations) && (
        <motion.div
          variants={cardVariants}
          custom={4}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader>
              <CardTitle>Prognosis & Follow-up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {diagnosis.prognosis && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Prognosis</h4>
                  <p className="text-sm text-slate-600">{diagnosis.prognosis}</p>
                </div>
              )}
              {diagnosis.follow_up_recommendations && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Follow-up Recommendations</h4>
                  <p className="text-sm text-slate-600">{diagnosis.follow_up_recommendations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

/** Loading skeleton for diagnosis results */
function DiagnosisLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

/** Empty state when no diagnosis has been run */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-6">
        <Stethoscope className="h-10 w-10 text-teal-600" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        Ready to Analyze
      </h3>
      <p className="text-slate-500 max-w-md">
        Enter patient assessment data in the form on the left and click{" "}
        {'"'}Generate Diagnosis{'"'} to receive an AI-powered clinical decision support report.
      </p>
    </motion.div>
  );
}

/** Main DiagnosisDashboard component */
export function DiagnosisDashboard() {
  const { diagnosisResult, isAnalyzing, error } = useDiagnosisStore();
  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  if (isAnalyzing) {
    return (
      <div className="p-6">
        <DiagnosisLoadingSkeleton />
      </div>
    );
  }
  
  if (!diagnosisResult) {
    return <EmptyState />;
  }
  
  return (
    <div className="p-6">
      <DiagnosisResult diagnosis={diagnosisResult} />
    </div>
  );
}
