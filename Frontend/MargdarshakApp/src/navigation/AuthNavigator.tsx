import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { AuthLandingScreen } from '../screens/auth/AuthLandingScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { OTPVerificationScreen } from '../screens/auth/OTPVerificationScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { SuccessScreen } from '../screens/auth/SuccessScreen';
import { PermissionsScreen } from '../screens/permissions/PermissionsScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
};
