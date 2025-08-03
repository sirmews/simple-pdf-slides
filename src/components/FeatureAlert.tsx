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
      className="alert"
    >
      <div className="flex items-center space-x-2">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="alert-button"
          title="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}