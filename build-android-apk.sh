#!/bin/bash

# TrackOne - Automated Android APK Build Script

echo "🚀 TrackOne Android APK Build Script"
echo "====================================="
echo ""

# Navigate to frontend folder
cd /Users/mayankchand/Private/trackone/frontend

# Check if logged in
echo "📋 Checking Expo login status..."
eas whoami > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Not logged in to Expo"
    echo ""
    echo "📱 Login Steps:"
    echo "1. A browser window will open"
    echo "2. Create or login to your Expo account"
    echo "3. Authorize the login"
    echo ""
    echo "Press Enter to continue with login..."
    read -r
    
    echo ""
    echo "🔐 Logging in to Expo..."
    eas login
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Login failed!"
        exit 1
    fi
fi

echo ""
echo "✅ Logged in successfully!"
echo ""
echo "📦 Starting Android APK Build..."
echo "This will take 15-20 minutes. Please don't close this window."
echo ""

# Start build
eas build --platform android --profile preview

echo ""
echo "✅ Build submitted!"
echo ""
echo "📥 Your APK will be available at: https://expo.dev"
echo ""
echo "Next steps:"
echo "1. Go to https://expo.dev in your browser"
echo "2. Login with your Expo account"
echo "3. Find your project 'trackone'"
echo "4. Wait for the build to complete (status: FINISHED)"
echo "5. Download the .apk file"
echo "6. Transfer to Android phone"
echo "7. Tap to install (allow unknown sources if prompted)"
echo ""
echo "Your app is ready! 🎉"
