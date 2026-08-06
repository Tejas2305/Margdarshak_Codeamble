// API Request/Response Types

// Auth Types
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  password: string;
  date_of_birth?: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
}

export interface LoginRequest {
  username: string; // Backend expects 'username' for email in OAuth2PasswordRequestForm
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

// User Types
export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role_id: number;
  is_verified: boolean;
  account_status: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  profile_picture?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    first_name: string;
    last_name: string;
    phone_number?: string;
    date_of_birth?: string;
    profile_picture?: string;
  };
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// Emergency Contact Types
export interface EmergencyContact {
  contact_id: number;
  name: string;
  phone_number: string;
}

export interface EmergencyContactCreate {
  name: string;
  phone_number: string;
}

export interface EmergencyContactUpdate {
  contact_id: number;
  name?: string;
  phone_number?: string;
}

export interface EmergencyContactResponse {
  message: string;
  contact_id: number;
}

// Report Types
export interface Category {
  category_id: number;
  name: string;
  description: string;
}

// Generic API Response
export interface ApiError {
  detail: string;
}
