# VisionCommerce Automation Scripts

This directory contains automation scripts for VisionCommerce project.

## 📜 Available Scripts

### 🚀 Deployment

**`deploy.sh`** - Deploy to Vercel
```bash
# Deploy to production
./scripts/deploy.sh production

# Deploy preview
./scripts/deploy.sh preview
```

### 🛠️ Setup

**`setup.sh`** - Initial project setup
```bash
./scripts/setup.sh
```

What it does:
- ✅ Checks Node.js version
- ✅ Installs dependencies
- ✅ Creates .env.local file
- ✅ Builds the project

### 🔍 Quality Check

**`check.sh`** - Run all code quality checks
```bash
./scripts/check.sh
```

What it checks:
- ✅ ESLint
- ✅ TypeScript type checking
- ✅ Tests (if available)
- ✅ Build

## 🔐 Making Scripts Executable

```bash
chmod +x scripts/*.sh
```

## 🤖 GitHub Actions

All automation is also available via GitHub Actions:

- **deploy.yml** - Automatic deployment on push/PR
- **ci.yml** - Continuous integration pipeline
- **release.yml** - Automatic releases on git tags

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Vercel CLI (for deployment)

## 🆘 Troubleshooting

**Permission denied**:
```bash
chmod +x scripts/deploy.sh
```

**Vercel CLI not found**:
```bash
npm install -g vercel
```

**Build fails**:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/visioncommerce/visioncommerce/issues
- Documentation: `/docs`
