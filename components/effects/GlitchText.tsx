import React from 'react';
import { motion } from 'framer-motion';

export const GlitchText: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, className = '', intensity = 'medium' }) => {
  const glitchIntensity = {
    low: 2,
    medium: 4,
    high: 8,
  };

  const glitchDistance = glitchIntensity[intensity];

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Original text */}
      <span className="relative z-10">{children}</span>
      
      {/* Glitch layer 1 - Red */}
      <motion.span
        className="absolute inset-0 text-red-500 opacity-70 z-0"
        animate={{
          x: [0, -glitchDistance, glitchDistance, 0],
          y: [0, glitchDistance, -glitchDistance, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'linear',
        }}
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
      >
        {children}
      </motion.span>

      {/* Glitch layer 2 - Blue */}
      <motion.span
        className="absolute inset-0 text-blue-500 opacity-70 z-0"
        animate={{
          x: [0, glitchDistance, -glitchDistance, 0],
          y: [0, -glitchDistance, glitchDistance, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2,
          delay: 0.1,
          ease: 'linear',
        }}
        style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
      >
        {children}
      </motion.span>
    </div>
  );
};
