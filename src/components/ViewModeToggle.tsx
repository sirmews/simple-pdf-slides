import React from 'react';
import { ViewMode } from '@/types/canvas';
import { Type, Edit3 } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  isDarkMode: boolean;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewModeToggle({
  viewMode,
  isDarkMode,
  onViewModeChange
}: ViewModeToggleProps) {
  const baseButtonClass = "px-3 py-2 transition-colors duration-200 flex items-center space-x-2";
  const activeClass = isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white';
  const inactiveClass = isDarkMode 
    ? 'text-gray-300 hover:bg-gray-600' 
    : 'text-gray-600 hover:bg-gray-200';

  return (
    <div className={`flex rounded-lg border ${
      isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
    }`}>
      <button
        onClick={() => onViewModeChange('form')}
        className={`${baseButtonClass} rounded-l-lg ${
          viewMode === 'form' ? activeClass : inactiveClass
        }`}
        title="Form View"
      >
        <Type className="w-4 h-4" />
        <span className="text-sm font-medium">Form</span>
      </button>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`${baseButtonClass} rounded-r-lg ${
          viewMode === 'grid' ? activeClass : inactiveClass
        }`}
        title="Grid Editor"
      >
        <Edit3 className="w-4 h-4" />
        <span className="text-sm font-medium">Grid</span>
      </button>
    </div>
  );
}