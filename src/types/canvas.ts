export interface CanvasState {
  selectedSlideIndex: number;
  selectedElement: EditableElement | null;
  isEditing: boolean;
  viewMode: ViewMode;
  canvasScale: number;
}

export type ViewMode = 'form' | 'grid';

export type EditableElement = 'title' | 'content';

export interface EditableTextProps {
  value: string;
  placeholder: string;
  maxLength: number;
  onSave: (value: string) => void;
  onCancel: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface CanvasSlideProps {
  slide: import('./slide').SlideData;
  index: number;
  isSelected: boolean;
  onSlideClick: (index: number) => void;
  onElementClick: (element: EditableElement) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  canvasScale: number;
}

export interface CanvasControlsProps {
  slide: import('./slide').SlideData;
  onBackgroundColorChange: (color: string) => void;
  onTemplateChange: (template: import('./slide').SlideTemplate) => void;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
}

export interface CanvasViewportProps {
  slides: import('./slide').SlideData[];
  selectedSlideIndex: number;
  onSlideSelect: (index: number) => void;
  onSlideUpdate: (index: number, slide: import('./slide').SlideData) => void;
}