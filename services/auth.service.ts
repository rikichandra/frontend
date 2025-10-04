import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse } from '@/lib/api';
import { LoginInput, RegisterInput } from '@/lib/validators';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginInput): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  async register(userData: RegisterInput): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, userData);
    return response.data;
  },
};