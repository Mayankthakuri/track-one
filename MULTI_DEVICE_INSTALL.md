# 📱 TrackOne - Multi-Device Installation Guide

## 🚀 Quick Start (Automated Script)

### Run This Command:
```bash
chmod +x /Users/mayankchand/Private/trackone/build-and-install.sh
/Users/mayankchand/Private/trackone/build-and-install.sh
```

This script will:
1. ✅ Login to Expo
2. ✅ Build APK
3. ✅ Show installation options
4. ✅ Auto-install on connected devices

---

## 📱 Installation Methods for Multiple Devices

### **Method 1: USB Cable Installation (Fastest)**

**Requirements:**
- Android SDK installed
- USB cables for each phone
- USB Debugging enabled on each phone

**Steps:**

1. **Install ADB (Android Debug Bridge):**
```bash
# On Mac with Homebrew
brew install android-platform-tools

# Verify installation
adb version
```

2. **Connect first device via USB**
```bash
# Check connected devices
adb devices
```

3. **Enable USB Debugging on Android:**
   - Settings → Developer Options → USB Debugging ON
   - Authorize computer if prompted

4. **Install APK:**
```bash
cd ~/Downloads
adb install -r trackone.apk
```

5. **Repeat for each device:**
   - Disconnect current device
   - Connect next device
   - Run: `adb install -r trackone.apk`

**Advantages:**
- ✅ Fastest method
- ✅ No internet needed
- ✅ Direct from computer

---

### **Method 2: Simultaneous Multi-Device Installation**

**For when you have multiple devices connected:**

```bash
# Connect all devices via USB
# Enable USB Debugging on each

# Install on ALL connected devices at once:
adb devices | grep 'device$' | awk '{print $1}' | while read device; do
  echo "Installing on $device..."
  adb -s "$device" install -r ~/Downloads/trackone.apk
done
```

**Result:** APK installs on all connected devices simultaneously!

---

### **Method 3: Email/Cloud Sharing**

**Perfect for friends & family:**

1. **Upload APK to cloud:**
   - Google Drive
   - OneDrive
   - Dropbox
   - iCloud

2. **Share download link with others**

3. **They download on their phone:**
   - Tap download link
   - Save to Downloads
   - Open file manager
   - Tap APK
   - Accept installation

**Advantages:**
- ✅ Works anywhere
- ✅ No USB needed
- ✅ Easy to share with family

---

### **Method 4: GitHub Release (Code Sharing)**

**Best for developers:**

1. **Create GitHub Release:**
```bash
cd /Users/mayankchand/Private/trackone

# Tag the build
git tag v1.0.0-android
git push origin v1.0.0-android

# Create release on GitHub and upload APK
```

2. **Share release link:**
   - https://github.com/Mayankthakuri/track-one/releases

3. **Anyone can download:**
   - Click Assets
   - Download trackone.apk
   - Install on phone

**Advantages:**
- ✅ Public sharing
- ✅ Version control
- ✅ Community access

---

### **Method 5: Firebase App Distribution (Team Testing)**

**For internal team testing:**

1. **Setup Firebase:**
   - Create Firebase project
   - Connect to Expo
   - Configure app signing

2. **Build & distribute:**
```bash
eas build --platform android
# Upload to Firebase App Distribution
```

3. **Team members get email invite:**
   - Click link
   - Download app
   - Install directly

---

## 🎯 Recommended Flow

### **For Your Personal Use:**
```
1. Build: eas build --platform android --profile preview
2. Download from Expo
3. Connect phone via USB
4. Run: adb install -r ~/Downloads/trackone.apk
5. Open app → Test features
```

### **For Friends/Family:**
```
1. Build APK
2. Download from Expo
3. Email APK or upload to Google Drive
4. Share link with friends
5. They download and install themselves
```

### **For GitHub Community:**
```
1. Build APK
2. Create GitHub Release
3. Upload APK to release
4. Share release link on social media
5. Others download and use
```

---

## 🔧 Complete Automated Setup

### **Run Everything at Once:**

```bash
#!/bin/bash

# Step 1: Navigate to frontend
cd /Users/mayankchand/Private/trackone/frontend

# Step 2: Login to Expo
echo "🔐 Logging in to Expo..."
eas login

# Step 3: Build APK
echo "📦 Building APK (this takes 15-20 minutes)..."
eas build --platform android --profile preview

# Step 4: Wait for completion and download
echo "✅ Build complete!"
echo "Go to https://expo.dev to download"

# Step 5: Install on all connected devices
echo "📱 Installing on connected devices..."
adb devices | grep 'device$' | awk '{print $1}' | while read device; do
  echo "Installing on: $device"
  adb -s "$device" install -r ~/Downloads/trackone.apk
  echo "✅ Installed on $device"
done

echo "🎉 Done! Check your devices for TrackOne app"
```

---

## 📋 Device Setup Checklist

**Before Installation:**

- [ ] Android 8.0 or higher
- [ ] Google Play Services installed
- [ ] Internet connection enabled
- [ ] Location services enabled
- [ ] Storage space available (50MB+)
- [ ] USB Debugging enabled (if using USB)

**After Installation:**

- [ ] Open TrackOne app
- [ ] Allow location permission
- [ ] Sign up with email/phone
- [ ] Enable location tracking
- [ ] Test location sharing
- [ ] Add contacts

---

## ✅ Multi-Device Installation Checklist

### **Setup (One Time):**
- [ ] Install ADB: `brew install android-platform-tools`
- [ ] Build APK: `eas build --platform android --profile preview`
- [ ] Download from Expo

### **Installation (Per Device):**
- [ ] Connect device via USB
- [ ] Enable USB Debugging: Settings → Developer Options
- [ ] Run: `adb install -r ~/Downloads/trackone.apk`
- [ ] Open app and test
- [ ] Disconnect device

### **For Multiple Devices:**
- [ ] Connect all devices
- [ ] Enable USB Debugging on each
- [ ] Run multi-device installation script
- [ ] Wait for all to complete
- [ ] Test on each device

---

## 🐛 Troubleshooting

### "adb: command not found"
```bash
brew install android-platform-tools
```

### "device not found"
- Enable USB Debugging on phone
- Authorize computer connection
- Try different USB port
- Restart phone

### "Install failed"
1. Uninstall previous version: `adb uninstall com.trackone`
2. Try again: `adb install -r ~/Downloads/trackone.apk`

### "Permission denied on device"
- Enable "Allow installation from unknown sources" in Settings
- Or use: `adb install -r --grant-all-permissions ~/Downloads/trackone.apk`

### Multiple Devices - One Fails
- Continue with successful devices
- Fix failed device (enable USB Debugging)
- Try again with single device

---

## 🚀 Quick Commands

```bash
# Check connected devices
adb devices

# Install on specific device
adb -s DEVICE_ID install -r ~/Downloads/trackone.apk

# Install on all devices
adb devices | grep 'device$' | awk '{print $1}' | xargs -I {} adb -s {} install -r ~/Downloads/trackone.apk

# Uninstall from all devices
adb devices | grep 'device$' | awk '{print $1}' | xargs -I {} adb -s {} uninstall com.trackone

# Check installed apps
adb shell pm list packages | grep trackone

# Start TrackOne on device
adb shell am start -n com.trackone/.MainActivity

# View device logs
adb logcat
```

---

## 📱 Works On

✅ Android 8.0+  
✅ Android 9, 10, 11, 12, 13, 14, 15  
✅ Google Devices  
✅ Samsung  
✅ Xiaomi  
✅ OnePlus  
✅ Any Android device

---

## 🎉 Ready?

**Run the automated script:**
```bash
chmod +x /Users/mayankchand/Private/trackone/build-and-install.sh
/Users/mayankchand/Private/trackone/build-and-install.sh
```

**Or build manually:**
```bash
cd /Users/mayankchand/Private/trackone/frontend
eas login
eas build --platform android --profile preview
# Download from https://expo.dev
adb install -r ~/Downloads/trackone.apk
```

That's it! 🚀
