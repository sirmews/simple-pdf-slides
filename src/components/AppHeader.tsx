import React from 'react';
import { ViewMode } from '@/types/canvas';
import BrandingSection from './BrandingSection';
import ViewModeToggle from './ViewModeToggle';
import ThemeToggle from './ThemeToggle';

interface AppHeaderProps {
  viewMode: ViewMode;
  isDarkMode: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleDarkMode: () => void;
}

export default function AppHeader({
  viewMode,
  isDarkMode,
  onViewModeChange,
  onToggleDarkMode
}: AppHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <BrandingSection isDarkMode={isDarkMode} />
        
        <div className="flex items-center space-x-2">
          <ViewModeToggle 
            viewMode={viewMode}
            isDarkMode={isDarkMode}
            onViewModeChange={onViewModeChange}
          />
          <ThemeToggle 
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
          />
        </div>
      </div>
    </div>
  );
}