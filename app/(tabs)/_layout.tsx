import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';

interface TabConfig {
  name: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const TAB_CONFIGS: TabConfig[] = [
  { name: 'index', title: 'Home', iconName: 'home' },
  { name: 'health-log', title: 'Health Log', iconName: 'medical' },
  { name: 'chat', title: 'Chat', iconName: 'chatbubble' },
  { name: 'profile', title: 'Profile', iconName: 'person' },
];

const TAB_BAR_STYLE = {
  backgroundColor: '#FAF9F6', // Background - Off-White
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
  paddingBottom: 8,
  paddingTop: 8,
  height: 88,
} as const;

const SCREEN_OPTIONS = {
  tabBarActiveTintColor: '#457B9D', // Secondary - Muted Indigo
  tabBarInactiveTintColor: '#9CA3AF',
  tabBarStyle: TAB_BAR_STYLE,
  headerShown: false,
} as const;

export default function TabLayout() {
  const tabScreens = useMemo(() => 
    TAB_CONFIGS.map(({ name, title, iconName }) => (
      <Tabs.Screen
        key={name}
        name={name}
        options={{
          title,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
        }}
      />
    )), 
    []
  );

  return (
    <Tabs screenOptions={SCREEN_OPTIONS}>
      {tabScreens}
    </Tabs>
  );
}
