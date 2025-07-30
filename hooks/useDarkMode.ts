import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

interface DarkModeState {
  isDarkMode: boolean;
  isLoading: boolean;
}

interface DarkModeActions {
  toggleDarkMode: () => Promise<void>;
  setDarkMode: (value: boolean) => Promise<void>;
}

type UseDarkModeReturn = DarkModeState & DarkModeActions;

const DARK_MODE_KEY = '@lumely_dark_mode';

function loadDarkModePreference(): Promise<boolean> {
  return AsyncStorage.getItem(DARK_MODE_KEY)
    .then((savedPreference) => {
      if (savedPreference !== null) {
        return JSON.parse(savedPreference);
      }
      return false;
    })
    .catch((error) => {
      console.error('Error loading dark mode preference:', error);
      return false;
    });
}

function saveDarkModePreference(value: boolean): Promise<void> {
  return AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(value))
    .catch((error) => {
      console.error('Error saving dark mode preference:', error);
    });
}

export function useDarkMode(): UseDarkModeReturn {
  const [state, setState] = useState<DarkModeState>({
    isDarkMode: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeDarkMode = async () => {
      try {
        const isDarkMode = await loadDarkModePreference();
        setState({ isDarkMode, isLoading: false });
      } catch (error) {
        console.error('Failed to initialize dark mode:', error);
        setState({ isDarkMode: false, isLoading: false });
      }
    };

    initializeDarkMode();
  }, []);

  const toggleDarkMode = useCallback(async () => {
    try {
      const newValue = !state.isDarkMode;
      setState(prev => ({ ...prev, isDarkMode: newValue }));
      await saveDarkModePreference(newValue);
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
    }
  }, [state.isDarkMode]);

  const setDarkMode = useCallback(async (value: boolean) => {
    try {
      setState(prev => ({ ...prev, isDarkMode: value }));
      await saveDarkModePreference(value);
    } catch (error) {
      console.error('Failed to set dark mode:', error);
    }
  }, []);

  return {
    ...state,
    toggleDarkMode,
    setDarkMode,
  };
} 