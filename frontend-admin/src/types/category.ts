export interface CategoryDTO {
  id: number;
  name: string;
}

export interface CategoryResponse {
  content: CategoryDTO[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
