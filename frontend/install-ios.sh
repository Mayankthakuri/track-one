#!/bin/bash

# TrackOne - iOS Installation Script
# Automatically installs the app on iOS Simulator or connected device

set -e

echo "🍎 TrackOne iOS Installation Script"
echo "===================================="

# Check if in frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in frontend directory"
    echo "Run: cd /Users/mayankchand/Private/trackone/frontend"
    exit 1
fi

# Check for required tools
if ! command -v xcode-select &> /dev/null; then
    echo "⚠️  Xcode not found. Installing command line tools..."
    xcode-select --install
fi

echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "🔨 Building iOS app (this may take 2-5 minutes)..."
npx expo run:ios

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Wait for iOS Simulator to launch"
echo "2. App will auto-install and run"
echo "3. Sign up with email/password"
echo "4. Grant location permission"
echo "5. Start tracking!"
