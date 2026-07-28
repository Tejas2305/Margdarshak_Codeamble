import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import AuthLandingScreen    from '../screens/auth/AuthLandingScreen';
import LoginScreen          from '../screens/auth/LoginScreen';
import RegisterScreen       from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ResetPasswordScreen  from '../screens/auth/ResetPasswordScreen';
import PermissionsScreen    from '../screens/permissions/PermissionsScreen';
import SuccessScreen        from '../screens/auth/SuccessScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#F8FAFC' } }}>
      <Stack.Screen name="AuthLanding"     component={AuthLandingScreen} />
      <Stack.Screen name="Register"        component={RegisterScreen} />
      <Stack.Screen name="Login"           component={LoginScreen} />
      <Stack.Screen name="ForgotPassword"  component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword"   component={ResetPasswordScreen} />
      <Stack.Screen name="Permissions"     component={PermissionsScreen} />
      <Stack.Screen name="Success"         component={SuccessScreen} options={{ animation: 'fade' }} />
    </Stack.Navigator>
  );
}
