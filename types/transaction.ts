import { Product } from './product';

export interface Transaction {
  id: string;
  transactionNumber: string;
  customerId: string;
  customer: Customer;
  items: TransactionItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: TransactionStatus;
  notes?: string;
  processedBy: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  productId: string;
  product: Pick<Product, 'id' | 'name' | 'sku' | 'images'>;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: CustomerAddress;
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'check';
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded' | 'failed';
export type TransactionStatus = 'draft' | 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export interface CreateTransactionInput {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  paymentMethod: PaymentMethod;
  discountAmount?: number;
  taxAmount?: number;
  notes?: string;
}

export interface UpdateTransactionInput {
  customerId?: string;
  items?: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  status?: TransactionStatus;
  discountAmount?: number;
  taxAmount?: number;
  notes?: string;
}

export interface TransactionFilters {
  search?: string;
  customerId?: string;
  status?: TransactionStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  processedBy?: string;
  page?: number;
  limit?: number;
  sortBy?: 'transactionNumber' | 'totalAmount' | 'createdAt' | 'processedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionSummary {
  totalTransactions: number;
  totalRevenue: number;
  totalRefunds: number;
  averageOrderValue: number;
  topProducts: {
    product: Pick<Product, 'id' | 'name' | 'sku'>;
    quantity: number;
    revenue: number;
  }[];
  revenueByDay: {
    date: string;
    revenue: number;
    transactions: number;
  }[];
  statusBreakdown: {
    status: TransactionStatus;
    count: number;
    percentage: number;
  }[];
}