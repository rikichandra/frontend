export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  permissions: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  permissions?: string[];
}

export interface UpdateAdminInput {
  name?: string;
  email?: string;
  role?: 'admin' | 'super_admin';
  permissions?: string[];
  isActive?: boolean;
}

export interface AdminFilters {
  search?: string;
  role?: 'admin' | 'super_admin';
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}