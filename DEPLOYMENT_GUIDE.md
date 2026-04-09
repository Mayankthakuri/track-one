# 🚀 TrackOne - Complete Deployment Guide

## Step 1: Login to Expo ✅

### Option A: Create Free Expo Account (if you don't have one)
1. Go to **https://expo.dev**
2. Click **Sign Up**
3. Use GitHub or Email to create account
4. Verify your email

### Option B: Login via Terminal
```bash
cd /Users/mayankchand/Private/trackone/frontend
eas login
```
- Browser will open
- Login with your Expo account
- Authorize the connection
- Return to terminal (it will confirm login)

---

## Step 2: Build Android APK 📦

Once logged in, run:

```bash
cd /Users/mayankchand/Private/trackone/frontend
eas build --platform android --profile preview
```

### What Happens:
✅ Uploads your code to Expo's build servers  
✅ Compiles for Android  
✅ Creates `.apk` file  
⏳ Takes **15-20 minutes**

### During Build:
- Don't close the terminal
- You'll see progress updates
- Final message: **"Build finished successfully!"**

---

## Step 3: Download APK 📥

After build completes, you'll see a link or do this:

1. Go to **https://expo.dev**
2. Click your account (top right)
3. Go to **Projects** → **trackone**
4. Find the latest build with status **FINISHED** (green checkmark)
5. Click **Download**
6. APK saves to `~/Downloads/trackone.apk`

---

## Step 4: Deploy on Android Device 📱

### Option A: Direct Install (Easiest)

1. **Transfer APK to phone via:**
   - Email to yourself
   - USB cable
   - Bluetooth
   - Cloud storage (Google Drive, OneDrive)

2. **On Android phone:**
   - Open **Files** app or **Downloads**
   - Find **trackone.apk**
   - Tap it
   - If prompted: Settings → Allow "Unknown sources"
   - Tap **Install**
   - Wait for installation (30 seconds)
   - Tap **Open** or find **TrackOne** in apps

### Option B: Using ADB (Android SDK)

If you have Android SDK installed:

```bash
# List connected devices
adb devices

# Install APK
adb install -r ~/Downloads/trackone.apk

# Check installation
adb shell pm list packages | grep trackone
```

### Option C: USB Debugging (Android Phone to Mac)

1. On phone: Settings → Developer Options → USB Debugging (ON)
2. Connect phone via USB to Mac
3. Run: `adb install -r ~/Downloads/trackone.apk`

---

## Step 5: First Launch 🎉

When you open TrackOne:

1. **Allow Permissions:**
   - ✅ Location Access (required)
   - ✅ Camera (if needed)
   - ✅ Contacts (optional)

2. **Sign Up/Login:**
   - Email: Your email address
   - Password: Create strong password
   - Full Name: Your name
   - Phone: Your phone number (for contacts)

3. **Features Ready:**
   - 📍 Real-time location tracking
   - 👥 Add contacts by phone number
   - 🗺️ Interactive map with markers
   - 📊 Location history trails

---

## Step 6: Share with Others via GitHub ✅

### Already Done! 
Your project is at: **https://github.com/Mayankthakuri/track-one**

### To Share:

**Share the link:**
```
https://github.com/Mayankthakuri/track-one
```

**What others can do:**
- ✅ View your code
- ✅ Fork the repository
- ✅ Clone and modify
- ✅ Build their own APK
- ✅ Read documentation

**To also share the APK:**

1. Go to GitHub → **Releases** (right side)
2. Click **Create a new release**
3. Tag: `v1.0.0`
4. Title: `TrackOne v1.0.0 - Android APK`
5. Description: Copy from README
6. Upload: Drag & drop `trackone.apk`
7. Publish

Now anyone can:
- Download APK directly from GitHub
- Or clone & build themselves

---

## Quick Command Summary

```bash
# 1. Login to Expo
eas login

# 2. Build APK
cd /Users/mayankchand/Private/trackone/frontend
eas build --platform android --profile preview

# 3. Wait 15-20 minutes for build...

# 4. Download from https://expo.dev

# 5. Transfer to phone and install
adb install -r ~/Downloads/trackone.apk

# 6. Open app on phone and enjoy!
```

---

## ✅ Deployment Checklist

- [ ] Create Expo account (https://expo.dev)
- [ ] Login: `eas login`
- [ ] Start build: `eas build --platform android --profile preview`
- [ ] Wait for build to finish (~20 min)
- [ ] Download APK from Expo dashboard
- [ ] Install on Android phone
- [ ] Test app (signup, login, location tracking)
- [ ] Share GitHub link: https://github.com/Mayankthakuri/track-one
- [ ] (Optional) Upload APK to GitHub Releases

---

## 🔧 Troubleshooting

### Build Fails with "Not logged in"
```bash
eas login
# Browser opens → Login → Return to terminal
```

### Build Times Out
- Check internet connection
- Wait up to 30 minutes
- Try again: `eas build --platform android --profile preview --clear-cache`

### APK Won't Install
- Uninstall previous version: `adb uninstall com.trackone`
- Try again: `adb install -r ~/Downloads/trackone.apk`
- Or sideload via USB: Enable Developer Mode on phone

### App Crashes on Startup
- Check `.env.local` has correct Supabase credentials
- Verify Supabase database tables exist
- Check phone has internet connection

### Location Not Working
- On phone: Settings → Apps → TrackOne → Permissions → Turn ON Location
- Restart app
- Grant permission when prompted

### Can't Add Contacts
- Contacts must have email in Supabase (signup first)
- Add by their phone number from signup
- They must accept contact request

---

## 🎯 What's Next

After deployment:

1. **Test Features:**
   - ✅ Sign up new account
   - ✅ Enable location tracking
   - ✅ Add contacts
   - ✅ View map

2. **Invite Others:**
   - Share GitHub link
   - They can build their own APK
   - Add each other as contacts
   - Start tracking together!

3. **Enhancements (Future):**
   - Push notifications
   - Geofencing alerts
   - Offline mode
   - Dark mode
   - Export location data

---

## 📞 Support Resources

- **Expo Docs:** https://docs.expo.dev
- **Supabase Docs:** https://supabase.com/docs
- **GitHub Issues:** https://github.com/Mayankthakuri/track-one/issues
- **React Native Docs:** https://reactnative.dev

---

## 🚀 Ready?

**Next step:** Run this in your terminal:

```bash
eas login
```

Then sit back and let the APK build! ☕

**Questions?** Check the [GitHub repository](https://github.com/Mayankthakuri/track-one) documentation!
