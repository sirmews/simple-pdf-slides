export interface SlideData {
  title: string;
  content: string;
  backgroundColor: string;
  image: string | null;
  template: SlideTemplate;
  // Grid-based editing support
  useGridEditor?: boolean;
}

export type SlideTemplate = 'simple' | 'split';

export interface PDFConfig {
  authorName: string;
  font: FontFamily;
  showPageNumbers: boolean;
}

export type FontFamily = 'helvetica' | 'times' | 'courier';

export interface SlideConstraints {
  maxContentChars: number;
  maxTitleChars: number;
}

export const SLIDE_CONSTRAINTS: SlideConstraints = {
  maxContentChars: 250,
  maxTitleChars: 50,
};

export interface SlideValidation {
  isValid: boolean;
  contentCharsRemaining: number;
  titleCharsRemaining: number;
  errors: string[];
}