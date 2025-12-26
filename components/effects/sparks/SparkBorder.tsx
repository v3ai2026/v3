/**
 * SparkBorder - 边框流动火花效果组件
 * Border flow spark effect component ⚡
 */

import React, { useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { sparkConfig } from '../../../utils/sparkConfig';

interface SparkBorderProps {
  targetRef: React.RefObject<HTMLElement>;
  flow?: 'clockwise' | 'counterclockwise';
  speed?: number;
  enabled?: boolean;
}

export const SparkBorder: React.FC<SparkBorderProps> = ({
  targetRef,
  flow = 'clockwise',
  speed = 2,
  enabled = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const angleRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !enabled || !targetRef.current) return;

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

    const animateBorder = () => {
      if (!systemRef.current || !targetRef.current || !enabled) return;

      const rect = targetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate position on border
      const radiusX = rect.width / 2;
      const radiusY = rect.height / 2;

      const x = centerX + Math.cos(angleRef.current) * radiusX;
      const y = centerY + Math.sin(angleRef.current) * radiusY;

      const config = { ...sparkConfig.flow };
      systemRef.current.createFlow(x, y, angleRef.current + Math.PI / 2, config);

      // Update angle
      const direction = flow === 'clockwise' ? 1 : -1;
      angleRef.current += (0.05 * speed * direction);

      animationRef.current = requestAnimationFrame(animateBorder);
    };

    animationRef.current = requestAnimationFrame(animateBorder);

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      systemRef.current?.stop();
    };
  }, [targetRef, flow, speed, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9996]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
