import { createContext, ReactNode, useContext, useReducer, useEffect } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

interface DarkModeState {
  isDarkMode: boolean;
  isLoading: boolean;
}

interface DarkModeContextType extends DarkModeState {
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

type DarkModeAction = 
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_DARK_MODE' };

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

function darkModeReducer(state: DarkModeState, action: DarkModeAction): DarkModeState {
  switch (action.type) {
    case 'SET_DARK_MODE':
      return { ...state, isDarkMode: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
}

export function useDarkModeContext(): DarkModeContextType {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkModeContext must be used within a DarkModeProvider');
  }
  return context;
}

interface DarkModeProviderProps {
  children: ReactNode;
}

export function DarkModeProvider({ children }: DarkModeProviderProps) {
  const darkModeHook = useDarkMode();
  
  const [state, dispatch] = useReducer(darkModeReducer, {
    isDarkMode: darkModeHook.isDarkMode,
    isLoading: darkModeHook.isLoading,
  });

  // Update state when hook values change
  useEffect(() => {
    dispatch({ type: 'SET_DARK_MODE', payload: darkModeHook.isDarkMode });
    dispatch({ type: 'SET_LOADING', payload: darkModeHook.isLoading });
  }, [darkModeHook.isDarkMode, darkModeHook.isLoading]);

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    darkModeHook.toggleDarkMode();
  };

  const setDarkMode = (value: boolean) => {
    dispatch({ type: 'SET_DARK_MODE', payload: value });
    darkModeHook.setDarkMode(value);
  };

  const contextValue: DarkModeContextType = {
    ...state,
    toggleDarkMode,
    setDarkMode,
  };

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
} 