import React, { useEffect, useRef, useState } from 'react';

export const IsotopeCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Track mouse and position directly
  const mouse = useRef({ x: -100, y: -100 });
  
  // We keep a 'position' ref just to maintain the loop structure, 
  // but we will sync it instantly to mouse.
  const position = useRef({ x: -100, y: -100 });
  
  const requestRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hasMoved = useRef(false);

  useEffect(() => {
    // Only enable on desktop
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Initialize position on first move to prevent "fly-in" animation
      if (!hasMoved.current) {
        hasMoved.current = true;
        position.current = { x: e.clientX, y: e.clientY };
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Optimized check: rely on specific interactive tags first before computing styles
      const tagName = target.tagName.toLowerCase();
      const isInteractive = 
        tagName === 'button' || 
        tagName === 'a' || 
        tagName === 'input' ||
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button';

      if (isInteractive) {
        setIsHovering(true);
      } else {
        // Fallback to computed style only if necessary (heavier operation)
        const cursorStyle = window.getComputedStyle(target).cursor;
        setIsHovering(cursorStyle === 'pointer');
      }
    };

    const animate = () => {
      // INSTANT MOVEMENT - No interpolation (Lerp)
      // This ensures zero lag. The cursor sticks to the mouse coordinate 1:1.
      position.current.x = mouse.current.x;
      position.current.y = mouse.current.y;

      if (cursorRef.current) {
        // Use translate3d for GPU acceleration
        cursorRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.body.classList.add('no-cursor');
    
    // Start loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('no-cursor');
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Don't render until we have a position
  if (!isVisible) return null;

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform backface-hidden"
      style={{ 
        // Ensure hardware acceleration context
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        perspective: 1000,
        WebkitPerspective: 1000
      }}
    >
      <div className={`relative flex items-center justify-center transition-transform duration-150 ease-out ${isHovering ? 'scale-150' : 'scale-100'}`}>
        {/* Single Orbital Ring */}
        <div className="absolute w-12 h-12 border border-brand-cyan/40 rounded-full animate-spin-electron will-change-transform">
           {/* Electron */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_8px_#01BEFF]"></div>
        </div>
        
        {/* Nucleus */}
        <div className={`w-3 h-3 rounded-full bg-gradient-to-br from-brand-green to-brand-cyan shadow-lg animate-pulse-glow ${isHovering ? 'shadow-brand-cyan/50' : ''}`}></div>
      </div>
    </div>
  );
};