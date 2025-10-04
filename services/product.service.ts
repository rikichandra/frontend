import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/api';
import { ProductInput } from '@/lib/validators';

export interface Product {
  id: number;
  kategori_produk_id: number;
  nama_produk: string;
  deskripsi_produk?: string;
  gambar_produk?: string;
  gambar_produk_url?: string;
  stok_produk: number;
  kategori_produk: {
    id: number;
    nama_kategori: string;
    deskripsi_kategori?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  s?: string;           // search parameter as used in backend
  per_page?: number;    // pagination parameter as used in backend
  page?: number;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, { params: filters });
    return response.data;
  },

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id.toString()));
    return response.data;
  },

  async createProduct(productData: FormData): Promise<ApiResponse<Product>> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProduct(id: number, productData: FormData): Promise<ApiResponse<Product>> {
    // Laravel's method spoofing for PUT requests with files
    productData.append('_method', 'PUT');
    const response = await apiClient.post(API_ENDPOINTS.PRODUCT_BY_ID(id.toString()), productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id.toString()));
    return response.data;
  },
};