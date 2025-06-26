import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GripHorizontal } from 'lucide-react';

interface MultiResizablePanelProps {
  sections: {
    id: string;
    content: React.ReactNode;
    minHeight?: number;
    defaultHeight?: number;
  }[];
  className?: string;
}

const MultiResizablePanel: React.FC<MultiResizablePanelProps> = ({
  sections,
  className = ''
}) => {
  const [heights, setHeights] = useState<number[]>(() => {
    // Initialize heights based on defaultHeight or equal distribution
    const totalSections = sections.length;
    return sections.map((section, index) => {
      if (section.defaultHeight) return section.defaultHeight;
      return 100 / totalSections; // Equal distribution as percentage
    });
  });
  
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragIndex(index);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragIndex === null || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const mouseY = e.clientY - containerRect.top;
    
    // Calculate new heights
    const newHeights = [...heights];
    const currentSection = dragIndex;
    const nextSection = dragIndex + 1;
    
    if (nextSection >= sections.length) return;

    // Calculate the total height of current and next sections
    const totalHeight = heights[currentSection] + heights[nextSection];
    const newCurrentHeight = (mouseY - getSectionOffsetTop(currentSection)) / containerHeight * 100;
    const newNextHeight = totalHeight - newCurrentHeight;

    // Apply minimum height constraints
    const minCurrentHeight = sections[currentSection].minHeight || 10;
    const minNextHeight = sections[nextSection].minHeight || 10;

    if (newCurrentHeight >= minCurrentHeight && newNextHeight >= minNextHeight) {
      newHeights[currentSection] = newCurrentHeight;
      newHeights[nextSection] = newNextHeight;
      setHeights(newHeights);
    }
  }, [dragIndex, heights, sections]);

  const getSectionOffsetTop = (index: number): number => {
    if (!containerRef.current) return 0;
    const containerHeight = containerRef.current.getBoundingClientRect().height;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (heights[i] / 100) * containerHeight;
    }
    return offset;
  };

  const handleMouseUp = useCallback(() => {
    setDragIndex(null);
  }, []);

  useEffect(() => {
    if (dragIndex !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragIndex, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className={`flex flex-col h-full ${className}`}>
      {sections.map((section, index) => (
        <React.Fragment key={section.id}>
          {/* Section Content */}
          <div 
            className="flex flex-col overflow-hidden"
            style={{ height: `${heights[index]}%` }}
          >
            {section.content}
          </div>

          {/* Resizer (only between sections, not after the last one) */}
          {index < sections.length - 1 && (
            <div
              className={`group flex items-center justify-center h-1 bg-[var(--color-border)] hover:bg-indigo-500 cursor-row-resize transition-colors relative ${
                dragIndex === index ? 'bg-indigo-500' : ''
              }`}
              onMouseDown={handleMouseDown(index)}
            >
              <div className="absolute inset-x-0 -top-1 -bottom-1 flex items-center justify-center">
                <GripHorizontal className="w-4 h-3 text-[var(--color-text-secondary)] group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MultiResizablePanel;