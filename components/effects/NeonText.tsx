import React from 'react';
import { motion } from 'framer-motion';

export const NeonText: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = '#00DC82' }) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      style={{
        color: color,
        textShadow: `
          0 0 10px ${color},
          0 0 20px ${color},
          0 0 30px ${color},
          0 0 40px ${color}
        `,
      }}
      animate={{
        textShadow: [
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
          `0 0 15px ${color}, 0 0 25px ${color}, 0 0 35px ${color}, 0 0 50px ${color}`,
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
};
