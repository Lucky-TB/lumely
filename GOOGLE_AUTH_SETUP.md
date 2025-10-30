# Google Authentication Setup

## Issue Fixed
The error "Client Id property `iosClientId` must be defined to use Google auth on this platform" has been resolved by updating the Google authentication configuration to include platform-specific client IDs.

## Changes Made

1. **Updated `types/env.d.ts`**: Added Google OAuth environment variables:
   - `EXPO_PUBLIC_GOOGLE_CLIENT_ID` (web client ID)
   - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` (iOS client ID)
   - `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` (Android client ID)

2. **Updated `app/(auth)/index.tsx`**: Modified the Google authentication configuration to include platform-specific client IDs.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google OAuth Configuration
# Web client ID (for general use)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
# iOS client ID (required for iOS)
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
# Android client ID (required for Android)
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com

# Gemini AI Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
EXPO_PUBLIC_APP_NAME=Lumely
EXPO_PUBLIC_APP_VERSION=1.0.0

# Environment
NODE_ENV=development
```

## How to Get Google OAuth Client IDs

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" > "OAuth 2.0 Client IDs"
6. Create separate client IDs for:
   - **Web application** (for `EXPO_PUBLIC_GOOGLE_CLIENT_ID`)
   - **iOS** (for `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`)
   - **Android** (for `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`)

### iOS Client ID Setup
- Application type: iOS
- Bundle ID: `com.lumely.health` (from your app.json)

### Android Client ID Setup
- Application type: Android
- Package name: `com.lumely.health` (from your app.json)
- SHA-1 certificate fingerprint: Get this from your keystore

## Testing
After setting up the environment variables, restart your development server and test the Google authentication flow on both iOS and Android platforms.
