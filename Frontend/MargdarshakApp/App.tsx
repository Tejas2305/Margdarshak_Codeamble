import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthNavigator } from './src/navigation/AuthNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AuthNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
