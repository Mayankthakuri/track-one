#!/bin/bash

# TrackOne Android APK Build Script

echo "🚀 TrackOne - Android APK Build Setup"
echo "======================================"
echo ""

# Check if Node modules are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check .env.local configuration
if [ ! -f ".env.local" ]; then
    echo "⚠️  Missing .env.local file"
    echo "Please create frontend/.env.local with:"
    echo ""
    echo "EXPO_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo ""
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📱 Building Android APK..."
echo "This may take 10-15 minutes..."
echo ""

# Build for preview (faster, good for testing)
eas build --platform android --profile preview

echo ""
echo "✅ Build complete!"
echo "Your APK will be available at:"
echo "https://expo.dev/accounts/[your-account]/projects/trackone/builds"
echo ""
echo "You can download and install it on your Android device:"
echo "adb install -r path/to/trackone.apk"
