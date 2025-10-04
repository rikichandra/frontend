import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse } from '@/lib/api';
import { TransactionInput } from '@/lib/validators';

export interface Transaction {
  id: number;
  jenis_transaksi: 'in' | 'out';
  user_id: number;
  catatan_transaksi?: string;
  user?: {
    id: number;
    nama_depan: string;
    nama_belakang: string;
    email: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
  };
  detail_transaksis?: Array<{
    id: number;
    transaksi_id: number;
    produk_id: number;
    jumlah_produk: number;
    produk: {
      id: number;
      kategori_produk_id: number;
      nama_produk: string;
      deskripsi_produk: string;
      gambar_produk: string | null;
      stok_produk: number;
      gambar_produk_url: string | null;
    };
    created_at: string;
    updated_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface TransactionFilters {
  s?: string; // Changed from search to s
  page?: number;
  per_page?: number;
  user_id?: number;
}

export interface TransactionPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface TransactionSummary {
  status: boolean;
  message?: string;
  data: {
    current_page: number;
    data: Transaction[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

export const transactionService = {
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionSummary> {
    const response = await apiClient.get(API_ENDPOINTS.TRANSACTIONS, { params: filters });
    return response.data;
  },

  async createTransaction(transactionData: TransactionInput): Promise<ApiResponse<Transaction[]>> {
    const response = await apiClient.post(API_ENDPOINTS.TRANSACTIONS, transactionData);
    return response.data;
  },

  async deleteTransaction(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(`${API_ENDPOINTS.TRANSACTIONS}/${id}`);
    return response.data;
  },
};