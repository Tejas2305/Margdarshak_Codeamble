import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import SplashScreen     from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import AuthNavigator    from './src/navigation/AuthNavigator';
import { Colors }       from './src/theme';

type Screen = 'splash' | 'onboarding' | 'auth';

// Set to true after first launch (in production: persist via AsyncStorage)
const SEEN_ONBOARDING = false;

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  const onSplashDone    = useCallback(() => setScreen(SEEN_ONBOARDING ? 'auth' : 'onboarding'), []);
  const onOnboardingDone = useCallback(() => setScreen('auth'), []);

  if (screen === 'splash') {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <SplashScreen onFinish={onSplashDone} />
      </SafeAreaProvider>
    );
  }

  if (screen === 'onboarding') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
          <OnboardingScreen onDone={onOnboardingDone} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
