import React from "react"
import { TEMPLATE_DEFINITIONS, TemplateDefinition } from "../config/templateConfig"

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  size?: number;
  category?: string; // Optional: filter by category
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplate, 
  onTemplateChange, 
  size = 48,
  category 
}) => {
  // Filter templates by category if specified, otherwise show all
  const templates = category 
    ? TEMPLATE_DEFINITIONS.filter(template => template.category === category)
    : TEMPLATE_DEFINITIONS;

  return (
    <div className="flex gap-2 flex-wrap">
      {templates.map((template) => {
        const IconComponent = template.icon
        return (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`
              flex flex-col items-center justify-center gap-2 p-3 rounded-md border transition-colors
              w-24 h-24 min-w-24 min-h-24 max-w-24 max-h-24
              ${selectedTemplate === template.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }
            `}
            title={template.description}
          >
            <IconComponent size={24} className="flex-shrink-0" />
            <span className="text-xs font-medium text-center leading-tight w-full px-1">
              {template.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default TemplateSelector