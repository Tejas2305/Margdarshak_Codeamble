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

// Icon components (professional, non-emoji)
const MapIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Text style={[styles.iconSymbol, focused && styles.iconSymbolActive]}>○</Text>
  </View>
);

const ReportsIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Text style={[styles.iconSymbol, focused && styles.iconSymbolActive]}>□</Text>
  </View>
);

const DashboardIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Text style={[styles.iconSymbol, focused && styles.iconSymbolActive]}>≡</Text>
  </View>
);

const SOSIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Text style={[styles.iconSymbol, focused && styles.iconSymbolActive]}>!</Text>
  </View>
);

// Professional tab bar with icon and label
const TabIcon = ({ focused, label, IconComponent }: { focused: boolean; label: string; IconComponent: React.ComponentType<{ focused: boolean }> }) => (
  <View style={styles.tabItem}>
    <IconComponent focused={focused} />
    <Text 
      style={[styles.label, focused && styles.labelActive]}
      numberOfLines={1}
      ellipsizeMode="clip"
    >
      {label}
    </Text>
  </View>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Map" IconComponent={MapIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Reports" IconComponent={ReportsIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Dashboard" IconComponent={DashboardIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="SOS"
        component={SOSScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="SOS" IconComponent={SOSIcon} />
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
    borderTopColor: theme.colors.borderLight,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    width: 85,
    maxWidth: 85,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: theme.colors.primary + '15',
  },
  iconSymbol: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  iconSymbolActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.2,
    textAlign: 'center',
    width: '100%',
  },
  labelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
