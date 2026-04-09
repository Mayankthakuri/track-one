# TrackOne - Location Tracker with Supabase

A modern location tracking application built with **Supabase** (PostgreSQL + Auth), **React Native**, and **Expo**.

## 📱 Features

- ✅ **Secure Authentication**: Email/password with Supabase Auth
- ✅ **Real-Time Location Tracking**: GPS tracking with periodic updates
- ✅ **Contact Management**: Add contacts and share locations
- ✅ **Interactive Map**: Real-time map with contact locations and location trails
- ✅ **Location History**: View historical location data
- ✅ **Beautiful UI**: Modern iOS-inspired design
- ✅ **Privacy Protected**: Only contacts can see your location

## 🏗️ Technical Stack

### Backend
- **Supabase** (PostgreSQL Database)
- **Supabase Auth** (Email/Password authentication)
- Row-Level Security (RLS) for privacy
- Real-time subscriptions

### Frontend
- **React Native** with Supabase JS client
- **Expo** for iOS/Android deployment
- **React Navigation** with tab-based UI
- **Expo Location** for GPS tracking
- **React Native Maps** for map visualization

## 📋 Prerequisites

1. Node.js 16+ and npm/yarn
2. Expo CLI: `npm install -g expo-cli`
3. Supabase account (free tier available at supabase.com)

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** from Settings → API

### 2. Set Up Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query and run the contents of `supabase/schema.sql`
3. (Optional) Run seed data from `supabase/seed.sql`

### 3. Configure Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Create a `.env.local` file:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### 4. Run the App

**Option A: iOS Simulator**
```bash
npm run ios
```

**Option B: Android Emulator**
```bash
npm run android
```

**Option C: Web**
```bash
npm run web
```

**Option D: Expo Go (Physical Device)**
```bash
npm start
# Scan QR code with Expo Go app
```

## 📚 Project Structure

```
trackone/
├── frontend/                    # React Native Expo app
│   ├── src/
│   │   ├── screens/            # UI Screens
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── MapScreen.tsx
│   │   │   ├── ContactsScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── services/           # Supabase services
│   │       ├── supabase.ts     # Supabase client
│   │       ├── auth.ts         # Authentication
│   │       ├── location.ts     # Location management
│   │       └── contact.ts      # Contact management
│   ├── App.tsx                 # Main app with navigation
│   ├── app.json                # Expo configuration
│   └── package.json            # Dependencies
├── supabase/
│   ├── schema.sql              # Database schema
│   └── seed.sql                # Test data
└── README.md
```

## 🔒 Security & Privacy

### Row-Level Security (RLS)
- Users can only see their own profile and locations
- Contacts can see locations of users who have added them
- All database queries respect user permissions

### Authentication
- Supabase Auth with JWT tokens
- Secure session management with AsyncStorage
- Auto token refresh

### Location Privacy
- Location is only visible to accepted contacts
- Location history persists but is private
- Users can delete contacts anytime

## 📱 Screens

### Login/Register
- Email and password authentication
- Phone number for contact identification
- Form validation

### Map
- Interactive OpenStreetMap view
- Your current location (blue marker)
- Contacts' locations (green markers)
- Location history trail (red polyline)
- Start/Stop location tracking button

### Contacts
- View all accepted contacts
- Add new contacts by phone number
- Remove contacts
- See contact's latest location

### Profile
- View current user info
- See latest location coordinates
- Account creation date
- Privacy & security info
- Logout button

## 🧪 Test Accounts

Create your own test accounts in Supabase Auth:

1. User 1: test1@example.com / password123 / +1234567890
2. User 2: test2@example.com / password123 / +0987654321

## 🔄 Real-Time Features

### Location Updates
- Periodic updates every 2 minutes
- Triggered by manual button or auto-tracking
- Stored in both `locations` and `location_history` tables

### Real-Time Subscriptions
- Live contact list updates
- Location changes broadcast to viewers
- Implemented using Supabase's `on()` method

## 📖 API Reference

### Auth Service
```typescript
authService.signUp({ email, password, fullName, phone })
authService.signIn({ email, password })
authService.signOut()
authService.getCurrentUser()
authService.resetPassword(email)
authService.updatePassword(newPassword)
```

### Location Service
```typescript
locationService.updateUserLocation(latitude, longitude, accuracy)
locationService.getLatestLocation(userId)
locationService.getLocationHistory(userId, limit)
locationService.subscribeToLocationUpdates(userId, callback)
```

### Contact Service
```typescript
contactService.getContacts()
contactService.addContact(phone, name)
contactService.removeContact(contactId)
contactService.getContactRequests()
contactService.acceptContactRequest(requestId, fromUserId)
contactService.rejectContactRequest(requestId)
```

## 🐛 Troubleshooting

### Location Permission Issues
- **iOS**: Check `NSLocationWhenInUseUsageDescription` in `app.json`
- **Android**: Permissions are auto-requested, ensure app has location permission

### Map Not Loading
- Ensure Google Maps or OpenStreetMap is available in your region
- Check internet connectivity
- Try clearing Expo cache: `expo cache clean`

### Supabase Connection Issues
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check Supabase project is active (not paused)
- Ensure RLS policies allow the operation

### Login Fails
- Verify email exists in Supabase Auth
- Check Supabase Auth is enabled in Settings
- Look at Supabase logs for detailed error

## 🚀 Next Steps

1. **Push Notifications**: Add `expo-notifications` for location update alerts
2. **Geofencing**: Implement location-based triggers
3. **Share Links**: Generate shareable location links
4. **Dark Mode**: Add theme support
5. **Offline Support**: Add local caching with SQLite
6. **Analytics**: Track user sessions and app usage
7. **Publish**: Submit to App Store and Google Play

## 📄 License

MIT License - feel free to use this for your projects!

## 💬 Support

For issues or questions:
1. Check Supabase docs: https://supabase.com/docs
2. Check Expo docs: https://docs.expo.dev
3. Review error logs in Supabase dashboard
