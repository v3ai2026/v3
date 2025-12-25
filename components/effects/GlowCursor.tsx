import React, { useEffect, useState } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';

export const GlowCursor: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mousePosition = useMousePosition();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if it's a mobile device
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Don't render on mobile devices
  if (isMobile) return null;

  return (
    <>
      {/* Main glow */}
      <div
        className={`fixed pointer-events-none transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
        }}
      >
        <div
          className="w-8 h-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 220, 130, 0.4) 0%, rgba(0, 220, 130, 0.1) 40%, transparent 70%)',
            boxShadow: '0 0 30px rgba(0, 220, 130, 0.4)',
          }}
        />
      </div>

      {/* Trailing effect */}
      <div
        className={`fixed pointer-events-none transition-all duration-150 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 9998,
        }}
      >
        <div
          className="w-16 h-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 220, 130, 0.2) 0%, transparent 70%)',
          }}
        />
      </div>
    </>
  );
};
