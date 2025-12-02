export interface User {
  userId: number;
  username: string;
  email: string;
  imageUrl: string;
  isActive: string;
  roles: role[];
}

export interface UserResponse {
  content: User[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export interface role {
  roleId: number;
  roleName: string;
}

export interface UserRow {
  userId: number;
  username: string;
  email: string;
  imageUrl: string;
  isActive: string;
  roles: role[];
}