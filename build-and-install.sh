#!/bin/bash

# TrackOne - Automated Build & Multi-Device Install Script

echo "🚀 TrackOne - Automated Build & Install"
echo "========================================"
echo ""

cd /Users/mayankchand/Private/trackone/frontend

# Step 1: Login
echo "📱 Step 1: Login to Expo"
echo "A browser window will open. Follow these steps:"
echo "1. Login/Create Expo account"
echo "2. Authorize the connection"
echo "3. Return to this terminal"
echo ""
read -p "Press Enter to continue..." 

echo "🔐 Logging in..."
eas login

if [ $? -ne 0 ]; then
    echo "❌ Login failed!"
    exit 1
fi

echo "✅ Login successful!"
echo ""

# Step 2: Build APK
echo "📦 Step 2: Building Android APK"
echo "This will take 15-20 minutes..."
echo ""

eas build --platform android --profile preview

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build completed!"
echo ""

# Step 3: Download Instructions
echo "📥 Step 3: Downloading APK"
echo ""
echo "Your APK is ready at: https://expo.dev"
echo ""
echo "To download:"
echo "1. Go to https://expo.dev"
echo "2. Login with your Expo account"
echo "3. Find 'trackone' project"
echo "4. Click the latest build with status FINISHED"
echo "5. Click Download button"
echo "6. APK saves to ~/Downloads/trackone.apk"
echo ""

read -p "After downloading, press Enter to continue with installation..." 

# Step 4: Multi-Device Installation
echo ""
echo "📱 Step 4: Installing on Multiple Android Devices"
echo ""

# Check if APK exists
if [ ! -f ~/Downloads/trackone.apk ]; then
    echo "⚠️  APK not found at ~/Downloads/trackone.apk"
    echo "Please download from https://expo.dev first"
    exit 1
fi

echo "✅ APK found!"
echo ""
echo "Available installation methods:"
echo ""
echo "Option 1: List connected devices and install"
adb devices

echo ""
echo "📋 Connected devices found above"
echo ""
echo "Installation methods:"
echo ""
echo "🔧 METHOD 1: USB Cable (Fast)"
echo "Connect Android phones via USB and run:"
echo "  adb install -r ~/Downloads/trackone.apk"
echo ""
echo "Repeat for each device connected via USB"
echo ""

echo "📧 METHOD 2: Email/Cloud (Multiple Devices)"
echo "1. Forward APK to contacts:"
echo "   - Email it to friends"
echo "   - Upload to Google Drive"
echo "   - Upload to OneDrive"
echo ""
echo "2. They download on their Android phones"
echo ""
echo "3. Tap APK file → Install"
echo ""

echo "🔗 METHOD 3: GitHub Release (Community Share)"
echo "1. Go to: https://github.com/Mayankthakuri/track-one"
echo "2. Click Releases"
echo "3. Create new release"
echo "4. Upload trackone.apk"
echo "5. Share release link"
echo "6. Others can download and install"
echo ""

echo "🤖 METHOD 4: Automated USB Install (Multiple Devices)"
echo ""

# Find number of devices
DEVICE_COUNT=$(adb devices | grep -c 'device$')

if [ $DEVICE_COUNT -gt 0 ]; then
    echo "Found $DEVICE_COUNT connected device(s)"
    echo ""
    
    read -p "Install on all connected devices? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Installing on all connected devices..."
        echo ""
        
        adb devices | grep 'device$' | awk '{print $1}' | while read device; do
            echo "📱 Installing on: $device"
            adb -s "$device" install -r ~/Downloads/trackone.apk
            
            if [ $? -eq 0 ]; then
                echo "✅ Successfully installed on $device"
            else
                echo "❌ Failed to install on $device"
            fi
            echo ""
        done
        
        echo "🎉 Installation complete on all devices!"
        echo ""
    fi
else
    echo "⚠️  No devices connected via USB"
    echo "Connect devices via USB cable and enable USB Debugging"
    echo ""
fi

echo ""
echo "✅ TrackOne Setup Complete!"
echo ""
echo "Next steps on each device:"
echo "1. Open TrackOne app"
echo "2. Allow location permission"
echo "3. Sign up with email/password"
echo "4. Enable location tracking"
echo "5. Add friends as contacts"
echo "6. Start sharing locations!"
echo ""
echo "Good luck! 🚀"
