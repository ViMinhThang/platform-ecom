import type { Address } from "./Address";
import type { Role } from "./Roles";

export interface User {
  roles: Role[];
  isAvailable: string;
  userId: number;
  username: string;
  email: string;
  password: string;
  addresses: Address[];
}
export interface UserResponse {
  content: User[];
  pageNumber: number;
  pageSize: number;
  lastPage: boolean;
  totalPages: number;
  totalElements: number;
}
export interface UserFormValues {
   roles: Role[];
  isAvailable: string;
  userId: number;
  username: string;
  email: string;
  password: string;
  addresses: Address[];
}

