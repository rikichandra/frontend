import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/api';
import { CategoryInput } from '@/lib/validators';

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const categoryService = {
  async getCategories(filters: CategoryFilters = {}): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES, { params: filters });
    return response.data;
  },

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  },

  async createCategory(categoryData: CategoryInput): Promise<ApiResponse<Category>> {
    const response = await apiClient.post(API_ENDPOINTS.CATEGORIES, categoryData);
    return response.data;
  },

  async updateCategory(id: string, categoryData: Partial<CategoryInput>): Promise<ApiResponse<Category>> {
    const response = await apiClient.put(API_ENDPOINTS.CATEGORY_BY_ID(id), categoryData);
    return response.data;
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  },

  async toggleCategoryStatus(id: string): Promise<ApiResponse<Category>> {
    const response = await apiClient.patch(`${API_ENDPOINTS.CATEGORY_BY_ID(id)}/toggle-status`);
    return response.data;
  },
};