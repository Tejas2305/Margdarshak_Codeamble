import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainStackNavigator from './src/navigation/MainStackNavigator';

export default function App() {
  // SKIP AUTH - Go directly to main app for testing
  // All screens visible without login
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainStackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
