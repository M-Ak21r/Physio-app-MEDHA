'use client';

/**
 * TopBar - Top navigation bar with user profile and actions.
 */

import { motion } from 'framer-motion';
import { Bell, HelpCircle, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
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
        <Badge variant="success" className="hidden sm:flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          API Connected
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
