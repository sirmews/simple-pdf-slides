// Re-export all types for convenient importing
export * from './slide';
export * from './canvas';

// Global app types
export interface AppState {
  slides: SlideData[];
  pdfConfig: PDFConfig;
  canvasState: CanvasState;
  isGeneratingPdf: boolean;
}

export type { SlideData, PDFConfig, CanvasState } from './slide';
export type { ViewMode, EditableElement } from './canvas';