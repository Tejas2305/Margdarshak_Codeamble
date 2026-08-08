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

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyForgotPasswordOTPRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

// User Types
export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  role_id: number;
  email_verified: boolean;
  phone_verified: boolean;
  account_status: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  date_of_birth?: string | null;
  profile_picture?: string | null;
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    date_of_birth?: string | null;
    profile_picture?: string | null;
  };
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface SendOTPRequest {
  phone_number: string;
}

export interface VerifyOTPRequest {
  phone_number: string;
  otp: string;
}

export interface VerifyEmailOTPRequest {
  otp: string;
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
  phone_number: string;
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
  severity_min?: number;
  severity_max?: number;
}

export interface ReportCreate {
  category_id: number;
  user_rating: number;
  description?: string | null;
  latitude: number;
  longitude: number;
}

export interface Report {
  report_id: number;
  user_id?: number;
  category_id: number;
  category_name?: string;
  user_rating?: number;
  computed_severity: number;
  description?: string | null;
  latitude: number;
  longitude: number;
  status: string;
  upvotes?: number;
  downvotes?: number;
  confidence_score: number;
  created_at?: string | null;
}

export interface VoteResponse {
  report_id: number;
  upvotes: number;
  downvotes: number;
  confidence_score: number;
  message: string;
}

export interface VoteRequest {
  vote_type: number;
}

// Map Types
export interface LocationPoint {
  lat: number;
  lng: number;
}

export interface SpeedLimitResponse {
  segment_id?: number | null;
  road_name?: string | null;
  base_speed_kmh: number;
  updated_speed_kmh: number;
  risk_score: number;
}

export interface RouteSafetyRequest {
  origin: LocationPoint;
  destination: LocationPoint;
}

export interface RouteSafetyOption {
  route_index: number;
  distance_meters: number;
  duration_seconds: number;
  adjusted_duration_seconds: number;
  average_risk_score: number;
  safety_index: number;
  is_safest: boolean;
  warnings: string[];
  geometry?: Record<string, unknown> | null;
}

export interface RouteSafetyResponse {
  routes: RouteSafetyOption[];
  recommended_route_index: number;
}

// SOS Types
export interface SosTriggerRequest {
  latitude: number;
  longitude: number;
  address?: string | null;
  battery_percentage?: number | null;
}

export interface SosResponse {
  message: string;
  sos_id: number;
  status: string;
  created_at: string;
  google_maps_url: string;
}

export interface SosHistoryItem {
  sos_id: number;
  latitude: number;
  longitude: number;
  address?: string | null;
  battery_percentage?: number | null;
  status: string;
  created_at: string;
  google_maps_url: string;
}

export interface MessageResponse {
  message: string;
}

export interface RootResponse {
  message?: string;
  [key: string]: unknown;
}

// Generic API Response
export interface ApiError {
  detail: string;
}
