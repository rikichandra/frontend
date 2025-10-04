export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  productsCount: number;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface CategoryFilters {
  search?: string;
  parentId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'productsCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryTree extends Category {
  level: number;
  hasChildren: boolean;
}