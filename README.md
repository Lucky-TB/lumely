# Lumely - AI-Powered Health Scanning App

A modern mobile app that uses AI to analyze photos of different body parts (skin, eyes, teeth, face, ears) for potential health issues. Built with React Native, Expo, NativeWind, Firebase, and Gemini AI.

## Features

- **AI-Powered Body Scanning**: Use your phone camera to scan skin, eyes, teeth, face, and ears
- **Health Analysis**: Get AI-powered health predictions and recommendations
- **Health Log**: View past scans with image previews and results
- **Wellness Recommendations**: Personalized health advice based on scan history
- **AI Chat Assistant**: Ask health-related questions powered by Gemini AI
- **User Authentication**: Secure login and profile management
- **Modern UI**: Clean, health-focused design with NativeWind styling

## Tech Stack

- **Frontend**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Firebase (Authentication, Firestore, Storage, Cloud Functions)
- **AI**: Google Gemini API for image analysis and chat
- **Navigation**: Expo Router
- **Camera**: Expo Camera and Image Picker
- **Deployment**: Expo + EAS for app store deployment

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- Firebase project
- Google Gemini API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd lumely
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Firebase Storage
5. Get your Firebase config from Project Settings > General > Your apps
6. Add the config values to your `.env` file (see Environment Variables section below)

### 3. Gemini AI Setup

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to your `.env` file (see Environment Variables section below)

### 4. Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your actual API keys:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
EXPO_PUBLIC_APP_NAME=Lumely
EXPO_PUBLIC_APP_VERSION=1.0.0

# Development Configuration
NODE_ENV=development
```

**Important**: Never commit your `.env` file to version control. It's already added to `.gitignore`.

### 5. Run the App

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
lumely/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab screens
│   ├── camera.tsx         # Camera screen
│   ├── scan-result.tsx    # Scan results screen
│   └── _layout.tsx        # Root layout
├── lib/                   # Configuration files
│   ├── firebase.ts        # Firebase configuration
│   └── gemini.ts          # Gemini AI configuration
├── types/                 # TypeScript type definitions
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── assets/                # Images, fonts, etc.
└── global.css             # Global styles
```

## Key Features Implementation

### Camera Integration
- Uses Expo Camera for photo capture
- Image picker for selecting from gallery
- Real-time camera preview with tips

### AI Analysis
- Gemini Vision API for image analysis
- Structured health prompts for different body parts
- Confidence scoring and urgency levels

### Health Log
- Firebase Firestore for data storage
- Image storage in Firebase Storage
- Time-based scan history

### Authentication
- Firebase Authentication
- Email/password login
- User profile management

## Development Notes

### Mock Data
During development, the app uses mock data for:
- AI analysis responses
- User health statistics
- Chat responses

Replace mock implementations with real API calls for production.

### Image Processing
The current implementation uses placeholder base64 data. In production:
- Implement proper image compression
- Handle large image uploads
- Add image validation

### Security
- Implement proper API key management
- Add input validation
- Set up Firebase security rules
- Add data encryption for sensitive health data

## Deployment

### Expo EAS Build

1. Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for production:
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### App Store Deployment

1. Submit to App Store Connect:
```bash
eas submit --platform ios
```

2. Submit to Google Play Console:
```bash
eas submit --platform android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This app is for informational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for medical concerns.

## Support

For support, email support@lumely.com or create an issue in the repository.
