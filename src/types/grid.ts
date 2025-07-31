export interface GridConfig {
  rows: number;
  cols: number;
  cellSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridColor: string;
}

export interface GridPosition {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

export interface GridElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  position: GridPosition;
  content: string;
  style: GridElementStyle;
  zIndex: number;
}

export interface GridElementStyle {
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontFamily: string;
  color: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  padding: number;
  borderRadius: number;
  border?: string;
}

export interface GridSlideData {
  id: string;
  title: string;
  backgroundColor: string;
  gridConfig: GridConfig;
  elements: GridElement[];
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  rows: 24,
  cols: 24,
  cellSize: 595 / 24, // ~24.8px for 595px canvas
  showGrid: true,
  snapToGrid: true,
  gridColor: '#e5e7eb'
};

export const DEFAULT_GRID_ELEMENT_STYLE: GridElementStyle = {
  fontSize: 16,
  fontWeight: 'normal',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#1f2937',
  backgroundColor: 'transparent',
  textAlign: 'left',
  padding: 8,
  borderRadius: 4
};