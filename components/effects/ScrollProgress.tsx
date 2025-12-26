import React from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const ScrollProgress: React.FC<{ className?: string }> = ({ className = '' }) => {
  const scrollProgress = useScrollProgress();

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 z-[9999] origin-left ${className}`}
      style={{
        background: 'linear-gradient(90deg, #00DC82, #00C16A, #00DC82)',
        boxShadow: '0 0 10px rgba(0, 220, 130, 0.5)',
        scaleX: scrollProgress / 100,
      }}
      initial={{ scaleX: 0 }}
    />
  );
};
