// TypeScript interfaces matching backend DTOs

export interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  content: Category[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export interface ProductRow {
  id: number;
  name: string;
  category: Category;
  imageUrl?: string;
  status: string;
  variants?: number;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  cate: Category;
  status: string;
  specifications?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  content: ProductRow[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
}
