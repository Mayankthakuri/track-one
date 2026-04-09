#!/bin/bash

# TrackOne - Android Installation Script
# Automatically installs the APK on Android device/emulator

set -e

echo "🤖 TrackOne Android Installation Script"
echo "========================================"

# Check if in frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in frontend directory"
    echo "Run: cd /Users/mayankchand/Private/trackone/frontend"
    exit 1
fi

# Check for ADB
if ! command -v adb &> /dev/null; then
    echo "❌ Android SDK Platform Tools not found"
    echo "Install with: brew install android-platform-tools"
    exit 1
fi

# Check for connected devices
echo ""
echo "📱 Checking connected devices..."
DEVICE_COUNT=$(adb devices | grep -c "device$" || true)

if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo "⚠️  No Android devices/emulators found"
    echo "Please connect a device or start an emulator"
    exit 1
fi

echo "✓ Found $DEVICE_COUNT device(s)"

echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "🔨 Building APK (this may take 5-10 minutes)..."
npx expo run:android

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Wait for app to install on device"
echo "2. App will auto-launch"
echo "3. Sign up with email/password"
echo "4. Grant location permission"
echo "5. Start tracking!"
