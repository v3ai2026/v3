# VisionCommerce Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Fastest)

**Step 1**: Install Vercel CLI
```bash
npm install -g vercel
```

**Step 2**: Deploy
```bash
cd /path/to/visioncommerce
vercel
```

Follow the prompts:
- Link to existing project or create new
- Set project name: `visioncommerce`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install --legacy-peer-deps`

**Step 3**: Set Environment Variables (if needed)
```bash
vercel env add GEMINI_API_KEY
```

**Production URL**: `https://visioncommerce.vercel.app` (or your custom domain)

---

### Option 2: Netlify

**Step 1**: Install Netlify CLI
```bash
npm install -g netlify-cli
```

**Step 2**: Deploy
```bash
cd /path/to/visioncommerce
netlify deploy --prod
```

**Build Settings**:
- Build command: `npm run build`
- Publish directory: `dist`
- Install command: `npm install --legacy-peer-deps`

---

### Option 3: GitHub Pages

**Step 1**: Update `vite.config.ts`
```typescript
export default defineConfig({
  base: '/visioncommerce/', // Your repo name
  // ... rest of config
});
```

**Step 2**: Create deployment script `deploy.sh`
```bash
#!/usr/bin/env sh
set -e
npm run build
cd dist
git init
git add -A
git commit -m 'Deploy'
git push -f git@github.com:yourusername/visioncommerce.git main:gh-pages
cd -
```

**Step 3**: Run deployment
```bash
chmod +x deploy.sh
./deploy.sh
```

**Step 4**: Enable GitHub Pages
- Go to repository Settings → Pages
- Source: `gh-pages` branch
- URL: `https://yourusername.github.io/visioncommerce/`

---

### Option 4: Docker + Any Cloud Provider

**Step 1**: Create `Dockerfile`
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Step 2**: Build and run
```bash
docker build -t visioncommerce .
docker run -p 3000:3000 visioncommerce
```

**Step 3**: Deploy to cloud
- AWS ECS, Google Cloud Run, Azure Container Apps
- DigitalOcean App Platform
- Railway, Render, Fly.io

---

## 🔧 Build Configuration

### Current Build Output
```
✓ dist/index.html                    4.04 kB │ gzip:   1.46 kB
✓ dist/assets/index-D5mYyuv2.js  1,762.33 kB │ gzip: 491.42 kB
```

### Performance Optimization (Optional)

To reduce bundle size, consider code splitting:

**vite.config.ts**:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'mediapipe': ['@mediapipe/tasks-vision'],
          'vendor': ['react', 'react-dom']
        }
      }
    }
  }
});
```

---

## 🌐 Environment Variables

Create `.env.production`:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
VITE_API_URL=https://api.visioncommerce.dev
```

Access in code:
```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

---

## 📱 HTTPS & SSL

**Important**: AR features require HTTPS!

- **Vercel/Netlify**: SSL automatic
- **Custom domain**: Use Cloudflare or Let's Encrypt
- **Development**: Use `vite --https`

---

## 🧪 Test Production Build Locally

```bash
# Build
npm run build

# Preview
npm run preview
```

Visit: `http://localhost:4173`

---

## 🔍 Pre-Deployment Checklist

- [ ] Build completes successfully (`npm run build`)
- [ ] No console errors in production build
- [ ] Environment variables set
- [ ] HTTPS enabled (required for camera access)
- [ ] CORS configured (if using separate API)
- [ ] Performance tested (Lighthouse score)
- [ ] Mobile responsive tested
- [ ] Browser compatibility verified

---

## 📊 Monitoring & Analytics

### Recommended Tools

**Performance**:
- Vercel Analytics (automatic on Vercel)
- Google Lighthouse CI
- WebPageTest

**Error Tracking**:
- Sentry
- LogRocket
- Bugsnag

**Usage Analytics**:
- Google Analytics 4
- Plausible (privacy-focused)
- Umami (open-source)

---

## 🆘 Troubleshooting

### Camera Not Working
- ✅ Ensure HTTPS is enabled
- ✅ Check browser permissions
- ✅ Test on multiple browsers

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install --legacy-peer-deps
npm run build
```

### Large Bundle Size
- Enable code splitting (see Performance Optimization)
- Use dynamic imports for heavy components
- Analyze bundle: `npm run build -- --mode analyze`

---

## 🎯 Recommended Deployment

For **VisionCommerce**, we recommend:

1. **Vercel** (fastest, zero-config, automatic SSL)
2. **Netlify** (similar to Vercel, great CI/CD)
3. **Cloudflare Pages** (free, fast global CDN)

All three provide:
- Automatic HTTPS
- Global CDN
- Instant deployments
- Free tier available

---

## 📞 Need Help?

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@visioncommerce.dev

---

**Last Updated**: December 25, 2025
