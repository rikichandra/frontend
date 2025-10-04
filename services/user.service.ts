import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse } from '@/lib/api';

export interface User {
  id: number;
  nama_depan: string;
  nama_belakang: string;
  email: string;
  tanggal_lahir: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  created_at: string;
  updated_at: string;
}

export interface UserUpdateInput {
  nama_depan?: string;
  nama_belakang?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
}

export const userService = {
  // Get current user profile
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/user');
    return response.data;
  },

  // Update current user profile
  updateUser: async (userId: number, data: UserUpdateInput): Promise<ApiResponse<User>> => {
    console.log('UserService: Making PUT request to /user/' + userId + ' with data:', data);
    const response = await apiClient.put(`/user/${userId}`, data);
    console.log('UserService: Received response:', response.data);
    return response.data;
  },
};