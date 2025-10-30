declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_FIREBASE_API_KEY: string;
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      EXPO_PUBLIC_FIREBASE_APP_ID: string;
      EXPO_PUBLIC_GEMINI_API_KEY: string;
      EXPO_PUBLIC_APP_NAME: string;
      EXPO_PUBLIC_APP_VERSION: string;
      EXPO_PUBLIC_GOOGLE_CLIENT_ID: string;
      EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: string;
      EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: string;
      EXPO_PUBLIC_TEACHABLE_MACHINE_URL: string;
      NODE_ENV: string;
    }
  }
}

export { };
