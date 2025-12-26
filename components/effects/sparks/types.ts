/**
 * Particle System Types
 * Shared types for the particle effects system
 */

export interface Position {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  trail: Position[];
  gravity: boolean;
  glow: boolean;
  alpha: number;
  rotation?: number;
  rotationSpeed?: number;
}

export interface ParticleConfig {
  count: number;
  speed: [number, number];
  size: [number, number];
  colors: string[];
  gravity: boolean;
  glow: boolean;
  trail: boolean;
  lifespan: number;
  spread?: number;
  direction?: number;
}
