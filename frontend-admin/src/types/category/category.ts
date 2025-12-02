export interface Category {
  imageUrl?: string;
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  content: Category[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
