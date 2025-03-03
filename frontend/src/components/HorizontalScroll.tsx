import React, { useEffect, useRef, useState } from 'react';

export const HorizontalScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  let scrollTimeout: NodeJS.Timeout;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      const delta = Math.max(-1, Math.min(1, e.deltaY || -e.detail));
      const scrollAmount = delta * 30; // Reduced scroll speed
      
      setIsScrolling(true);
      
      // Smooth scroll animation
      const startPosition = container.scrollLeft;
      const targetPosition = startPosition + scrollAmount;
      const duration = 300; // Longer duration for smoother scroll
      const startTime = performance.now();
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother movement
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        container.scrollLeft = startPosition + (scrollAmount * easeProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          // Update URL hash based on visible section
          const sections = container.getElementsByClassName('horizontal-section');
          const containerWidth = container.clientWidth;
          const scrollPosition = container.scrollLeft;
          
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i] as HTMLElement;
            const sectionLeft = section.offsetLeft;
            const sectionWidth = section.clientWidth;
            
            if (
              scrollPosition >= sectionLeft - containerWidth / 3 &&
              scrollPosition < sectionLeft + sectionWidth - containerWidth / 3
            ) {
              const id = section.id;
              if (id && window.location.hash !== `#${id}`) {
                window.history.replaceState(null, '', `#${id}`);
              }
              break;
            }
          }
          
          // Reset scrolling state after a short delay
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            setIsScrolling(false);
          }, 50);
        }
      };
      
      requestAnimationFrame(animateScroll);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling]);

  return (
    <div ref={containerRef} className="horizontal-scroll-container">
      <div className="horizontal-sections">
        {children}
      </div>
    </div>
  );
};
