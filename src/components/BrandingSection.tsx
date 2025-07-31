import React from 'react';

interface BrandingSectionProps {
  isDarkMode: boolean;
  title?: string;
  description?: string;
}

export default function BrandingSection({ 
  isDarkMode, 
  title = "Kinda professional carousels",
  description = "Y'know those awful carousels we're forced to navigate in LinkedIn? Be the problem, not the solution. Here's a solution with emoji support! Express yourself professionally 🚀"
}: BrandingSectionProps) {
  return (
    <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"} p-6 max-w-md`}>
      <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
        {title}
      </h1>
      <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-2`}>
        {description}
      </p>
    </div>
  );
}