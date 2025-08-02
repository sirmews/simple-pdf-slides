import { GridElement, GridElementStyle, GridPosition, GridConfig } from '@/types/grid';
import { StyleSheet } from '@react-pdf/renderer';

/**
 * PDF Grid Utilities
 * Converts grid-based layout elements to React PDF positioning and styles
 */

// PDF page dimensions (square format)
export const PDF_PAGE_SIZE = 595; // 595x595 points
export const PDF_PAGE_PADDING = 40; // 40 points padding
export const PDF_CONTENT_SIZE = PDF_PAGE_SIZE - (PDF_PAGE_PADDING * 2); // 515x515 usable area

/**
 * Convert grid position to React PDF absolute positioning
 * Grid coordinates (0-based) -> PDF coordinates (points from top-left)
 */
export function gridPositionToPdfPosition(
  position: GridPosition,
  gridConfig: GridConfig
): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const cellWidth = PDF_CONTENT_SIZE / gridConfig.cols;
  const cellHeight = PDF_CONTENT_SIZE / gridConfig.rows;

  const result = {
    left: position.col * cellWidth,
    top: position.row * cellHeight,
    width: position.colSpan * cellWidth,
    height: position.rowSpan * cellHeight,
  };

  // Debug logging
  console.log('Grid position conversion:', {
    position,
    gridConfig: { cols: gridConfig.cols, rows: gridConfig.rows },
    cellSize: { width: cellWidth, height: cellHeight },
    result
  });

  return result;
}

/**
 * Convert GridElementStyle to React PDF StyleSheet format
 */
export function gridElementStyleToPdfStyle(
  elementStyle: GridElementStyle,
  position: GridPosition,
  gridConfig: GridConfig
) {
  const pdfPosition = gridPositionToPdfPosition(position, gridConfig);
  
  return {
    position: 'absolute',
    left: pdfPosition.left,
    top: pdfPosition.top,
    width: pdfPosition.width,
    height: pdfPosition.height,
    backgroundColor: elementStyle.backgroundColor === 'transparent' ? undefined : elementStyle.backgroundColor,
    padding: elementStyle.padding,
    borderRadius: elementStyle.borderRadius,
    border: elementStyle.border,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: elementStyle.textAlign === 'center' ? 'center' : 
               elementStyle.textAlign === 'right' ? 'flex-end' : 'flex-start',
  };
}

/**
 * Map CSS font families to React PDF supported fonts
 */
function mapFontFamily(fontFamily: string): string {
  const lowerFamily = fontFamily.toLowerCase();
  
  if (lowerFamily.includes('serif') || lowerFamily.includes('times')) {
    return 'Times';
  } else if (lowerFamily.includes('mono') || lowerFamily.includes('courier') || lowerFamily.includes('code')) {
    return 'Courier';
  } else {
    // Default to Helvetica for sans-serif and system fonts
    return 'Helvetica';
  }
}

/**
 * Sort grid elements by zIndex for proper layering in PDF
 */
export function sortElementsByZIndex(elements: GridElement[]): GridElement[] {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
}

/**
 * Create React PDF styles for a grid element
 */
export function createGridElementStyles(
  element: GridElement,
  gridConfig: GridConfig
) {
  const baseStyle = gridElementStyleToPdfStyle(element.style, element.position, gridConfig);
  
  // Element-specific style adjustments
  switch (element.type) {
    case 'text':
      return {
        ...baseStyle,
        // Text elements can wrap content
        overflow: 'hidden',
        lineHeight: 1.4,
      };
      
    case 'shape':
      return {
        ...baseStyle,
        // Shapes typically don't have text wrapping
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
      
    case 'image':
      return {
        ...baseStyle,
        // Images need object-fit equivalent
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      };
      
    default:
      return baseStyle;
  }
}

/**
 * Validate if grid element position is within bounds
 */
export function isElementPositionValid(
  position: GridPosition,
  gridConfig: GridConfig
): boolean {
  return (
    position.col >= 0 &&
    position.row >= 0 &&
    position.col + position.colSpan <= gridConfig.cols &&
    position.row + position.rowSpan <= gridConfig.rows
  );
}

/**
 * Calculate element bounds in PDF coordinates
 */
export function getElementBounds(
  element: GridElement,
  gridConfig: GridConfig
): {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
} {
  const position = gridPositionToPdfPosition(element.position, gridConfig);
  
  return {
    left: position.left,
    top: position.top,
    right: position.left + position.width,
    bottom: position.top + position.height,
    width: position.width,
    height: position.height,
  };
}