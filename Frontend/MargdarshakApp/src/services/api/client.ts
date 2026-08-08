import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';

const normalizeBaseUrl = (url?: string) => {
  const fallbackUrl = '';
  const baseUrl = (url || fallbackUrl).replace(/\/+$/, '').replace('/openapi.json', '');

  return baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
};

const BASE_URL = normalizeBaseUrl(API_BASE_URL);

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    const token = await SecureStore.getItemAsync('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log the error
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} ${error.config?.url}`, error.response.data);
    } else if (error.request) {
      console.error('❌ Network Error: No response received', error.message);
    } else {
      console.error('❌ Request Error:', error.message);
    }

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(
            `${BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token: newRefreshToken } = response.data;

          // Store new tokens
          await SecureStore.setItemAsync('access_token', access_token);
          if (newRefreshToken) {
            await SecureStore.setItemAsync('refresh_token', newRefreshToken);
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Refresh failed, clear tokens and redirect to login
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        // You can emit an event here to redirect to login screen
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { BASE_URL };
