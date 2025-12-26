/**
 * SparkTrail - 鼠标拖尾效果组件
 * Mouse trail effect component ✨
 */

import React, { useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { sparkConfig } from '../../../utils/sparkConfig';

interface SparkTrailProps {
  follow?: 'mouse' | 'touch';
  density?: number;
  color?: string;
  enabled?: boolean;
}

export const SparkTrail: React.FC<SparkTrailProps> = ({
  follow = 'mouse',
  density = 5,
  color,
  enabled = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current || !enabled) return;

    const canvas = canvasRef.current;
    const isMobile = window.innerWidth < 768;
    
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    systemRef.current = new ParticleSystem(canvas, isMobile);
    systemRef.current.start();

    const createTrailParticles = (x: number, y: number) => {
      if (!systemRef.current || !enabled) return;

      // Throttle particle creation based on density
      frameCountRef.current++;
      if (frameCountRef.current % (11 - density) !== 0) return;

      const config = { ...sparkConfig.trail };
      if (color) {
        config.colors = [color];
      }

      systemRef.current.createTrail(x, y, config);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      let x: number, y: number;
      
      if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
      } else {
        const touch = e.touches[0];
        if (!touch) return;
        x = touch.clientX;
        y = touch.clientY;
      }

      // Only create particles if mouse has moved
      if (lastPositionRef.current) {
        const dx = x - lastPositionRef.current.x;
        const dy = y - lastPositionRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          createTrailParticles(x, y);
          lastPositionRef.current = { x, y };
        }
      } else {
        lastPositionRef.current = { x, y };
      }
    };

    if (follow === 'mouse') {
      window.addEventListener('mousemove', handleMove);
    } else if (follow === 'touch') {
      window.addEventListener('touchmove', handleMove as any);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove as any);
      systemRef.current?.stop();
    };
  }, [follow, density, color, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
