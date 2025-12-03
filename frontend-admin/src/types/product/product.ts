import { Category } from "../category/category";

// Định nghĩa type cho product item
export interface ProductRow {
  id: number;
  name: string;
  category: Category;
  imageUrl: string;
  status: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK';
  variants: number;
  description: string;
  minPrice: number;
  totalSold: number;
  totalReviews: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProducts {
  content: ProductRow[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export interface Product {
  id?: number;
  name: string;
  slug: string;
  description: string;
  cate?: Category;
  status: "DRAFT" | "ACTIVE" | "OUT_OF_STOCK";
  userId?: number;
  specifications?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}