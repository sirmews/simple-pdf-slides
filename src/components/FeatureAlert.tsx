import { Sparkles, X } from "lucide-react";
import { useState } from "react";

interface FeatureAlertProps {
  isDarkMode: boolean;
  message: string;
  isVisible?: boolean;
  onDismiss?: () => void;
}

export default function FeatureAlert({ 
  isDarkMode, 
  message, 
  isVisible = true, 
  onDismiss 
}: FeatureAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isVisible || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={`flex items-center justify-between p-3 mt-3 rounded-lg border-l-4 ${
        isDarkMode
          ? "bg-blue-900/30 border-blue-400 text-blue-200"
          : "bg-blue-50 border-blue-400 text-blue-800"
      } transition-colors duration-200`}
    >
      <div className="flex items-center space-x-2">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className={`ml-4 p-1 rounded-full transition-colors duration-200 ${
            isDarkMode
              ? "hover:bg-blue-800/50 text-blue-300 hover:text-blue-200"
              : "hover:bg-blue-100 text-blue-600 hover:text-blue-800"
          }`}
          title="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}