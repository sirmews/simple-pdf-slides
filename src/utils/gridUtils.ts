import { nanoid } from 'nanoid';
import { SlideData } from '@/types/slide';
import { GridSlideData, GridElement, DEFAULT_GRID_CONFIG, DEFAULT_GRID_ELEMENT_STYLE } from '@/types/grid';

export function convertSlideToGridSlide(slide: SlideData): GridSlideData {
  const elements: GridElement[] = [];

  // Convert title to grid element
  if (slide.title && slide.title.trim()) {
    elements.push({
      id: nanoid(),
      type: 'text',
      position: {
        row: 2,
        col: 2,
        rowSpan: 3,
        colSpan: 20
      },
      content: slide.title,
      style: {
        ...DEFAULT_GRID_ELEMENT_STYLE,
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      zIndex: 1
    });
  }

  // Convert content to grid element
  if (slide.content && slide.content.trim()) {
    const titleExists = slide.title && slide.title.trim();
    elements.push({
      id: nanoid(),
      type: 'text',
      position: {
        row: titleExists ? 8 : 6,
        col: 2,
        rowSpan: titleExists ? 12 : 16,
        colSpan: 20
      },
      content: slide.content,
      style: {
        ...DEFAULT_GRID_ELEMENT_STYLE,
        fontSize: titleExists ? 18 : 24,
        fontWeight: titleExists ? 'normal' : 'bold',
        textAlign: 'center'
      },
      zIndex: 2
    });
  }

  // Convert image to grid element (if exists)
  if (slide.image) {
    elements.push({
      id: nanoid(),
      type: 'image',
      position: {
        row: 12,
        col: 8,
        rowSpan: 8,
        colSpan: 8
      },
      content: slide.image,
      style: {
        ...DEFAULT_GRID_ELEMENT_STYLE,
        backgroundColor: 'transparent'
      },
      zIndex: 3
    });
  }

  return {
    id: nanoid(),
    title: slide.title || `Slide ${Date.now()}`,
    backgroundColor: slide.backgroundColor,
    gridConfig: {
      ...DEFAULT_GRID_CONFIG,
      gridColor: getContrastGridColor(slide.backgroundColor)
    },
    elements
  };
}

export function convertGridSlideToSlide(gridSlide: GridSlideData): SlideData {
  // Find title element (largest text element or first text element)
  const titleElement = gridSlide.elements
    .filter(el => el.type === 'text')
    .sort((a, b) => b.style.fontSize - a.style.fontSize)[0];

  // Find content element (second largest text element or remaining text)
  const contentElement = gridSlide.elements
    .filter(el => el.type === 'text' && el.id !== titleElement?.id)
    .sort((a, b) => b.style.fontSize - a.style.fontSize)[0];

  // Find image element
  const imageElement = gridSlide.elements.find(el => el.type === 'image');

  return {
    title: titleElement?.content || '',
    content: contentElement?.content || '',
    backgroundColor: gridSlide.backgroundColor,
    image: imageElement?.content || null,
    template: 'simple', // Default template
    useGridEditor: true
  };
}

function getContrastGridColor(backgroundColor: string): string {
  // Simple contrast calculation for grid color
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#d1d5db' : '#6b7280';
}

export function snapToGrid(
  position: number, 
  cellSize: number, 
  snapEnabled: boolean = true
): number {
  if (!snapEnabled) return position;
  return Math.round(position / cellSize) * cellSize;
}

export function getGridPosition(
  x: number, 
  y: number, 
  cellWidth: number, 
  cellHeight: number
): { row: number; col: number } {
  return {
    col: Math.floor(x / cellWidth),
    row: Math.floor(y / cellHeight)
  };
}