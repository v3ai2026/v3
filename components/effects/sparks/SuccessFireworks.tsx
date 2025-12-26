/**
 * SuccessFireworks - 成功烟花效果组件
 * Success fireworks effect component 🎆
 */

import React, { useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { sparkConfig } from '../../../utils/sparkConfig';

interface SuccessFireworksProps {
  trigger: boolean;
  duration?: number;
  onComplete?: () => void;
}

export const SuccessFireworks: React.FC<SuccessFireworksProps> = ({
  trigger,
  duration = 3000,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

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

    return () => {
      window.removeEventListener('resize', updateSize);
      systemRef.current?.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!trigger || !systemRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const config = { ...sparkConfig.fireworks };

    // Center explosion
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create initial big explosion
    systemRef.current.createExplosion(centerX, centerY, config);

    // Add vibration feedback on mobile
    if ('vibrate' in navigator && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    // Create multiple explosions at random positions
    let explosionCount = 0;
    const maxExplosions = 8;
    
    intervalRef.current = window.setInterval(() => {
      if (!systemRef.current || explosionCount >= maxExplosions) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const x = canvas.width * (0.2 + Math.random() * 0.6);
      const y = canvas.height * (0.2 + Math.random() * 0.6);
      
      const smallerConfig = {
        ...config,
        count: Math.floor(config.count / 2)
      };

      systemRef.current.createExplosion(x, y, smallerConfig);
      explosionCount++;
    }, 300);

    // Clear after duration
    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      systemRef.current?.clear();
      onComplete?.();
    }, duration);

  }, [trigger, duration, onComplete]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[10000]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
