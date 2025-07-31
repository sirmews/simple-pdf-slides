import React, { useState, useRef } from 'react';
import { GridElement as GridElementType, GridConfig } from '@/types/grid';
import { Move, Edit3, Trash2, Copy } from 'lucide-react';

interface GridElementProps {
  element: GridElementType;
  gridConfig: GridConfig;
  canvasWidth: number;
  canvasHeight: number;
  isSelected: boolean;
  isEditing: boolean;
  scale?: number;
  onSelect: (elementId: string) => void;
  onEdit: (elementId: string) => void;
  onUpdate: (elementId: string, updates: Partial<GridElementType>) => void;
  onDelete: (elementId: string) => void;
  onDuplicate: (elementId: string) => void;
  onMove: (elementId: string, newPosition: GridElementType['position']) => void;
}

export default function GridElementComponent({
  element,
  gridConfig,
  canvasWidth,
  canvasHeight,
  isSelected,
  isEditing,
  scale = 1,
  onSelect,
  onEdit,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove
}: GridElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editValue, setEditValue] = useState(element.content);
  const elementRef = useRef<HTMLDivElement>(null);

  const cellWidth = canvasWidth / gridConfig.cols;
  const cellHeight = canvasHeight / gridConfig.rows;

  // Calculate element position and size
  const elementStyle = {
    left: element.position.col * cellWidth,
    top: element.position.row * cellHeight,
    width: element.position.colSpan * cellWidth,
    height: element.position.rowSpan * cellHeight,
    zIndex: element.zIndex + 10,
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      onSelect(element.id);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    const newCol = Math.round((elementStyle.left + deltaX) / cellWidth);
    const newRow = Math.round((elementStyle.top + deltaY) / cellHeight);

    // Ensure element stays within bounds
    const clampedCol = Math.max(0, Math.min(newCol, gridConfig.cols - element.position.colSpan));
    const clampedRow = Math.max(0, Math.min(newRow, gridConfig.rows - element.position.rowSpan));

    if (clampedCol !== element.position.col || clampedRow !== element.position.row) {
      onMove(element.id, {
        ...element.position,
        col: clampedCol,
        row: clampedRow
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, elementStyle.left, elementStyle.top]);

  const handleContentSave = () => {
    onUpdate(element.id, { content: editValue });
    onEdit(''); // Exit edit mode
  };

  const handleContentCancel = () => {
    setEditValue(element.content);
    onEdit(''); // Exit edit mode
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleContentSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleContentCancel();
    }
  };

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'opacity-70' : ''}`}
      style={{
        ...elementStyle,
        backgroundColor: element.style.backgroundColor,
        color: element.style.color,
        fontSize: element.style.fontSize * scale,
        fontWeight: element.style.fontWeight,
        fontFamily: element.style.fontFamily,
        textAlign: element.style.textAlign,
        padding: element.style.padding * scale,
        borderRadius: element.style.borderRadius * scale,
        border: element.style.border,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onSelect(element.id)}
    >
      {/* Drag Handle */}
      {isSelected && !isEditing && (
        <div className="drag-handle absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-move opacity-80 hover:opacity-100">
          <Move className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Content */}
      {isEditing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleContentSave}
          className="w-full h-full resize-none border-none outline-none bg-transparent"
          style={{
            fontSize: element.style.fontSize * scale,
            fontWeight: element.style.fontWeight,
            fontFamily: element.style.fontFamily,
            textAlign: element.style.textAlign,
            color: element.style.color,
          }}
          autoFocus
        />
      ) : (
        <div
          className="w-full h-full overflow-hidden"
          onDoubleClick={() => onEdit(element.id)}
        >
          {element.content || 'Double-click to edit'}
        </div>
      )}

      {/* Action Buttons */}
      {isSelected && !isEditing && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(element.id);
            }}
            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
            title="Edit"
          >
            <Edit3 className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(element.id);
            }}
            className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
            title="Duplicate"
          >
            <Copy className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
            title="Delete"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}