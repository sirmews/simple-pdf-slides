import React from "react"
import { Square, Layout, LucideIcon } from "lucide-react"

interface Template {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  size?: number;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onTemplateChange, size = 48 }) => {
  const templates: Template[] = [
    {
      id: "simple",
      name: "Simple",
      description: "Clean single-column layout",
      icon: Square
    },
    {
      id: "split",
      name: "Split", 
      description: "Two-column layout with image",
      icon: Layout
    }
  ]

  return (
    <div className="flex gap-2">
      {templates.map((template) => {
        const IconComponent = template.icon
        return (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-md border transition-colors
              ${selectedTemplate === template.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }
            `}
            title={template.description}
          >
            <IconComponent size={size * 0.6} className="mb-1" />
            <span className="text-xs font-medium">
              {template.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default TemplateSelector