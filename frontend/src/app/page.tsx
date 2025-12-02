'use client';

/**
 * PhysioMind CDSS - Main Dashboard Page
 * 
 * Clinical Decision Support System for Physiotherapists.
 * Features a responsive dashboard layout with sidebar navigation,
 * patient input form, and AI-generated diagnosis results.
 */

import { Sidebar, TopBar, PatientInputForm, DiagnosisDashboard } from '@/components';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        
        {/* Workspace */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col lg:flex-row">
            {/* Patient Input Form - Left Panel */}
            <div className="lg:w-1/2 xl:w-2/5 overflow-y-auto border-r border-slate-200 bg-white">
              <PatientInputForm />
            </div>
            
            {/* Diagnosis Results - Right Panel */}
            <div className="lg:w-1/2 xl:w-3/5 overflow-y-auto bg-slate-50">
              <DiagnosisDashboard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
