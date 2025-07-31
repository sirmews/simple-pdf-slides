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

  // Get all text and shape elements (shapes can contain text content)
  const contentElements = gridSlide.elements.filter(el => el.type === 'text' || el.type === 'shape');
  
  // If we have content elements, combine them all
  let title = '';
  let content = '';
  
  if (contentElements.length > 0) {
    // Sort by position (top to bottom, left to right) to maintain reading order
    const sortedElements = contentElements.sort((a, b) => {
      if (a.position.row !== b.position.row) {
        return a.position.row - b.position.row;
      }
      return a.position.col - b.position.col;
    });
    
    // Use first element as title if it looks like a title (bold or larger font)
    const firstElement = sortedElements[0];
    const isTitle = firstElement.style?.fontWeight === 'bold' || 
                   (firstElement.style?.fontSize && firstElement.style.fontSize > 20);
    
    if (isTitle && sortedElements.length > 1) {
      title = firstElement.content;
      content = sortedElements.slice(1).map(el => el.content).join('\n\n');
    } else {
      // If no clear title, put everything in content
      content = sortedElements.map(el => el.content).join('\n\n');
    }
  }

  // Find image element
  const imageElement = gridSlide.elements.find(el => el.type === 'image');

  return {
    title,
    content,
    backgroundColor: gridSlide.backgroundColor,
    image: imageElement?.content || null,
    template: 'simple' as const,
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