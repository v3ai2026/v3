/**
 * Spark Effects Configuration
 * Central configuration for particle effects and animations
 */

export interface SparkConfig {
  count: number;
  size: number;
  speed: number;
  lifetime: number;
  spread: number;
  color: string;
  glow: boolean;
}

export const sparkConfig = {
  // Flow effect (border animations)
  flow: {
    count: 3,
    size: 3,
    speed: 2,
    lifetime: 1000,
    spread: 0.3,
    color: '#00DC82',
    glow: true
  },
  
  // Explosion effect (success celebrations)
  explosion: {
    count: 50,
    size: 4,
    speed: 5,
    lifetime: 1500,
    spread: Math.PI * 2,
    color: '#00DC82',
    glow: true
  },
  
  // Rain effect (background ambiance)
  rain: {
    count: 100,
    size: 2,
    speed: 3,
    lifetime: 2000,
    spread: 0.5,
    color: '#00DC82',
    glow: false
  },
  
  // Trail effect (mouse follows)
  trail: {
    count: 5,
    size: 3,
    speed: 1,
    lifetime: 800,
    spread: 0.2,
    color: '#00DC82',
    glow: true
  },
  
  // Success fireworks
  fireworks: {
    count: 80,
    size: 5,
    speed: 8,
    lifetime: 2000,
    spread: Math.PI * 2,
    color: '#00DC82',
    glow: true
  }
};

export default sparkConfig;
