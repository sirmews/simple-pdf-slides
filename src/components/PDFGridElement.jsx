import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { createGridElementStyles } from '@/utils/pdfGridUtils';

// Map CSS font families to React PDF supported fonts
function mapFontFamily(fontFamily) {
  const lowerFamily = fontFamily.toLowerCase();
  
  if (lowerFamily.includes('serif') || lowerFamily.includes('times')) {
    return 'Times';
  } else if (lowerFamily.includes('mono') || lowerFamily.includes('courier') || lowerFamily.includes('code')) {
    return 'Courier';
  } else {
    return 'Helvetica';
  }
}

/**
 * PDF Grid Element Component
 * Renders a grid element as React PDF components
 */
export default function PDFGridElement({ element, gridConfig }) {
  const elementStyle = createGridElementStyles(element, gridConfig);
  
  // Create text-specific styles
  const textStyles = {
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight === 'bold' ? 'bold' : 'normal',
    fontFamily: mapFontFamily(element.style.fontFamily),
    color: element.style.color,
    textAlign: element.style.textAlign,
    lineHeight: 1.4,
  };

  // Render based on element type
  switch (element.type) {
    case 'text':
      return (
        <View style={elementStyle}>
          <Text style={textStyles}>
            {element.content || ''}
          </Text>
        </View>
      );

    case 'image':
      // Only render if element has image content
      if (!element.content) {
        return null;
      }
      
      return (
        <View style={elementStyle}>
          <Image 
            src={element.content}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </View>
      );

    case 'shape':
      return (
        <View style={elementStyle}>
          {element.content && (
            <Text style={textStyles}>
              {element.content}
            </Text>
          )}
        </View>
      );

    default:
      // Fallback for unknown element types
      return (
        <View style={elementStyle}>
          <Text style={textStyles}>
            {element.content || ''}
          </Text>
        </View>
      );
  }
}

/**
 * PDF Grid Elements Container
 * Renders all grid elements for a slide, properly layered by zIndex
 */
export function PDFGridElements({ elements, gridConfig }) {
  if (!elements || elements.length === 0) {
    return null;
  }

  // Sort elements by zIndex to ensure proper layering
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <>
      {sortedElements.map((element) => (
        <PDFGridElement
          key={element.id}
          element={element}
          gridConfig={gridConfig}
        />
      ))}
    </>
  );
}