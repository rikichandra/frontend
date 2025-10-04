import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/api';
import { ProductInput } from '@/lib/validators';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, { params: filters });
    return response.data;
  },

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  },

  async createProduct(productData: ProductInput): Promise<ApiResponse<Product>> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data;
  },

  async updateProduct(id: string, productData: Partial<ProductInput>): Promise<ApiResponse<Product>> {
    const response = await apiClient.put(API_ENDPOINTS.PRODUCT_BY_ID(id), productData);
    return response.data;
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  },

  async updateStock(id: string, stock: number): Promise<ApiResponse<Product>> {
    const response = await apiClient.patch(`${API_ENDPOINTS.PRODUCT_BY_ID(id)}/stock`, { stock });
    return response.data;
  },

  async toggleProductStatus(id: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.patch(`${API_ENDPOINTS.PRODUCT_BY_ID(id)}/toggle-status`);
    return response.data;
  },
};