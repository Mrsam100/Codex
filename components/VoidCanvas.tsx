
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Fragment, Connection, PanOffset, Theme } from '../types';

interface VoidCanvasProps {
  fragments: Fragment[];
  connections: Connection[];
  activeFragmentId: string | null;
  zoom: number;
  theme: Theme;
  onFragmentSelect: (id: string) => void;
  onZoomChange: (zoom: number) => void;
}

const VoidCanvas: React.FC<VoidCanvasProps> = ({ 
  fragments, 
  connections, 
  activeFragmentId, 
  zoom, 
  theme,
  onFragmentSelect, 
  onZoomChange 
}) => {
  const [pan, setPan] = useState<PanOffset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<PanOffset>({ x: 0, y: 0 });
  
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - pan.x, y: clientY - pan.y };
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (isDragging) {
      setPan({ x: clientX - dragStart.current.x, y: clientY - dragStart.current.y });
    }
  }, [isDragging]);

  const handleEnd = () => setIsDragging(false);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    onZoomChange(Math.max(0.1, Math.min(3, zoom * delta)));
  }, [zoom, onZoomChange]);

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const upHandler = () => handleEnd();
    const touchMoveHandler = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const touchEndHandler = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
      window.addEventListener('touchmove', touchMoveHandler, { passive: false });
      window.addEventListener('touchend', touchEndHandler);
    }
    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      window.removeEventListener('touchmove', touchMoveHandler);
      window.removeEventListener('touchend', touchEndHandler);
    };
  }, [isDragging, handleMove]);

  const colors = {
    void: { node: 'bg-[#141416]', border: 'border-[#3A3A3C]/20', active: 'border-[#C9A962]', line: '#8B7355', text: 'text-[#F5F2E8]' },
    manuscript: { node: 'bg-white', border: 'border-[#2A2A2C]/10', active: 'border-[#8B7355]', line: '#2A2A2C', text: 'text-[#2A2A2C]' },
    eclipse: { node: 'bg-[#1B263B]', border: 'border-[#415A77]/20', active: 'border-[#778DA9]', line: '#778DA9', text: 'text-[#E0E1DD]' }
  }[theme];

  const connectedIds = new Set<string>();
  if (activeFragmentId) {
    connectedIds.add(activeFragmentId);
    connections.forEach(c => {
      if (c.from === activeFragmentId) connectedIds.add(c.to);
      if (c.to === activeFragmentId) connectedIds.add(c.from);
    });
  }

  return (
    <div
      onMouseDown={(e) => e.button === 0 && handleStart(e.clientX, e.clientY)}
      onTouchStart={(e) => e.touches.length === 1 && handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onWheel={handleWheel}
      className={`absolute inset-0 w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} select-none overflow-hidden touch-none`}
    >
      <div 
        className="absolute inset-0 w-full h-full transition-transform duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          {connections.map((conn) => {
            const f1 = fragments.find(f => f.id === conn.from);
            const f2 = fragments.find(f => f.id === conn.to);
            if (!f1 || !f2) return null;
            const x1 = window.innerWidth / 2 + f1.x;
            const y1 = window.innerHeight / 2 + f1.y;
            const x2 = window.innerWidth / 2 + f2.x;
            const y2 = window.innerHeight / 2 + f2.y;
            const isDirectlyActive = activeFragmentId === f1.id || activeFragmentId === f2.id;
            return (
              <line 
                key={conn.id} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isDirectlyActive ? "#C9A962" : colors.line}
                strokeWidth={isDirectlyActive ? 2 : 0.5}
                strokeOpacity={isDirectlyActive ? 0.8 : 0.1}
                className="transition-all duration-700"
              />
            );
          })}
        </svg>

        {fragments.map((fragment) => {
          const isFocused = activeFragmentId === fragment.id;
          const isNeighbor = activeFragmentId && connectedIds.has(fragment.id) && !isFocused;
          const isDimmed = activeFragmentId && !connectedIds.has(fragment.id);
          
          // Use importance to determine node size
          const importanceScale = 1 + (fragment.importance - 1) * 0.15;

          return (
            <div
              key={fragment.id}
              onClick={(e) => { e.stopPropagation(); onFragmentSelect(fragment.id); }}
              role="button"
              tabIndex={0}
              aria-label={`Fragment: ${fragment.text.substring(0, 50)}...`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onFragmentSelect(fragment.id); } }}
              className={`
                absolute w-[220px] md:w-[260px] p-0 rounded-lg border cursor-pointer backdrop-blur-xl transition-all duration-700 pointer-events-auto overflow-hidden
                ${isFocused ? `${colors.active} shadow-[0_0_80px_rgba(201,169,98,0.2)] z-50` : `${colors.border} z-10`}
                ${isNeighbor ? 'opacity-90 scale-100' : ''}
                ${isDimmed ? 'opacity-5 scale-90 grayscale' : 'opacity-100'}
                ${colors.node}
              `}
              style={{
                left: `calc(50% + ${fragment.x}px)`,
                top: `calc(50% + ${fragment.y}px)`,
                transform: `translate(-50%, -50%) scale(${isFocused ? importanceScale * 1.1 : importanceScale})`,
                transitionProperty: 'transform, opacity, border-color, box-shadow'
              }}
            >
              {fragment.imageUrl && (
                <div className="h-32 w-full overflow-hidden opacity-80 border-b border-white/5">
                  <img src={fragment.imageUrl} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 md:p-6">
                <p className={`font-spectral text-xs md:text-sm leading-relaxed ${colors.text} font-light line-clamp-4`}>
                  {fragment.text}
                </p>
                <div className="mt-3 md:mt-4 flex items-center justify-between font-mono text-[7px] text-[#8B7355] uppercase tracking-widest opacity-60">
                  <span>{fragment.category}</span>
                  <span className="hidden md:inline">{fragment.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoidCanvas;
