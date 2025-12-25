import React from 'react';
import { motion } from 'framer-motion';

export const ScanLines: React.FC<{ className?: string; intensity?: number }> = ({ 
  className = '', 
  intensity = 0.03 
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      {/* Horizontal scan lines */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 220, 130, ' + intensity + ') 2px, rgba(0, 220, 130, ' + intensity + ') 4px)',
        }}
      />
      
      {/* Moving scan line */}
      <motion.div
        className="absolute left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 220, 130, 0.5), transparent)',
          boxShadow: '0 0 20px rgba(0, 220, 130, 0.5)',
        }}
        initial={{ top: 0 }}
        animate={{ top: '100%' }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};
