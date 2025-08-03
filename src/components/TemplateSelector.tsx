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
            className={`template-button ${selectedTemplate === template.id ? 'selected' : ''}`}
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