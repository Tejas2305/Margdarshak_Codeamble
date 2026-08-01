import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Import screens
import MapScreen from '../screens/main/MapScreen';
import ReportsScreen from '../screens/main/ReportsScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import SOSScreen from '../screens/main/SOSScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar icons (we'll use emojis for now, can replace with proper icons later)
const TabIcon = ({ focused, emoji, label }: { focused: boolean; emoji: string; label: string }) => (
  <View style={styles.tabItem}>
    <Text style={[styles.emoji, focused && styles.emojiActive]}>{emoji}</Text>
    <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
  </View>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🗺️" label="Map" />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="📝" label="Reports" />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="📊" label="Dashboard" />
          ),
        }}
      />
      <Tab.Screen
        name="SOS"
        component={SOSScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🚨" label="SOS" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  emojiActive: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  labelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
