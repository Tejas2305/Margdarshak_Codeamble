import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../theme';

// Import screens
import MapScreen from '../screens/main/MapScreen';
import ReportsScreen from '../screens/main/ReportsScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import SOSScreen from '../screens/main/SOSScreen';

const Tab = createBottomTabNavigator();

// Icon components (professional, non-emoji)
const MapIcon = ({ focused, colors }: { focused: boolean; colors: any }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Text style={[styles.iconSymbol, { color: focused ? colors.primary : colors.textSecondary }]}>○</Text>
  </View>
);

const ReportsIcon = ({ focused, colors }: { focused: boolean; colors: any }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Text style={[styles.iconSymbol, { color: focused ? colors.primary : colors.textSecondary }]}>□</Text>
  </View>
);

const DashboardIcon = ({ focused, colors }: { focused: boolean; colors: any }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Text style={[styles.iconSymbol, { color: focused ? colors.primary : colors.textSecondary }]}>≡</Text>
  </View>
);

const SOSIcon = ({ focused, colors }: { focused: boolean; colors: any }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Text style={[styles.iconSymbol, { color: focused ? colors.primary : colors.textSecondary }]}>!</Text>
  </View>
);

// Professional tab bar with icon and label
const TabIcon = ({ focused, label, IconComponent, colors }: { focused: boolean; label: string; IconComponent: React.ComponentType<{ focused: boolean; colors: any }>; colors: any }) => (
  <View style={styles.tabItem}>
    <IconComponent focused={focused} colors={colors} />
    <Text 
      style={[styles.label, { color: focused ? colors.primary : colors.textSecondary }]}
      numberOfLines={1}
      ellipsizeMode="clip"
    >
      {label}
    </Text>
  </View>
);

export default function MainTabNavigator() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
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
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Map" IconComponent={MapIcon} colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Reports" IconComponent={ReportsIcon} colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Dashboard" IconComponent={DashboardIcon} colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="SOS"
        component={SOSScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="SOS" IconComponent={SOSIcon} colors={colors} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#5B8DEE15',
  },
  iconSymbol: {
    fontSize: 22,
    fontWeight: '600',
  },
  iconSymbolActive: {
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
    textAlign: 'center',
    width: '100%',
  },
  labelActive: {
    fontWeight: '600',
  },
});
