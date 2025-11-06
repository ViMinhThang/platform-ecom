// Định nghĩa type cho category
export interface CategoryDTO {
  id: number;
  name: string;
}

// Định nghĩa type cho product item
export interface ProductRow{
  id: number;
  name: string;
  category: CategoryDTO;
  imageUrl: string;
  status: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK';
  variants: number; 
  description: string;
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
  cate?: CategoryDTO;
  status: "DRAFT" | "ACTIVE" | "OUT_OF_STOCK";
  userId?: number;
  specifications?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}