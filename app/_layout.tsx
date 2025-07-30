import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import '../global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

interface SplashProps {
  onComplete: () => void;
}

function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>Lumely</Text>
    </View>
  );
}

function AppContent() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="camera" 
          options={{ 
            presentation: 'card',
            animation: 'slide_from_bottom',
            headerShown: false,
          }} 
        />
        <Stack.Screen name="scan-result" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

interface RootLayoutState {
  showSplash: boolean;
}

export default function RootLayout() {
  const [state, setState] = useState<RootLayoutState>({ showSplash: true });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const handleSplashComplete = () => {
    setState({ showSplash: false });
  };

  if (state.showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#457B9D', // Muted Indigo
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
});
