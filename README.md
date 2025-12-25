<div align="center">

# 🛍️ VisionCommerce

### 让购物看得见真实 | See Before You Buy

**Next-generation AR/3D e-commerce platform revolutionizing online shopping**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-0%20vulnerabilities-brightgreen)](./SECURITY.md)
[![Build Status](https://img.shields.io/badge/build-passing-success)](https://github.com/visioncommerce/visioncommerce)

[Features](#-key-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 About VisionCommerce

VisionCommerce is a comprehensive 3D/AR virtual store system that brings products to life through interactive visualization, real-time face tracking for virtual try-on, and AI-powered recommendations.

**Perfect for:**
- 🛒 E-commerce platforms
- 👓 Fashion & accessories retailers
- 🏠 Furniture & home décor stores
- 💄 Beauty & cosmetics brands
- 📱 Any business wanting immersive product experiences

---

## ✨ Key Features

### 🎮 3D Product Visualization
- **360° Interactive Viewer** - Rotate, zoom, and inspect products from every angle
- **Real-time Material Switching** - Change colors, textures, and materials instantly
- **4 Environment Presets** - Studio, City, Sunset, Warehouse lighting
- **Auto-rotation Mode** - Automatic product showcase
- **Screenshot Capture** - Share product views with customers

### 👓 AR Try-On System
- **Face Tracking** - MediaPipe-powered 468-point facial recognition
- **Virtual Glasses Try-On** - See how glasses look in real-time
- **Photo Capture** - Save AR photos with 4 filter effects
- **Multi-product Support** - Switch between products instantly
- **Mobile Optimized** - Works on iOS and Android browsers

### 🏪 Virtual Store Experience
- **3D Store Navigation** - Walk through immersive retail environments
- **Interactive Displays** - Click products for details
- **Dynamic Effects** - Hover animations and lighting
- **Shopping Cart** - Seamless purchase integration

### 🤖 AI-Powered Features
- **Body Analysis** - Smart BMI calculation and body type classification
- **Size Recommendations** - XS to XXL sizing with confidence scores
- **Measurement Estimation** - Chest, waist, and hip measurements

### 📱 Social Integration
- **Photo Filters** - Vintage, Vivid, Noir effects
- **Platform Sharing** - WeChat, Weibo, TikTok ready
- **Download & Save** - High-quality image export

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- Modern browser (Chrome 90+, Safari 14+, Firefox 88+)

### Installation

```bash
# Clone the repository
git clone https://github.com/visioncommerce/visioncommerce.git
cd visioncommerce

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see VisionCommerce in action!

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 📦 Project Structure

```
visioncommerce/
├── components/          # React components
│   ├── 3d/             # 3D visualization components
│   │   ├── Product3DViewer.tsx
│   │   └── VirtualStoreScene.tsx
│   ├── ar/             # AR try-on components
│   │   ├── ARCamera.tsx
│   │   └── ARGlassesTryOn.tsx
│   ├── ai/             # AI analysis components
│   │   └── BodyAnalyzer.tsx
│   └── social/         # Social sharing components
│       └── PhotoCapture.tsx
├── hooks/              # Custom React hooks
│   └── useMediaPipeFace.ts
├── lib/                # Utility libraries
│   ├── 3d/            # 3D utilities
│   │   └── modelLoader.ts
│   └── ar/            # AR utilities
│       └── arUtils.ts
├── services/           # API services
├── docs/              # Documentation
│   ├── AR_3D_STORE.md
│   ├── 3D_MODEL_GUIDE.md
│   └── BRAND_GUIDELINES.md
└── types.ts           # TypeScript definitions
```

---

## 🎯 Usage Examples

### Adding a 3D Product

```typescript
const product: Product3D = {
  id: 'smart-watch-x1',
  name: 'Smart Watch X1',
  description: 'Next-gen wearable technology',
  modelUrl: '/models/smartwatch.glb',
  modelFormat: 'GLB',
  category: 'electronics',
  price: 499,
  variants: [
    {
      id: 'color-black',
      name: 'Space Gray',
      type: 'color',
      value: 'Space Gray',
      hexColor: '#3A3A3C'
    }
  ]
};
```

### Setting Up AR Try-On

```typescript
const glasses: ARProduct = {
  id: 'aviator-gold',
  name: 'Classic Aviator',
  modelUrl: '/models/aviator.glb',
  modelFormat: 'GLB',
  category: 'accessories',
  price: 199,
  arEnabled: true,
  arType: 'face',
  scale: [1, 1, 1],
  offset: [0, 0.02, 0.1]  // Fine-tune position
};
```

### Using Face Tracking

```typescript
import { useMediaPipeFace, calculateGlassesTransform } from './hooks/useMediaPipeFace';

const { faceLandmarks, isReady, processFrame } = useMediaPipeFace();

const transform = faceLandmarks 
  ? calculateGlassesTransform(faceLandmarks[0])
  : null;
```

---

## 📚 Documentation

### User Guides
- [**AR/3D Store Guide**](docs/AR_3D_STORE.md) - Complete user manual
- [**3D Model Integration**](docs/3D_MODEL_GUIDE.md) - How to add custom 3D models
- [**Brand Guidelines**](docs/BRAND_GUIDELINES.md) - Visual identity and usage

### Developer Resources
- [**Contributing Guide**](CONTRIBUTING.md) - How to contribute
- [**Implementation Summary**](IMPLEMENTATION_SUMMARY.md) - Technical overview
- [**Security Policy**](SECURITY.md) - Security practices
- [**Changelog**](CHANGELOG.md) - Version history

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling

### 3D/AR Technologies
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React integration for Three.js
- **@react-three/drei** - Three.js helpers
- **MediaPipe** - Face tracking (468-point mesh)
- **TensorFlow.js** - AI inference

### State & Tools
- **React Hooks** - State management
- **Monaco Editor** - Code editing
- **Cannon.js** - Physics engine (future)

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| iOS Safari | 14+ | ✅ AR Supported |
| Chrome Android | 90+ | ✅ AR Supported |

**WebXR Support**: Chrome Android for AR features

---

## 🔒 Security & Privacy

- ✅ **Local Processing** - All face data processed client-side
- ✅ **No Data Upload** - Facial landmarks never leave your device
- ✅ **User Consent** - Explicit camera permission requests
- ✅ **0 Vulnerabilities** - CodeQL security scanned
- ✅ **Pinned Dependencies** - MediaPipe 0.10.8 for stability

Read our [Security Policy](SECURITY.md) for details.

---

## 📊 Performance

- **Build Size**: 1.76 MB (gzipped: 491 KB)
- **Load Time**: < 3 seconds (first load)
- **Frame Rate**: 60 FPS (desktop), 30 FPS (mobile)
- **Memory**: < 200 MB typical usage

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Three.js** team for the amazing 3D engine
- **MediaPipe** team for face tracking technology
- **React Three Fiber** community for excellent tools
- All our contributors and supporters

---

## 📞 Contact & Support

- **Website**: https://visioncommerce.dev
- **GitHub Issues**: [Report bugs or request features](https://github.com/visioncommerce/visioncommerce/issues)
- **Email**: hello@visioncommerce.dev
- **Twitter**: @VisionCommerce

---

## 🗺️ Roadmap

### Current (v1.0)
- ✅ 3D product viewer with 360° rotation
- ✅ AR glasses try-on
- ✅ AI body analysis
- ✅ Virtual store walkthrough
- ✅ Social sharing features

### Coming Soon (v1.1)
- 🔄 Hat and watch AR try-on
- 🔄 Full-body clothing try-on
- 🔄 AR furniture placement
- 🔄 Style recommendation AI
- 🔄 Virtual shopping assistant

### Future (v2.0)
- 📋 VR headset support
- 📋 Cloth physics simulation
- 📋 Makeup try-on
- 📋 Multi-user shopping sessions
- 📋 Live shopping integration

---

<div align="center">

**Made with ❤️ by the VisionCommerce Team**

**Star ⭐ this repo if you find it helpful!**

[Report Bug](https://github.com/visioncommerce/visioncommerce/issues) · [Request Feature](https://github.com/visioncommerce/visioncommerce/issues) · [View Demo](https://demo.visioncommerce.dev)

</div>
