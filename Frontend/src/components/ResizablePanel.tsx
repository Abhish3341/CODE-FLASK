import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 65,
  minLeftWidth = 30,
  minRightWidth = 25
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Enforce minimum widths
    if (newLeftWidth >= minLeftWidth && newLeftWidth <= (100 - minRightWidth)) {
      setLeftWidth(newLeftWidth);
    }
  }, [isDragging, minLeftWidth, minRightWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex h-full">
      {/* Left Panel */}
      <div 
        className="flex flex-col"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className={`group flex items-center justify-center w-1 bg-[var(--color-border)] hover:bg-indigo-500 cursor-col-resize transition-colors relative ${
          isDragging ? 'bg-indigo-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
          <GripVertical className="w-3 h-3 text-[var(--color-text-secondary)] group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Right Panel */}
      <div 
        className="flex flex-col"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizablePanel;