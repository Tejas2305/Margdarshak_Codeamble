import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import SearchScreen from '../screens/main/SearchScreen';
import RouteComparisonScreen from '../screens/main/RouteComparisonScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import EmergencyContactsScreen from '../screens/main/EmergencyContactsScreen';
import APITestScreen from '../screens/APITestScreen';

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="RouteComparison" component={RouteComparisonScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
      <Stack.Screen 
        name="APITest" 
        component={APITestScreen}
        options={{ headerShown: true, title: 'API Test' }}
      />
    </Stack.Navigator>
  );
}
