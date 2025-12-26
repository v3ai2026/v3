# VisionCommerce Brand Guidelines

## 🎨 Brand Identity

**VisionCommerce** (视觉商务) - Revolutionizing online shopping through 3D visualization and augmented reality.

### Mission Statement

> "让购物看得见真实 - Making Shopping Tangibly Real"

We empower e-commerce businesses to provide immersive, interactive shopping experiences through cutting-edge 3D and AR technologies.

### Vision

To become the global standard for visual commerce, where every online shopper can see, try, and experience products before purchase.

### Core Values

1. **Innovation** - Pushing the boundaries of AR/3D technology
2. **Accessibility** - Making advanced tech available to all
3. **Privacy** - Respecting user data and processing locally
4. **Quality** - Delivering exceptional user experiences
5. **Openness** - Contributing to the open-source community

---

## 🎯 Brand Name

### Primary Name
**VisionCommerce**

- **English**: VisionCommerce
- **Chinese**: 视觉商务
- **Pronunciation**: VIH-zhuhn KAH-murs

### Usage Guidelines

✅ **Correct:**
- VisionCommerce (one word, camel case)
- VisionCommerce platform
- VisionCommerce AR technology

❌ **Incorrect:**
- Vision Commerce (two words)
- visioncommerce (all lowercase)
- VISIONCOMMERCE (all uppercase)
- VC (abbreviation - avoid in marketing)

---

## 🎨 Color Palette

### Primary Colors

#### Nuxt Green (Brand Primary)
- **Hex**: `#00DC82`
- **RGB**: `rgb(0, 220, 130)`
- **Usage**: Primary actions, highlights, brand elements
- **Accessibility**: WCAG AA compliant on dark backgrounds

#### Deep Space (Background)
- **Hex**: `#020420`
- **RGB**: `rgb(2, 4, 32)`
- **Usage**: Main backgrounds, containers
- **Accessibility**: High contrast for text

### Secondary Colors

#### Slate Border
- **Hex**: `#1a1e43`
- **RGB**: `rgb(26, 30, 67)`
- **Usage**: Borders, dividers, subtle elements

#### White
- **Hex**: `#ffffff`
- **RGB**: `rgb(255, 255, 255)`
- **Usage**: Text on dark backgrounds, icons

### Accent Colors

#### Success Green
- **Hex**: `#10B981`
- **Usage**: Success messages, completed states

#### Warning Yellow
- **Hex**: `#F59E0B`
- **Usage**: Warnings, attention-needed states

#### Error Red
- **Hex**: `#EF4444`
- **Usage**: Errors, critical alerts

#### Info Blue
- **Hex**: `#3B82F6`
- **Usage**: Informational messages

### Gradient

```css
.brand-gradient {
  background: linear-gradient(135deg, #00DC82 0%, #00C16A 100%);
}
```

---

## 🔤 Typography

### Primary Font
**Inter** - Modern, clean, highly legible

- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)
- **Usage**: Body text, headings, UI elements
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Monospace Font
**JetBrains Mono** - Code and technical content

- **Weights**: 400 (Regular), 500 (Medium)
- **Usage**: Code blocks, file names, technical values
- **Fallback**: Consolas, Monaco, "Courier New", monospace

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 60px / 3.75rem | 800 | 1.1 |
| H2 | 48px / 3rem | 800 | 1.2 |
| H3 | 32px / 2rem | 700 | 1.3 |
| H4 | 24px / 1.5rem | 700 | 1.4 |
| Body Large | 18px / 1.125rem | 400 | 1.6 |
| Body | 16px / 1rem | 400 | 1.6 |
| Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 500 | 1.4 |
| Label | 10px / 0.625rem | 800 | 1.3 |

---

## 📐 Logo

### Logo Design Concept

The VisionCommerce logo combines:
- **3D Cube**: Representing 3D visualization
- **AR Triangle**: Symbolizing augmented reality
- **Eye Icon**: Vision and seeing products
- **Modern Typography**: Clean, tech-forward

### Logo Variations

1. **Full Logo**: Icon + Wordmark
2. **Icon Only**: For small spaces (favicon, app icons)
3. **Wordmark Only**: For headers, documents

### Clear Space

Maintain clear space around logo equal to the height of the "V" in VisionCommerce.

### Minimum Sizes

- **Full Logo**: 120px width (digital), 30mm (print)
- **Icon Only**: 32px (digital), 8mm (print)

### Logo Colors

- **Primary**: Nuxt Green (#00DC82) on Deep Space (#020420)
- **Reversed**: White (#ffffff) on colored backgrounds
- **Monochrome**: Black or white for special cases

### Usage Don'ts

❌ Don't stretch or distort
❌ Don't rotate
❌ Don't add effects (shadows, gradients, etc.)
❌ Don't place on busy backgrounds
❌ Don't change colors outside brand palette

---

## 🎭 Brand Voice & Tone

### Voice Characteristics

- **Innovative**: Forward-thinking, cutting-edge
- **Friendly**: Approachable, helpful
- **Professional**: Credible, trustworthy
- **Empowering**: Enabling merchants and shoppers

### Tone by Context

**Marketing**: Exciting, inspiring, benefit-focused
> "Transform your online store with AR try-on technology"

**Documentation**: Clear, instructive, helpful
> "Follow these steps to integrate 3D product viewing"

**Error Messages**: Apologetic, solution-oriented
> "We couldn't load the model. Please check your connection and try again"

**Success Messages**: Celebratory, encouraging
> "Great! Your 3D store is now live"

---

## 🖼️ Imagery Style

### Photography

- **Product Photos**: Clean, well-lit, multiple angles
- **People**: Diverse, authentic, engaging with technology
- **Environments**: Modern retail spaces, clean backgrounds
- **Avoid**: Stock-feeling images, overly posed shots

### 3D Renderings

- **Style**: Realistic with subtle artistic enhancement
- **Lighting**: Studio-quality, consistent across products
- **Backgrounds**: Neutral or complementary to brand colors
- **Quality**: High-poly models, detailed textures

### AR Demonstrations

- **Real Environments**: Actual rooms, faces, spaces
- **Natural Lighting**: Realistic lighting conditions
- **Clear Overlays**: Visible AR elements without being overwhelming
- **Context**: Show practical use cases

---

## 🎬 Animation & Motion

### Principles

1. **Purpose**: Every animation serves a function
2. **Performance**: 60 FPS on desktop, 30 FPS on mobile
3. **Easing**: Natural, physics-based curves
4. **Duration**: Quick but not jarring (200-400ms typical)

### Common Animations

- **Page Transitions**: Fade + subtle scale (300ms)
- **Modal Appearance**: Slide up + fade (250ms)
- **Button Hover**: Scale + color shift (200ms)
- **Loading**: Smooth spinner or skeleton screens
- **AR Tracking**: Smooth interpolation, no jitter

---

## 📱 Icon Style

### Characteristics

- **Style**: Rounded, modern, consistent line weights
- **Stroke**: 2px standard
- **Corners**: Rounded (2px radius)
- **Grid**: 24×24px base
- **Color**: Single color, no gradients

### Icon Library

Using combination of:
- **Heroicons**: Primary UI icons
- **Custom**: Specialized AR/3D icons
- **Emoji**: Fun, expressive elements (👓, 🏪, 📦)

---

## 🌍 Localization

### Supported Languages

- **English**: Primary language
- **Chinese (Simplified)**: 简体中文
- More languages coming soon

### Translation Guidelines

- Maintain brand voice in all languages
- Adapt idioms and cultural references
- Keep technical terms consistent
- Test UI layout with translated text

---

## ♿ Accessibility

### WCAG Compliance

- **Level AA** compliance minimum
- **Level AAA** where possible

### Color Contrast

- Text on backgrounds: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Keyboard Navigation

- All features accessible via keyboard
- Visible focus indicators
- Logical tab order

---

## 📄 Document Templates

### Headers

```
VisionCommerce | [Document Title]
```

### Footers

```
© 2025 VisionCommerce | MIT License
```

### Email Signatures

```
[Name]
[Role] | VisionCommerce
[Email] | [Website]
```

---

## 🚀 Marketing Taglines

### Primary
> "让购物看得见真实"
> "See Before You Buy"

### Secondary
- "AR Commerce, Realized"
- "Try Everything, Virtually"
- "3D Shopping, Real Decisions"
- "The Future of Online Retail"

---

## 📞 Brand Contact

For brand usage questions:
- **Email**: brand@visioncommerce.dev
- **Assets**: [Brand Kit Download Link]

---

**Last Updated**: December 25, 2025
**Version**: 1.0.0
