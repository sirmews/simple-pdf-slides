import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function ThemeToggle({ isDarkMode, onToggleDarkMode }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggleDarkMode}
      className={`p-2 rounded-lg transition-colors duration-200 ${
        isDarkMode
          ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
      }`}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}