#!/bin/bash
# VisionCommerce - Setup Script
# Automates initial project setup

set -e

echo "🛠️  VisionCommerce Setup"
echo "======================="

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version OK: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# VisionCommerce Environment Variables
VITE_GEMINI_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:5173
EOF
    echo "✅ .env.local created. Please update with your API keys."
fi

# Build the project
echo "🔨 Building project..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Update .env.local with your API keys"
echo "  2. Run 'npm run dev' to start development server"
echo "  3. Run 'npm run preview' to preview production build"
echo "  4. Run './scripts/deploy.sh' to deploy to Vercel"
echo ""
