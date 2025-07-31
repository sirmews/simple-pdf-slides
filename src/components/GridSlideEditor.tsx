import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { GridSlideData, GridElement, GridConfig, DEFAULT_GRID_CONFIG, DEFAULT_GRID_ELEMENT_STYLE } from '@/types/grid';
import GridOverlay from './GridOverlay';
import GridElementComponent from './GridElement';
import { Type, Image as ImageIcon, Square, Grid, Eye, EyeOff } from 'lucide-react';

interface GridSlideEditorProps {
  slide: GridSlideData;
  index: number;
  isSelected: boolean;
  onSlideClick: (index: number) => void;
  onSlideUpdate: (slide: GridSlideData) => void;
  scale?: number;
}

export default function GridSlideEditor({
  slide,
  index,
  isSelected,
  onSlideClick,
  onSlideUpdate,
  scale = 1
}: GridSlideEditorProps) {
  const [selectedElementId, setSelectedElementId] = useState<string>('');
  const [editingElementId, setEditingElementId] = useState<string>('');
  const [dragMode, setDragMode] = useState<'select' | 'add-text' | 'add-shape'>('select');

  const canvasWidth = 595;
  const canvasHeight = 595;

  const handleSlideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSlideClick(index);
      setSelectedElementId('');
      setEditingElementId('');

      // If in add mode, create new element at click position
      if (dragMode !== 'select') {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        
        const cellWidth = canvasWidth / slide.gridConfig.cols;
        const cellHeight = canvasHeight / slide.gridConfig.rows;
        
        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);
        
        addElementAtPosition(col, row, dragMode);
        setDragMode('select');
      }
    }
  };

  const addElementAtPosition = (col: number, row: number, type: 'add-text' | 'add-shape') => {
    const newElement: GridElement = {
      id: nanoid(),
      type: type === 'add-text' ? 'text' : 'shape',
      position: {
        row: Math.max(0, Math.min(row, slide.gridConfig.rows - 2)),
        col: Math.max(0, Math.min(col, slide.gridConfig.cols - 4)),
        rowSpan: 2,
        colSpan: 4
      },
      content: type === 'add-text' ? 'New text element' : '',
      style: {
        ...DEFAULT_GRID_ELEMENT_STYLE,
        backgroundColor: type === 'add-shape' ? '#e5e7eb' : 'transparent'
      },
      zIndex: slide.elements.length
    };

    const updatedSlide = {
      ...slide,
      elements: [...slide.elements, newElement]
    };

    onSlideUpdate(updatedSlide);
    setSelectedElementId(newElement.id);
    if (type === 'add-text') {
      setEditingElementId(newElement.id);
    }
  };

  const handleElementUpdate = (elementId: string, updates: Partial<GridElement>) => {
    const updatedElements = slide.elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    onSlideUpdate({ ...slide, elements: updatedElements });
  };

  const handleElementDelete = (elementId: string) => {
    const updatedElements = slide.elements.filter(el => el.id !== elementId);
    onSlideUpdate({ ...slide, elements: updatedElements });
    setSelectedElementId('');
    setEditingElementId('');
  };

  const handleElementDuplicate = (elementId: string) => {
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;

    const newElement: GridElement = {
      ...element,
      id: nanoid(),
      position: {
        ...element.position,
        col: Math.min(element.position.col + 1, slide.gridConfig.cols - element.position.colSpan),
        row: Math.min(element.position.row + 1, slide.gridConfig.rows - element.position.rowSpan)
      },
      zIndex: slide.elements.length
    };

    const updatedSlide = {
      ...slide,
      elements: [...slide.elements, newElement]
    };

    onSlideUpdate(updatedSlide);
    setSelectedElementId(newElement.id);
  };

  const handleElementMove = (elementId: string, newPosition: GridElement['position']) => {
    handleElementUpdate(elementId, { position: newPosition });
  };

  const toggleGrid = () => {
    const updatedGridConfig = {
      ...slide.gridConfig,
      showGrid: !slide.gridConfig.showGrid
    };
    onSlideUpdate({ ...slide, gridConfig: updatedGridConfig });
  };

  const toggleSnapToGrid = () => {
    const updatedGridConfig = {
      ...slide.gridConfig,
      snapToGrid: !slide.gridConfig.snapToGrid
    };
    onSlideUpdate({ ...slide, gridConfig: updatedGridConfig });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDragMode('select')}
            className={`p-2 rounded ${dragMode === 'select' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            title="Select mode"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDragMode('add-text')}
            className={`p-2 rounded ${dragMode === 'add-text' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            title="Add text element"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDragMode('add-shape')}
            className={`p-2 rounded ${dragMode === 'add-shape' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            title="Add shape element"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleGrid}
            className={`p-2 rounded ${slide.gridConfig.showGrid ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
            title="Toggle grid visibility"
          >
            {slide.gridConfig.showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleSnapToGrid}
            className={`p-2 rounded ${slide.gridConfig.snapToGrid ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
            title="Toggle snap to grid"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        onClick={handleSlideClick}
        className={`relative border-2 rounded-lg overflow-hidden transition-all duration-200 ${
          isSelected
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
            : 'border-gray-300 hover:border-gray-400'
        } ${dragMode !== 'select' ? 'cursor-crosshair' : 'cursor-pointer'}`}
        style={{
          width: `${canvasWidth * scale}px`,
          height: `${canvasHeight * scale}px`,
          backgroundColor: slide.backgroundColor,
        }}
      >
        {/* Slide Number Badge */}
        <div
          className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium z-20"
          style={{
            backgroundColor: '#1f2937',
            color: '#ffffff',
            fontSize: `${10 * scale}px`,
          }}
        >
          {index + 1}
        </div>

        {/* Grid Overlay */}
        <GridOverlay
          gridConfig={slide.gridConfig}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          scale={scale}
        />

        {/* Grid Elements */}
        {slide.elements.map((element) => (
          <GridElementComponent
            key={element.id}
            element={element}
            gridConfig={slide.gridConfig}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            isSelected={selectedElementId === element.id}
            isEditing={editingElementId === element.id}
            scale={scale}
            onSelect={setSelectedElementId}
            onEdit={setEditingElementId}
            onUpdate={handleElementUpdate}
            onDelete={handleElementDelete}
            onDuplicate={handleElementDuplicate}
            onMove={handleElementMove}
          />
        ))}

        {/* Mode Indicator */}
        {dragMode !== 'select' && (
          <div className="absolute bottom-2 right-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-md">
            Click to add {dragMode === 'add-text' ? 'text' : 'shape'}
          </div>
        )}
      </div>

      {/* Element Properties Panel */}
      {selectedElementId && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Element Properties</h4>
          {/* Add property controls here */}
          <div className="text-sm text-gray-600">
            Selected: {slide.elements.find(el => el.id === selectedElementId)?.type} element
          </div>
        </div>
      )}
    </div>
  );
}