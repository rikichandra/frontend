import { Category } from './category';

export interface Product {
  id: string;
  name: string;
  description?: string;
  slug: string;
  sku: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock?: number;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  attributes: ProductAttribute[];
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select';
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'inch';
}

export interface CreateProductInput {
  name: string;
  description?: string;
  sku: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock?: number;
  categoryId: string;
  images?: Omit<ProductImage, 'id'>[];
  attributes?: Omit<ProductAttribute, 'id'>[];
  isActive?: boolean;
  isFeatured?: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  tags?: string[];
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  costPrice?: number;
  stock?: number;
  minStock?: number;
  categoryId?: string;
  images?: Omit<ProductImage, 'id'>[];
  attributes?: Omit<ProductAttribute, 'id'>[];
  isActive?: boolean;
  isFeatured?: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  tags?: string[];
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
}