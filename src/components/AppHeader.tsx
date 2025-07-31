import React from 'react';
import { ViewMode } from '@/types/canvas';
import { Sun, Moon, Type, Edit3 } from 'lucide-react';

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
  // Consistent branding across all views
  const title = "Kinda professional carousels";
  const description = "Y'know those awful carousels we're forced to navigate in LinkedIn? Be the problem, not the solution. Here's a solution with emoji support! Express yourself professionally 🚀";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        
        {/* Header Section - Left */}
        <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"} p-6 max-w-md`}>
          <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {title}
          </h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-2`}>
            {description}
          </p>
        </div>

        {/* Controls - Right */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className={`flex rounded-lg border ${
            isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
          }`}>
            <button
              onClick={() => onViewModeChange('form')}
              className={`px-3 py-2 rounded-l-lg transition-colors duration-200 flex items-center space-x-2 ${
                viewMode === 'form'
                  ? isDarkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Form View"
            >
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">Form</span>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-2 rounded-r-lg transition-colors duration-200 flex items-center space-x-2 ${
                viewMode === 'grid'
                  ? isDarkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Grid Editor"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium">Grid</span>
            </button>
          </div>

          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
            title={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}