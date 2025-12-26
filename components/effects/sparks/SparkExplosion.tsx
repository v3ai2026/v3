/**
 * SparkExplosion - 点击爆炸效果组件
 * Click explosion effect component 💥
 */

import React, { useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { sparkConfig, SparkType } from '../../../utils/sparkConfig';

interface SparkExplosionProps {
  trigger?: 'click' | 'mount';
  intensity?: 'low' | 'medium' | 'high';
  colors?: string[];
  enabled?: boolean;
}

export const SparkExplosion: React.FC<SparkExplosionProps> = ({
  trigger = 'click',
  intensity = 'high',
  colors,
  enabled = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !enabled) return;

    const canvas = canvasRef.current;
    const isMobile = window.innerWidth < 768;
    
    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    systemRef.current = new ParticleSystem(canvas, isMobile);
    systemRef.current.start();

    const handleClick = (e: MouseEvent) => {
      if (!systemRef.current || !enabled) return;

      const config = { ...sparkConfig.explosion };
      
      // Adjust intensity
      if (intensity === 'low') {
        config.count = Math.floor(config.count / 3);
      } else if (intensity === 'medium') {
        config.count = Math.floor(config.count / 2);
      }

      // Override colors if provided
      if (colors) {
        config.colors = colors;
      }

      systemRef.current.createExplosion(e.clientX, e.clientY, config);
    };

    if (trigger === 'click') {
      window.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('click', handleClick);
      systemRef.current?.stop();
    };
  }, [trigger, intensity, colors, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
