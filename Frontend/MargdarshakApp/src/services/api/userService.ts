import apiClient from './client';
import {
  User,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  SendOTPRequest,
  VerifyOTPRequest,
  VerifyEmailOTPRequest,
  MessageResponse,
} from './types';

class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await apiClient.put<UpdateProfileResponse>('/users/me', data);
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await apiClient.put<ChangePasswordResponse>(
      '/users/change-password',
      data
    );
    return response.data;
  }

  /**
   * Delete account
   */
  async deleteAccount(): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>('/users/me');
    return response.data;
  }

  async sendPhoneOTP(phoneNumber: string): Promise<MessageResponse> {
    const payload: SendOTPRequest = { phone_number: phoneNumber };
    const response = await apiClient.post<MessageResponse>('/users/send-phone-otp', payload);
    return response.data;
  }

  async verifyPhoneOTP(phoneNumber: string, otp: string): Promise<MessageResponse> {
    const payload: VerifyOTPRequest = {
      phone_number: phoneNumber,
      otp,
    };

    const response = await apiClient.post<MessageResponse>('/users/verify-phone-otp', payload);
    return response.data;
  }

  async sendEmailOTP(): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/users/send-email-otp');
    return response.data;
  }

  async verifyEmailOTP(otp: string): Promise<MessageResponse> {
    const payload: VerifyEmailOTPRequest = { otp };
    const response = await apiClient.post<MessageResponse>('/users/verify-email-otp', payload);
    return response.data;
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(imageUri: string): Promise<{ message: string; profile_picture_url: string }> {
    const formData = new FormData();
    
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Backend expects field name 'file', not 'profile_picture'
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    console.log('📤 Uploading profile picture...');
    const response = await apiClient.put<{ message: string; profile_picture_url: string }>(
      '/users/me/profile-picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  }
}

export default new UserService();
