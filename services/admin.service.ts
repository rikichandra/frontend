import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/api';
import { AdminInput } from '@/lib/validators';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const adminService = {
  async getAdmins(filters: AdminFilters = {}): Promise<PaginatedResponse<Admin>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMINS, { params: filters });
    return response.data;
  },

  async getAdminById(id: string): Promise<ApiResponse<Admin>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN_BY_ID(id));
    return response.data;
  },

  async createAdmin(adminData: AdminInput): Promise<ApiResponse<Admin>> {
    const response = await apiClient.post(API_ENDPOINTS.ADMINS, adminData);
    return response.data;
  },

  async updateAdmin(id: string, adminData: Partial<AdminInput>): Promise<ApiResponse<Admin>> {
    const response = await apiClient.put(API_ENDPOINTS.ADMIN_BY_ID(id), adminData);
    return response.data;
  },

  async deleteAdmin(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(API_ENDPOINTS.ADMIN_BY_ID(id));
    return response.data;
  },

  async toggleAdminStatus(id: string): Promise<ApiResponse<Admin>> {
    const response = await apiClient.patch(`${API_ENDPOINTS.ADMIN_BY_ID(id)}/toggle-status`);
    return response.data;
  },
};