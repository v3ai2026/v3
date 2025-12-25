#!/bin/bash
# VisionCommerce - Quick Deploy Script
# Usage: ./scripts/deploy.sh [production|preview]

set -e

echo "🚀 VisionCommerce Deployment Script"
echo "======================================"

ENVIRONMENT=${1:-production}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install --legacy-peer-deps
fi

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed! dist/ directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Deploy
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}🚀 Deploying to production...${NC}"
    vercel --prod
else
    echo -e "${YELLOW}🚀 Deploying preview...${NC}"
    vercel
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
