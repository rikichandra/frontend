import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/api';
import { TransactionInput } from '@/lib/validators';

export interface TransactionItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  price: number;
  total: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  search?: string;
  customerId?: string;
  status?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

export const transactionService = {
  async getTransactions(filters: TransactionFilters = {}): Promise<PaginatedResponse<Transaction>> {
    const response = await apiClient.get(API_ENDPOINTS.TRANSACTIONS, { params: filters });
    return response.data;
  },

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.get(API_ENDPOINTS.TRANSACTION_BY_ID(id));
    return response.data;
  },

  async createTransaction(transactionData: TransactionInput): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.post(API_ENDPOINTS.TRANSACTIONS, transactionData);
    return response.data;
  },

  async updateTransaction(id: string, transactionData: Partial<TransactionInput>): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.put(API_ENDPOINTS.TRANSACTION_BY_ID(id), transactionData);
    return response.data;
  },

  async updateTransactionStatus(id: string, status: Transaction['status']): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.patch(`${API_ENDPOINTS.TRANSACTION_BY_ID(id)}/status`, { status });
    return response.data;
  },

  async cancelTransaction(id: string): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.patch(`${API_ENDPOINTS.TRANSACTION_BY_ID(id)}/cancel`);
    return response.data;
  },

  async getTransactionSummary(filters: Omit<TransactionFilters, 'page' | 'limit'> = {}) {
    const response = await apiClient.get(`${API_ENDPOINTS.TRANSACTIONS}/summary`, { params: filters });
    return response.data;
  },
};