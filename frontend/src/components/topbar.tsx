'use client';

import { motion } from 'framer-motion';
import { Bell, HelpCircle, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHealthCheck } from '@/hooks';

export function TopBar() {
  const { data: healthData, isLoading, isError } = useHealthCheck();
  
  // Determine API status
  const getApiStatus = () => {
    if (isLoading) {
      return { variant: 'secondary' as const, text: 'Checking...', showPulse: false };
    }
    if (isError || !healthData) {
      return { variant: 'danger' as const, text: 'API Disconnected', showPulse: false };
    }
    return { variant: 'success' as const, text: 'API Connected', showPulse: true };
  };
  
  const apiStatus = getApiStatus();
  
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl font-semibold text-slate-800">
          Diagnosis Workspace
        </h1>
        <p className="text-sm text-slate-500">
          Clinical Decision Support System
        </p>
      </motion.div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* API Status */}
        <Badge variant={apiStatus.variant} className="hidden sm:flex items-center gap-1">
          {apiStatus.showPulse && (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
          {apiStatus.text}
        </Badge>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        
        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-slate-600" />
        </Button>
        
        {/* User Profile */}
        <Button variant="ghost" size="icon" className="ml-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="h-5 w-5 text-teal-600" />
          </div>
        </Button>
      </div>
    </header>
  );
}
