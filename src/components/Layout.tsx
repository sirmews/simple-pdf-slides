import React from 'react';
import AppHeader from './AppHeader';
import { ViewMode } from '@/types/canvas';

interface LayoutProps {
  isDarkMode: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleDarkMode: () => void;
  children: React.ReactNode;
}

export default function Layout({
  isDarkMode,
  viewMode,
  onViewModeChange,
  onToggleDarkMode,
  children
}: LayoutProps) {
  return (
    <div className={`${isDarkMode ? "dark bg-gray-900" : "bg-slate-100"} min-h-screen font-sans transition-colors duration-200`}>
      <AppHeader
        viewMode={viewMode}
        isDarkMode={isDarkMode}
        onViewModeChange={onViewModeChange}
        onToggleDarkMode={onToggleDarkMode}
      />
      
      <main>
        {children}
      </main>
    </div>
  );
}