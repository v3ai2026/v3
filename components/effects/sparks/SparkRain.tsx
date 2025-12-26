/**
 * SparkRain - 背景火花雨效果组件
 * Background spark rain effect component 🌠
 */

import React, { useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { sparkConfig } from '../../../utils/sparkConfig';

interface SparkRainProps {
  density?: number;
  color?: string;
  direction?: 'down' | 'up';
  enabled?: boolean;
}

export const SparkRain: React.FC<SparkRainProps> = ({
  density = 20,
  color,
  direction = 'down',
  enabled = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const intervalRef = useRef<number | null>(null);

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

    const createRainParticle = () => {
      if (!systemRef.current || !enabled) return;

      const config = { ...sparkConfig.rain };
      if (color) {
        config.colors = [color];
      }

      // Random x position across the screen
      const x = Math.random() * canvas.width;
      const y = direction === 'down' ? -10 : canvas.height + 10;

      // Adjust velocity based on direction
      const angle = direction === 'down' ? Math.PI / 2 : -Math.PI / 2;
      const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);

      systemRef.current.createFlow(x, y, angle, config);
    };

    // Create particles at intervals based on density
    const intervalTime = Math.max(50, 500 - density * 20);
    intervalRef.current = window.setInterval(createRainParticle, intervalTime);

    return () => {
      window.removeEventListener('resize', updateSize);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      systemRef.current?.stop();
    };
  }, [density, color, direction, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9995]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
