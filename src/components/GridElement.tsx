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
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'se' | 'e' | 's' | null>(null);
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
    const target = e.target as HTMLElement;
    
    // Check if the click is on a resize handle (including parent elements)
    const resizeHandle = target.closest('.resize-handle') as HTMLElement;
    if (resizeHandle) {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizeDirection(resizeHandle.dataset.direction as 'se' | 'e' | 's');
      setDragStart({ x: e.clientX, y: e.clientY });
      onSelect(element.id);
      return;
    }
    
    // Check if the click is on the drag handle or the element itself
    const dragHandle = target.closest('.drag-handle');
    if (dragHandle || e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      onSelect(element.id);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) / scale;
      const deltaY = (e.clientY - dragStart.y) / scale;

      // Calculate new position based on current grid position plus delta
      const currentPixelX = element.position.col * cellWidth;
      const currentPixelY = element.position.row * cellHeight;
      
      const newPixelX = currentPixelX + deltaX;
      const newPixelY = currentPixelY + deltaY;

      const newCol = Math.round(newPixelX / cellWidth);
      const newRow = Math.round(newPixelY / cellHeight);

      // Ensure element stays within bounds
      const clampedCol = Math.max(0, Math.min(newCol, gridConfig.cols - element.position.colSpan));
      const clampedRow = Math.max(0, Math.min(newRow, gridConfig.rows - element.position.rowSpan));

      if (clampedCol !== element.position.col || clampedRow !== element.position.row) {
        onMove(element.id, {
          ...element.position,
          col: clampedCol,
          row: clampedRow
        });
        // Update drag start to prevent accumulating offsets
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    } else if (isResizing && resizeDirection) {
      const deltaX = (e.clientX - dragStart.x) / scale;
      const deltaY = (e.clientY - dragStart.y) / scale;

      const deltaCol = Math.round(deltaX / cellWidth);
      const deltaRow = Math.round(deltaY / cellHeight);

      let newColSpan = element.position.colSpan;
      let newRowSpan = element.position.rowSpan;

      if (resizeDirection === 'e' || resizeDirection === 'se') {
        newColSpan = Math.max(1, Math.min(
          element.position.colSpan + deltaCol,
          gridConfig.cols - element.position.col
        ));
      }

      if (resizeDirection === 's' || resizeDirection === 'se') {
        newRowSpan = Math.max(1, Math.min(
          element.position.rowSpan + deltaRow,
          gridConfig.rows - element.position.row
        ));
      }

      if (newColSpan !== element.position.colSpan || newRowSpan !== element.position.rowSpan) {
        onUpdate(element.id, {
          position: {
            ...element.position,
            colSpan: newColSpan,
            rowSpan: newRowSpan
          }
        });
        // Update drag start to prevent accumulating offsets
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, elementStyle.left, elementStyle.top]);

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
      className={`absolute transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragging || isResizing ? 'opacity-70' : ''} ${
        !isEditing ? 'cursor-pointer' : ''
      }`}
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
        <div 
          className="drag-handle absolute -top-3 -left-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-move opacity-90 hover:opacity-100 shadow-lg border-2 border-white z-10"
        >
          <Move className="w-4 h-4 text-white" />
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

      {/* Resize Handles */}
      {isSelected && !isEditing && (
        <>
          {/* Bottom-right corner resize handle */}
          <div
            className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 cursor-se-resize opacity-60 hover:opacity-100"
            data-direction="se"
            style={{ clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)' }}
          />
          {/* Right edge resize handle */}
          <div
            className="resize-handle absolute top-1/2 -right-1 w-2 h-6 bg-blue-500 cursor-e-resize opacity-60 hover:opacity-100 transform -translate-y-1/2 rounded-r"
            data-direction="e"
          />
          {/* Bottom edge resize handle */}
          <div
            className="resize-handle absolute -bottom-1 left-1/2 w-6 h-2 bg-blue-500 cursor-s-resize opacity-60 hover:opacity-100 transform -translate-x-1/2 rounded-b"
            data-direction="s"
          />
        </>
      )}
    </div>
  );
}