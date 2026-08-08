import apiClient from './client';
import * as SecureStore from 'expo-secure-store';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  LogoutRequest,
  ForgotPasswordRequest,
  VerifyForgotPasswordOTPRequest,
  ResetPasswordRequest,
  MessageResponse,
} from './types';

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Backend expects OAuth2PasswordRequestForm format (application/x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 uses 'username' field
    formData.append('password', password);

    const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store tokens securely
    await SecureStore.setItemAsync('access_token', response.data.access_token);
    await SecureStore.setItemAsync('refresh_token', response.data.refresh_token);

    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    // Update stored tokens
    await SecureStore.setItemAsync('access_token', response.data.access_token);
    if (response.data.refresh_token) {
      await SecureStore.setItemAsync('refresh_token', response.data.refresh_token);
    }

    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');

    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', {
          refresh_token: refreshToken,
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear stored tokens
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  }

  async forgotPassword(email: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/auth/forgot-password',
      { email } satisfies ForgotPasswordRequest
    );
    return response.data;
  }

  async verifyForgotPasswordOTP(email: string, otp: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/auth/verify-forgot-password-otp',
      { email, otp } satisfies VerifyForgotPasswordOTPRequest
    );
    return response.data;
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/auth/reset-password',
      { email, otp, new_password: newPassword } satisfies ResetPasswordRequest
    );
    return response.data;
  }

  /**
   * Send email OTP for registration verification (public)
   */
  async sendEmailOTP(email: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/auth/send-email-otp',
      { email }
    );
    return response.data;
  }

  /**
   * Verify email OTP during registration (public)
   */
  async verifyEmailOTP(email: string, otp: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/auth/verify-email-otp',
      { email, otp }
    );
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('access_token');
    return !!token;
  }

  /**
   * Get stored access token
   */
  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('access_token');
  }

  /**
   * Get stored refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('refresh_token');
  }
}

export default new AuthService();
