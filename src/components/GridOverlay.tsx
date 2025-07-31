import React from 'react';
import { GridConfig } from '@/types/grid';

interface GridOverlayProps {
  gridConfig: GridConfig;
  canvasWidth: number;
  canvasHeight: number;
  scale?: number;
}

export default function GridOverlay({ 
  gridConfig, 
  canvasWidth, 
  canvasHeight, 
  scale = 1 
}: GridOverlayProps) {
  if (!gridConfig.showGrid) return null;

  const cellWidth = canvasWidth / gridConfig.cols;
  const cellHeight = canvasHeight / gridConfig.rows;

  // Generate vertical lines
  const verticalLines = Array.from({ length: gridConfig.cols + 1 }, (_, i) => (
    <line
      key={`v-${i}`}
      x1={i * cellWidth}
      y1={0}
      x2={i * cellWidth}
      y2={canvasHeight}
      stroke={gridConfig.gridColor}
      strokeWidth={0.5 / scale}
      opacity={0.6}
    />
  ));

  // Generate horizontal lines
  const horizontalLines = Array.from({ length: gridConfig.rows + 1 }, (_, i) => (
    <line
      key={`h-${i}`}
      x1={0}
      y1={i * cellHeight}
      x2={canvasWidth}
      y2={i * cellHeight}
      stroke={gridConfig.gridColor}
      strokeWidth={0.5 / scale}
      opacity={0.6}
    />
  ));

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ zIndex: 1 }}
    >
      {verticalLines}
      {horizontalLines}
    </svg>
  );
}