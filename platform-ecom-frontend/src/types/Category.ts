export interface Category {
  categoryId: number;
  categoryName: string;
}
export interface CategoryResponse {
  content: Category[];
  pageNumber: number;
  pageSize: number;
  lastPage: boolean;
  totalPages: number;
  totalElements: number;
}