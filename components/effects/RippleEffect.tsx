import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const RippleEffect: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    const handleClick = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation with cleanup tracking
      const timeoutId = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1000);
      
      timeoutIds.push(timeoutId);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      // Clear all pending timeouts
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 9997 }}>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute rounded-full border-2 border-[#00DC82]"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 40,
              height: 40,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
