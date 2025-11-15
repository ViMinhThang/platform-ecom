export interface Category {
  imageUrl?: string;
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryResponse {
  content: Category[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
