import { LucideIcon, Square, Layout, FileText, Image as ImageIcon, Columns, Grid3X3, AlignLeft } from "lucide-react";

/**
 * Configuration for what inputs each template should show
 */
export interface TemplateInputConfig {
  title: boolean;
  content: boolean;
  backgroundColor: boolean;
  image: boolean;
  templateSelector: boolean;
}

/**
 * Template definition with configuration
 */
export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  inputs: TemplateInputConfig;
  category?: string;
}

/**
 * All available templates with their input configurations
 */
export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    id: "simple",
    name: "Stacked",
    description: "Vertical layout with title stacked above content",
    icon: AlignLeft,
    inputs: {
      title: true,
      content: true,
      backgroundColor: true,
      image: false,
      templateSelector: true,
    },
    category: "basic"
  },
  {
    id: "split",
    name: "Split",
    description: "Two-column layout with image and content",
    icon: Layout,
    inputs: {
      title: true,
      content: true,
      backgroundColor: true,
      image: true,
      templateSelector: true,
    },
    category: "basic"
  },
  {
    id: "image-only",
    name: "Image Only",
    description: "Full-screen image with optional title overlay",
    icon: ImageIcon,
    inputs: {
      title: true,
      content: false,
      backgroundColor: false,
      image: true,
      templateSelector: true,
    },
    category: "media"
  },
];

/**
 * Get template definition by ID
 */
export function getTemplateDefinition(templateId: string): TemplateDefinition | undefined {
  return TEMPLATE_DEFINITIONS.find(template => template.id === templateId);
}

/**
 * Get input configuration for a specific template
 */
export function getTemplateInputConfig(templateId: string): TemplateInputConfig {
  const template = getTemplateDefinition(templateId);
  
  // Default configuration if template not found
  if (!template) {
    return {
      title: true,
      content: true,
      backgroundColor: true,
      image: false,
      templateSelector: true,
    };
  }
  
  return template.inputs;
}

/**
 * Check if a specific input should be shown for a template
 */
export function shouldShowInput(templateId: string, inputType: keyof TemplateInputConfig): boolean {
  const config = getTemplateInputConfig(templateId);
  return config[inputType];
}

/**
 * Get all templates in a specific category
 */
export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return TEMPLATE_DEFINITIONS.filter(template => template.category === category);
}

/**
 * Get all available template categories
 */
export function getTemplateCategories(): string[] {
  const categories = TEMPLATE_DEFINITIONS.map(template => template.category || 'uncategorized');
  return [...new Set(categories)];
}