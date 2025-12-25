# Animation Effects Components

This directory contains all the cool animation and visual effect components for the application.

## Components

### Background Effects

- **ParticleBackground.tsx** - Animated particle system with glowing particles and connection lines
- **AnimatedGrid.tsx** - Dynamic grid background with animated scanning effect
- **ScanLines.tsx** - Cyberpunk-style scan lines with moving highlight
- **AnimatedGradient.tsx** - Pulsing gradient overlays

### Interactive Effects

- **GlowCursor.tsx** - Custom glowing cursor effect (desktop only)
- **RippleEffect.tsx** - Click ripple effect spreading from cursor position
- **ScrollProgress.tsx** - Animated progress bar at top of page

### Text Effects

- **TypewriterText.tsx** - Typewriter animation for text
- **GlitchText.tsx** - Glitch effect with RGB color separation
- **NeonText.tsx** - Neon glow effect with pulsing animation

## Usage

All effects are integrated into the main App.tsx. They are layered in the background with appropriate z-indexes:

```tsx
<AnimatedGradient /> // z-index: -1
<ParticleBackground /> // z-index: 0
<AnimatedGrid /> // z-index: 0
<ScanLines /> // z-index: 1
<GlowCursor /> // z-index: 9999
<RippleEffect /> // z-index: 9997
<ScrollProgress /> // z-index: 9999
```

## Performance

- All effects use GPU acceleration (transform, opacity)
- Particle count is reduced on mobile devices
- Effects respect `prefers-reduced-motion` media query
- Canvas-based effects use requestAnimationFrame for smooth 60fps

## Customization

Each component accepts className and other props for customization:

```tsx
<ScanLines intensity={0.02} />
<ParticleBackground className="opacity-50" />
<TypewriterText text="Hello" speed={50} />
```
