export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  AuthLanding: undefined;
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string; flow: 'register' | 'forgot-password' };
  ResetPassword: { email: string; otp: string };
  Permissions: undefined;
  Success: { type: 'register' | 'reset-password' };
};
