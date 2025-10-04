import { z } from 'zod';

// Auth Validators
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  nama_depan: z.string().min(2, 'First name must be at least 2 characters'),
  nama_belakang: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  tanggal_lahir: z.string().optional().nullable(),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Admin Validators
export const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'super_admin']),
  isActive: z.boolean().default(true),
});

// Category Validators
export const categorySchema = z.object({
  nama_kategori: z.string().min(2, 'Category name must be at least 2 characters'),
  deskripsi_kategori: z.string().optional(),
});

// Product Validators
export const productSchema = z.object({
  kategori_produk_id: z.number().positive('Category is required'),
  nama_produk: z.string().min(2, 'Product name must be at least 2 characters'),
  deskripsi_produk: z.string().optional(),
  stok_produk: z.number().int().min(0, 'Stock cannot be negative'),
  gambar_produk: z.any().optional(), // For file upload
});

// Transaction Validators
export const transactionSchema = z.object({
  jenis_transaksi: z.enum(['in', 'out'], {
    message: 'Transaction type must be either "in" or "out"',
  }),
  catatan_transaksi: z.string().optional(),
  produk: z.array(z.object({
    produk_id: z.number().positive('Product is required'),
    jumlah_produk: z.number().int().positive('Quantity must be positive'),
  })).min(1, 'At least one product is required'),
});

// User Profile Validators
export const userUpdateSchema = z.object({
  nama_depan: z.string().max(255, 'First name must not exceed 255 characters').optional(),
  nama_belakang: z.string().max(255, 'Last name must not exceed 255 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  password_confirmation: z.string().optional(),
  tanggal_lahir: z.string().optional(),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AdminInput = z.infer<typeof adminSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

// Transaction response type from API
export interface Transaction {
  id: number;
  jenis_transaksi: 'in' | 'out';
  user_id: number;
  produk: Array<{
    produk_id: number;
    jumlah_produk: number;
    nama_produk: string;
  }>;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}