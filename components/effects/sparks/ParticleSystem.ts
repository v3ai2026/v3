/**
 * 火花粒子系统核心
 * Spark Particle System Core Engine
 */

import type { Position, Particle, ParticleConfig } from './types';

export type { Position, Particle, ParticleConfig };

export class ParticleSystem {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private particlePool: Particle[] = [];
  private maxPoolSize = 1000;
  private isMobile = false;
  
  constructor(canvas: HTMLCanvasElement, isMobile: boolean = false) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isMobile = isMobile;
    this.initializePool();
  }

  private initializePool() {
    for (let i = 0; i < this.maxPoolSize; i++) {
      this.particlePool.push(this.createEmptyParticle());
    }
  }

  private createEmptyParticle(): Particle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1000,
      size: 2,
      color: '#00DC82',
      trail: [],
      gravity: false,
      glow: false,
      alpha: 1,
      rotation: 0,
      rotationSpeed: 0
    };
  }

  private getParticle(): Particle {
    return this.particlePool.pop() || this.createEmptyParticle();
  }

  private returnParticle(particle: Particle) {
    if (this.particlePool.length < this.maxPoolSize) {
      particle.trail = [];
      this.particlePool.push(particle);
    }
  }

  createExplosion(x: number, y: number, config: ParticleConfig) {
    const count = this.isMobile ? Math.floor(config.count / 2) : config.count;
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * (config.spread || 0.5);
      const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
      const size = config.size[0] + Math.random() * (config.size[1] - config.size[0]);
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      
      const particle = this.getParticle();
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.life = config.lifespan;
      particle.maxLife = config.lifespan;
      particle.size = size;
      particle.color = color;
      particle.gravity = config.gravity;
      particle.glow = config.glow && !this.isMobile;
      particle.alpha = 1;
      particle.rotation = Math.random() * Math.PI * 2;
      particle.rotationSpeed = (Math.random() - 0.5) * 0.2;
      
      if (config.trail && !this.isMobile) {
        particle.trail = [];
      }
      
      this.particles.push(particle);
    }
  }

  createTrail(x: number, y: number, config: ParticleConfig) {
    const count = this.isMobile ? 2 : config.count;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
      const size = config.size[0] + Math.random() * (config.size[1] - config.size[0]);
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      
      const particle = this.getParticle();
      particle.x = x + (Math.random() - 0.5) * 10;
      particle.y = y + (Math.random() - 0.5) * 10;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.life = config.lifespan;
      particle.maxLife = config.lifespan;
      particle.size = size;
      particle.color = color;
      particle.gravity = config.gravity;
      particle.glow = config.glow && !this.isMobile;
      particle.alpha = 1;
      
      this.particles.push(particle);
    }
  }

  createFlow(x: number, y: number, angle: number, config: ParticleConfig) {
    const size = config.size[0] + Math.random() * (config.size[1] - config.size[0]);
    const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    
    const particle = this.getParticle();
    particle.x = x;
    particle.y = y;
    particle.vx = Math.cos(angle) * speed;
    particle.vy = Math.sin(angle) * speed;
    particle.life = config.lifespan;
    particle.maxLife = config.lifespan;
    particle.size = size;
    particle.color = color;
    particle.gravity = false;
    particle.glow = config.glow && !this.isMobile;
    particle.alpha = 1;
    
    if (config.trail && !this.isMobile) {
      particle.trail = [];
    }
    
    this.particles.push(particle);
  }

  update(deltaTime: number = 16) {
    const dt = deltaTime / 16;
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      // Apply gravity
      if (p.gravity) {
        p.vy += 0.3 * dt;
      }
      
      // Apply friction
      p.vx *= 0.98;
      p.vy *= 0.98;
      
      // Update rotation
      if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
        p.rotation += p.rotationSpeed * dt;
      }
      
      // Update trail
      if (p.trail && p.trail.length > 0) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 10) {
          p.trail.shift();
        }
      }
      
      // Update life
      p.life -= deltaTime;
      p.alpha = Math.max(0, p.life / p.maxLife);
      
      // Remove dead particles
      if (p.life <= 0) {
        this.returnParticle(p);
        this.particles.splice(i, 1);
      }
    }
  }

  render() {
    if (!this.ctx) return;
    
    this.ctx.save();
    
    for (const p of this.particles) {
      // Draw trail
      if (p.trail && p.trail.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          this.ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        this.ctx.strokeStyle = p.color;
        this.ctx.globalAlpha = p.alpha * 0.3;
        this.ctx.lineWidth = p.size * 0.5;
        this.ctx.stroke();
      }
      
      // Draw glow
      if (p.glow) {
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = p.alpha * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Draw particle
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      
      if (p.rotation !== undefined) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      } else {
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    
    this.ctx.restore();
  }

  start() {
    if (this.animationId !== null) return;
    
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      
      this.update(deltaTime);
      this.render();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  clear() {
    this.particles.forEach(p => this.returnParticle(p));
    this.particles = [];
  }

  getParticleCount(): number {
    return this.particles.length;
  }
}
