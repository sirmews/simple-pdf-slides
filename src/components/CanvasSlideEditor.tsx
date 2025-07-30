import React, { useState } from 'react';
import { SlideData, FontFamily, SLIDE_CONSTRAINTS } from '@/types/slide';
import { EditableElement } from '@/types/canvas';
import EditableText from './EditableText';
import { getContrastTextColor } from '@/utils/colorUtils';

interface CanvasSlideEditorProps {
  slide: SlideData;
  index: number;
  font: FontFamily;
  isSelected: boolean;
  onSlideClick: (index: number) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  scale?: number;
}

export default function CanvasSlideEditor({
  slide,
  index,
  font,
  isSelected,
  onSlideClick,
  onTitleChange,
  onContentChange,
  scale = 1
}: CanvasSlideEditorProps) {
  const [editingElement, setEditingElement] = useState<EditableElement | null>(null);
  
  const textColor = getContrastTextColor(slide.backgroundColor);
  const hasTitle = slide.title && slide.title.trim() !== '';
  const hasContent = slide.content && slide.content.trim() !== '';

  const getFontFamily = (font: FontFamily): string => {
    switch (font) {
      case 'helvetica':
        return 'system-ui, -apple-system, sans-serif';
      case 'times':
        return 'Georgia, "Times New Roman", serif';
      case 'courier':
        return '"Courier New", monospace';
      default:
        return 'system-ui, -apple-system, sans-serif';
    }
  };

  const handleSlideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSlideClick(index);
      setEditingElement(null);
    }
  };

  const renderSimpleTemplate = () => (
    <div className="h-full flex flex-col justify-center items-center p-8 space-y-4">
      {/* Title */}
      <div className="w-full">
        <EditableText
          value={slide.title}
          placeholder="Click to add title..."
          maxLength={SLIDE_CONSTRAINTS.maxTitleChars}
          onSave={onTitleChange}
          onCancel={() => setEditingElement(null)}
          isEditing={editingElement === 'title'}
          onStartEdit={() => setEditingElement('title')}
          className="text-center"
          style={{
            fontSize: `${32 * scale}px`,
            fontWeight: 'bold',
            color: textColor,
            fontFamily: getFontFamily(font),
            lineHeight: '1.2',
          }}
        />
      </div>

      {/* Image placeholder */}
      {slide.image && (
        <div className="flex justify-center">
          <img
            src={slide.image}
            alt={`Slide ${index + 1} image`}
            className="max-w-[300px] max-h-[200px] object-contain rounded-lg"
            style={{
              maxWidth: `${300 * scale}px`,
              maxHeight: `${200 * scale}px`,
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="w-full flex-1 flex items-center">
        <EditableText
          value={slide.content}
          placeholder="Click to add content..."
          maxLength={SLIDE_CONSTRAINTS.maxContentChars}
          onSave={onContentChange}
          onCancel={() => setEditingElement(null)}
          isEditing={editingElement === 'content'}
          onStartEdit={() => setEditingElement('content')}
          className="w-full text-center"
          style={{
            fontSize: hasTitle ? `${22 * scale}px` : `${26 * scale}px`,
            fontWeight: hasTitle ? 'normal' : 'bold',
            color: textColor,
            fontFamily: getFontFamily(font),
            lineHeight: '1.4',
          }}
        />
      </div>
    </div>
  );

  const renderSplitTemplate = () => (
    <div className="h-full flex flex-row items-center p-8 space-x-6">
      {/* Left Column - Text */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <div>
          <EditableText
            value={slide.title}
            placeholder="Click to add title..."
            maxLength={SLIDE_CONSTRAINTS.maxTitleChars}
            onSave={onTitleChange}
            onCancel={() => setEditingElement(null)}
            isEditing={editingElement === 'title'}
            onStartEdit={() => setEditingElement('title')}
            className="text-left"
            style={{
              fontSize: `${28 * scale}px`,
              fontWeight: 'bold',
              color: textColor,
              fontFamily: getFontFamily(font),
              lineHeight: '1.2',
            }}
          />
        </div>
        
        <div className="flex-1 flex items-center">
          <EditableText
            value={slide.content}
            placeholder="Click to add content..."
            maxLength={SLIDE_CONSTRAINTS.maxContentChars}
            onSave={onContentChange}
            onCancel={() => setEditingElement(null)}
            isEditing={editingElement === 'content'}
            onStartEdit={() => setEditingElement('content')}
            className="w-full text-left"
            style={{
              fontSize: font === 'courier' ? `${16 * scale}px` : `${18 * scale}px`,
              color: textColor,
              fontFamily: getFontFamily(font),
              lineHeight: '1.5',
            }}
          />
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="flex-1 flex justify-center items-center">
        {slide.image ? (
          <img
            src={slide.image}
            alt={`Slide ${index + 1} image`}
            className="max-w-[250px] max-h-[300px] object-contain rounded-lg"
            style={{
              maxWidth: `${250 * scale}px`,
              maxHeight: `${300 * scale}px`,
            }}
          />
        ) : (
          <div 
            className="border-2 border-dashed rounded-lg flex items-center justify-center"
            style={{
              width: `${200 * scale}px`,
              height: `${200 * scale}px`,
              borderColor: textColor + '40',
              color: textColor + '60',
            }}
          >
            <span style={{ fontSize: `${14 * scale}px` }}>Image area</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      onClick={handleSlideClick}
      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{
        width: `${595 * scale}px`,
        height: `${595 * scale}px`,
        backgroundColor: slide.backgroundColor,
      }}
    >
      {/* Slide Number Badge */}
      <div
        className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium z-10"
        style={{
          backgroundColor: textColor,
          color: slide.backgroundColor,
          fontSize: `${10 * scale}px`,
        }}
      >
        {index + 1}
      </div>

      {/* Slide Content */}
      {slide.template === 'split' ? renderSplitTemplate() : renderSimpleTemplate()}
    </div>
  );
}