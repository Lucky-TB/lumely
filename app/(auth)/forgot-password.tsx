import { Link, router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth } from '../../lib/firebase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Reset Email Sent',
        'Please check your email for password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
          <Text className="text-3xl font-bold text-gray-900 mb-2 font-inter">Reset Password</Text>
          <Text className="text-gray-600 text-center font-inter">
            Enter your email to receive reset instructions
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

          <TouchableOpacity
            className="w-full h-12 bg-secondary-600 rounded-lg items-center justify-center mt-6"
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-lg font-inter">
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Links */}
        <View className="mt-8">
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="text-secondary-600 text-center font-medium font-inter">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </Link>
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