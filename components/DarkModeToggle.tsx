import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDarkModeContext } from '../contexts/DarkModeContext';

interface DarkModeToggleProps {
  showLabel?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ showLabel = true }) => {
  const { isDarkMode, toggleDarkMode } = useDarkModeContext();

  return (
    <View className="flex-row items-center space-x-3">
      {showLabel && (
        <View className="flex-1">
          <Text className="text-body font-semibold text-lg">
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Text className="text-body-secondary text-sm">
            {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          </Text>
        </View>
      )}
      
      <TouchableOpacity
        onPress={toggleDarkMode}
        className={`w-14 h-8 rounded-full p-1 flex-row items-center ${
          isDarkMode 
            ? 'bg-dark-primary' 
            : 'bg-gray-300'
        }`}
        activeOpacity={0.8}
      >
        <View
          className={`w-6 h-6 rounded-full bg-white shadow-md flex-row items-center justify-center ${
            isDarkMode ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          <Ionicons
            name={isDarkMode ? 'moon' : 'sunny'}
            size={16}
            color={isDarkMode ? '#4ECDC4' : '#F4A261'}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}; 