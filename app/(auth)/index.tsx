import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithCredential } from 'firebase/auth';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Firebase config from .env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase if not already
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // already initialized
}
const auth = getAuth();

WebBrowser.maybeCompleteAuthSession();

export default function AuthEntryScreen() {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(() => {
        router.replace('/country-select');
      });
    }
  }, [response]);

  const handleAppleSignIn = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
      });
      await signInWithCredential(auth, credential);
      router.replace('/country-select');
    } catch (e) {
      // handle error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Lumely</Text>
      <View style={{ height: 60 }} />
      <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={() => {}}>
        <Ionicons name="logo-facebook" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={[styles.socialText, { color: '#fff' }]}>Continue with facebook</Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={styles.appleButton}
          onPress={handleAppleSignIn}
        />
      )}
      <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
        <Image
          source={require('../../assets/images/Google__G__logo.svg.png')}
          style={{ width: 20, height: 20, marginRight: 8 }}
          resizeMode="contain"
        />
        <Text style={styles.socialText}>Continue with google</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}><Text style={styles.link}>Register</Text></TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}><Text style={styles.link}>Login with email</Text></TouchableOpacity>
      </View>
      {/* Dev/test bypass button */}
      <TouchableOpacity style={styles.bypassButton} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.bypassText}>Bypass Auth (dev only)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: '#222',
    marginBottom: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  facebookButton: {
    backgroundColor: '#1877F3',
    borderColor: '#1877F3',
  },
  socialText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  appleButton: {
    width: '100%',
    height: 48,
    marginBottom: 16,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    color: '#457B9D',
    fontWeight: '600',
    fontSize: 16,
    marginHorizontal: 8,
  },
  separator: {
    color: '#aaa',
    fontSize: 16,
  },
  bypassButton: {
    marginTop: 32,
    alignSelf: 'center',
    padding: 8,
    opacity: 0.6,
  },
  bypassText: {
    color: '#888',
    fontSize: 13,
    fontStyle: 'italic',
  },
}); 