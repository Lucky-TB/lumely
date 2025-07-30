import { Link, router } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
const auth = getAuth();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/country-select');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 px-6 pt-20 pb-6">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl font-bold text-secondary-600 font-inter">L</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2 font-inter">Welcome Back</Text>
          <Text className="text-gray-600 text-center font-inter">
            Sign in to continue monitoring your health
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2 font-inter">Email</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 font-inter"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2 font-inter">Password</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 font-inter"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="w-full h-12 bg-secondary-600 rounded-lg items-center justify-center mt-6"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-lg font-inter">
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Links */}
        <View className="mt-8 space-y-4">
          <Link href="/forgot-password" asChild>
            <TouchableOpacity>
              <Text className="text-secondary-600 text-center font-medium font-inter">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Link>

          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 font-inter">Don't have an account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text className="text-secondary-600 font-medium font-inter">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Health-focused footer */}
        <View className="mt-auto items-center">
          <Text className="text-gray-500 text-sm text-center font-inter">
            Your health data is encrypted and secure
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
} 