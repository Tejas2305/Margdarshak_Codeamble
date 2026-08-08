import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStackNavigator from './AuthStackNavigator';
import MainStackNavigator from './MainStackNavigator';

const Stack = createNativeStackNavigator();

// 🔧 DEVELOPMENT BYPASS: Set to true to skip login and go directly to home page
// This allows you to see the app UI without backend running
const BYPASS_AUTH = true; // Change to false to enable normal authentication flow

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={BYPASS_AUTH ? 'Main' : 'Auth'}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Main" component={MainStackNavigator} />
    </Stack.Navigator>
  );
}
