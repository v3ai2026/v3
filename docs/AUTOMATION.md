# VisionCommerce - Complete Automation Guide

## 🤖 Automation Overview

VisionCommerce features **complete CI/CD automation** for deployment, testing, and releases.

---

## 🚀 GitHub Actions Workflows

### 1. **Automatic Deployment** (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` or `master` → Production deployment
- Pull Request → Preview deployment

**What it does:**
- ✅ Installs dependencies
- ✅ Builds the project
- ✅ Deploys to Vercel automatically
- ✅ Comments deployment URL on PR

**Setup:**
1. Go to GitHub repo Settings → Secrets and variables → Actions
2. Add the following secrets:
   ```
   VERCEL_TOKEN        # Get from: https://vercel.com/account/tokens
   VERCEL_ORG_ID       # Run: vercel link, then check .vercel/project.json
   VERCEL_PROJECT_ID   # Run: vercel link, then check .vercel/project.json
   GEMINI_API_KEY      # (Optional) Your Gemini API key
   ```

**Usage:**
```bash
# Automatically deploys when you push
git push origin main

# Preview deployments for PRs
git checkout -b feature/new-feature
git push origin feature/new-feature
# Create PR → Automatic preview deployment
```

---

### 2. **CI/CD Pipeline** (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop`
- Pull Requests

**What it checks:**
- ✅ Build on Node.js 18.x and 20.x
- ✅ Code linting
- ✅ TypeScript type checking
- ✅ Run tests (if available)
- ✅ Security audit
- ✅ CodeQL analysis
- ✅ Bundle size check
- ✅ Upload build artifacts

**No setup needed** - runs automatically on every push/PR!

---

### 3. **Release Automation** (`.github/workflows/release.yml`)

**Triggers:**
- Push a git tag (e.g., `v1.0.1`)

**What it does:**
- ✅ Builds the project
- ✅ Creates release archive (ZIP)
- ✅ Generates changelog
- ✅ Creates GitHub Release
- ✅ Publishes to npm (optional)

**Usage:**
```bash
# Create and push a tag
git tag v1.0.1
git push origin v1.0.1

# GitHub automatically:
# 1. Creates a release
# 2. Generates changelog
# 3. Uploads build files
```

---

## 📜 Automation Scripts

### Quick Start

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Run setup
./scripts/setup.sh

# Deploy
./scripts/deploy.sh production
```

### Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup.sh` | Initial project setup | `./scripts/setup.sh` |
| `deploy.sh` | Deploy to Vercel | `./scripts/deploy.sh [production\|preview]` |
| `check.sh` | Run quality checks | `./scripts/check.sh` |

---

## 🔄 Complete Automation Workflow

### Development → Production

```
1. Developer makes changes
   ↓
2. Commits and pushes to branch
   ↓
3. CI/CD runs automatically:
   - Builds project
   - Runs tests
   - Security scan
   ↓
4. Creates Pull Request
   ↓
5. Preview deployment created automatically
   ↓
6. Code review
   ↓
7. Merge to main
   ↓
8. Automatic production deployment
   ↓
9. Create git tag for release
   ↓
10. Automatic GitHub Release created
```

---

## ⚙️ Configuration Files

### `.github/workflows/`
- `deploy.yml` - Deployment automation
- `ci.yml` - CI/CD pipeline
- `release.yml` - Release automation

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### `scripts/`
- `deploy.sh` - Manual deployment script
- `setup.sh` - Project setup automation
- `check.sh` - Quality checks

---

## 🎯 Getting Started with Automation

### For First-Time Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/visioncommerce/visioncommerce.git
   cd visioncommerce
   ```

2. **Run automated setup**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure GitHub Secrets** (for auto-deployment)
   - Go to: Settings → Secrets → New repository secret
   - Add: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

4. **Push to trigger automation**
   ```bash
   git add .
   git commit -m "Enable automation"
   git push origin main
   ```

### For Continuous Deployment

**Just push your changes:**
```bash
git add .
git commit -m "Add new feature"
git push origin main
```

✅ Everything else happens automatically!

---

## 📊 Monitoring Automation

### View Workflow Runs
```
GitHub → Actions tab
```

### Check Deployment Status
```
GitHub → Deployments tab
Vercel Dashboard: https://vercel.com/dashboard
```

### View Build Artifacts
```
GitHub → Actions → Select workflow run → Artifacts
```

---

## 🔍 Troubleshooting

### Deployment Fails

**Check GitHub Actions logs:**
1. Go to Actions tab
2. Click on failed workflow
3. Expand failed step

**Common issues:**
- Missing secrets (add to Settings → Secrets)
- Build errors (check build logs)
- Vercel token expired (regenerate token)

### Scripts Not Working

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Check Node.js version
node -v  # Should be 18+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### CI/CD Not Triggering

**Check:**
- Workflow files are in `.github/workflows/`
- YAML syntax is correct
- Branch name matches workflow triggers
- GitHub Actions is enabled (Settings → Actions)

---

## 🎨 Customization

### Change Deployment Branch

Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches:
      - main        # Change this
      - production  # Add more branches
```

### Add Custom Checks

Edit `.github/workflows/ci.yml`:
```yaml
- name: Custom Check
  run: npm run your-custom-script
```

### Modify Build Commands

Edit `vercel.json`:
```json
{
  "buildCommand": "npm run build && npm run postbuild"
}
```

---

## 📋 Automation Checklist

- [x] GitHub Actions workflows created
- [x] Deployment automation configured
- [x] CI/CD pipeline set up
- [x] Release automation ready
- [x] Scripts created and executable
- [x] Documentation complete

---

## 🆘 Support

**Issues with automation?**
- Check GitHub Actions logs
- Review `.github/workflows/` files
- See `scripts/README.md` for script help
- Open a GitHub Issue

**Need help?**
- GitHub Issues: [Report a problem](https://github.com/visioncommerce/visioncommerce/issues)
- Documentation: `/docs`

---

## 🎉 Benefits of Full Automation

✅ **Zero manual deployment** - Push and forget  
✅ **Automatic testing** - Catch bugs early  
✅ **Preview deployments** - Test before merging  
✅ **Security scanning** - Stay safe  
✅ **Performance monitoring** - Track bundle size  
✅ **Easy releases** - One command to publish  

**Your entire workflow is now automated!** 🚀

---

**Last Updated**: December 25, 2025  
**Version**: 1.0.0
