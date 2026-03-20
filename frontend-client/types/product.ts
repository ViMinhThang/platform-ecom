// TypeScript interfaces matching backend DTOs

export interface Category {
  id: number;
  name: string;
  slug: string;
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
  minPrice: number;
  id: number;
  name: string;
  slug: string;
  category: Category;
  imageUrl?: string;
  status: string;
  variants?: number;
  description?: string;
  averageRating?: number;
  totalSold?: number;
  totalReviews?: number;
  firstVariant?: ProductVariant;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  images: ProductImage[];
  cate: Category;
  status: string;
  userId?: number;
  specifications?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  totalSold?: number;
  totalReviews?: number;
  averageRating?: number;
  minPrice?: number;
}

export interface ProductResponse {
  content: ProductRow[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export interface ProductOptionValue {
  id: number;
  value: string;
  displayValue: string;
  sortOrder: number;
}

export interface ProductOption {
  id: number;
  name: string;
  displayName: string;
  isRequired: boolean;
  sortOrder: number;
  values: ProductOptionValue[];
}

export interface VariantOptionValue {
  id: number;
  variantId: number;
  optionId: number;
  productOptionValue: ProductOptionValue;
  priceModifier: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  totalSold?: number;
  salePrice?: number;
  discountPercent?: number;
  isActive: boolean;
  hidden?: boolean;
  imageUrl?: string;
  optionValues: VariantOptionValue[];
}

export interface ProductDetail extends Product {
  options: ProductOption[];
  variants: ProductVariant[];
}
export interface ProductImage {
  id: number;
  imageUrl: string;
  productId?: number;
  product?: Product;
  isMain?: boolean;
  createdAt: string | Date;
}

export interface PaginatedProducts {
  content: ProductRow[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
