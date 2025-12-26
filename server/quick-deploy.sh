#!/bin/bash

# Vision PaaS Platform - Quick Deployment Script
# This script helps deploy the platform quickly

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================"
echo "Vision PaaS Platform - Quick Deploy"
echo "======================================${NC}"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker is installed"

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker Compose is available"

echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ .env file not found. Copying from .env.example${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit .env file and set your API keys (especially STRIPE_API_KEY)${NC}"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to cancel..."
fi

# Build and start services
echo ""
echo "Building and starting services..."
echo "This may take several minutes on first run..."
echo ""

docker compose down 2>/dev/null || true
docker compose up -d --build

echo ""
echo -e "${GREEN}Services are starting!${NC}"
echo ""
echo "Waiting for services to be ready (this may take 1-2 minutes)..."
sleep 30

echo ""
echo "Running deployment verification..."
./verify-deployment.sh

echo ""
echo -e "${GREEN}======================================"
echo "Deployment complete!"
echo "======================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Check service logs: docker compose logs -f [service-name]"
echo "  2. Access API Gateway: http://localhost:8080"
echo "  3. View Nacos console: http://localhost:8848/nacos"
echo "  4. Test vision-deploy: http://localhost:8083"
echo ""
echo "To stop all services: docker compose down"
echo ""
