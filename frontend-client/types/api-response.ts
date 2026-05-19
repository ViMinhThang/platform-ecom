export interface APIResponse<T> {
  code?: number;
  message?: string;
  success?: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
