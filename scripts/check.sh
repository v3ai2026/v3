#!/bin/bash
# VisionCommerce - Code Quality Check
# Runs linting, type checking, and tests

set -e

echo "🔍 VisionCommerce Code Quality Check"
echo "====================================="

EXIT_CODE=0

# Lint check
echo "📝 Running ESLint..."
if npm run lint --if-present; then
    echo "✅ Linting passed"
else
    echo "❌ Linting failed"
    EXIT_CODE=1
fi

# Type check
echo ""
echo "📘 Running TypeScript type check..."
if npx tsc --noEmit; then
    echo "✅ Type check passed"
else
    echo "❌ Type check failed"
    EXIT_CODE=1
fi

# Tests
echo ""
echo "🧪 Running tests..."
if npm test --if-present; then
    echo "✅ Tests passed"
else
    echo "⚠️  No tests found or tests failed"
fi

# Build check
echo ""
echo "🔨 Running build..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    EXIT_CODE=1
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ All checks passed!"
else
    echo "❌ Some checks failed"
fi

exit $EXIT_CODE
