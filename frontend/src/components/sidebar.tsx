'use client';

/**
 * Sidebar - Navigation sidebar for PhysioMind dashboard.
 */

import { motion } from 'framer-motion';
import { 
  Users, 
  History, 
  Settings, 
  Menu,
  X,
  Stethoscope
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useDiagnosisStore, type SidebarSection } from '@/stores';
import { cn } from '@/lib/utils';

/** Navigation item interface */
interface NavItem {
  id: SidebarSection;
  label: string;
  icon: React.ReactNode;
}

/** Navigation items configuration */
const NAV_ITEMS: NavItem[] = [
  { id: 'patients', label: 'Patients', icon: <Users className="h-5 w-5" /> },
  { id: 'history', label: 'History', icon: <History className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export function Sidebar() {
  const { 
    activeSidebarSection, 
    setActiveSidebarSection, 
    isSidebarOpen, 
    setSidebarOpen 
  } = useDiagnosisStore();
  
  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5 text-slate-600" />
        ) : (
          <Menu className="h-5 w-5 text-slate-600" />
        )}
      </button>
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : -280,
          opacity: isSidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col",
          "lg:translate-x-0 lg:opacity-100"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-slate-800">PhysioMind</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Button
                  variant={activeSidebarSection === item.id ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    activeSidebarSection === item.id && "bg-teal-50 text-teal-700 hover:bg-teal-100"
                  )}
                  onClick={() => setActiveSidebarSection(item.id)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-400 text-center">
            PhysioMind CDSS v0.1.0
          </div>
        </div>
      </motion.aside>
      
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
