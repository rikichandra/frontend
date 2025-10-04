// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User endpoints
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  
  // Admin endpoints
  ADMINS: '/admins',
  ADMIN_BY_ID: (id: string) => `/admins/${id}`,
  
  // Category endpoints
  CATEGORIES: '/kategori-produks',
  CATEGORY_BY_ID: (id: string) => `/kategori-produks/${id}`,
  
  // Product endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  
  // Transaction endpoints
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}