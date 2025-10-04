import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/api';
import { CategoryInput } from '@/lib/validators';

export interface Category {
  id: number;
  nama_kategori: string;
  deskripsi_kategori?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryFilters {
  s?: string;           // search parameter as used in backend
  per_page?: number;    // pagination parameter as used in backend
  page?: number;
}

export const categoryService = {
  async getCategories(filters: CategoryFilters = {}): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES, { params: filters });
    return response.data;
  },

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id.toString()));
    return response.data;
  },

  async createCategory(categoryData: CategoryInput): Promise<ApiResponse<Category>> {
    const response = await apiClient.post(API_ENDPOINTS.CATEGORIES, categoryData);
    return response.data;
  },

  async updateCategory(id: number, categoryData: Partial<CategoryInput>): Promise<ApiResponse<Category>> {
    const response = await apiClient.put(API_ENDPOINTS.CATEGORY_BY_ID(id.toString()), categoryData);
    return response.data;
  },

  async deleteCategory(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(API_ENDPOINTS.CATEGORY_BY_ID(id.toString()));
    return response.data;
  },
};