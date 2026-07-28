export type AuthStackParamList = {
  AuthLanding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  ResetPassword: { email: string };
  Permissions: undefined;
  Success: undefined;
};
