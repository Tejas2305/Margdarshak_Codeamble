import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStackNavigator from './AuthStackNavigator';
import MainStackNavigator from './MainStackNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Main" component={MainStackNavigator} />
    </Stack.Navigator>
  );
}
