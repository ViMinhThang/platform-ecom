export interface User {
  userId: number;
  username: string;
  email: string;
  imageUrl: string;
  isActive: boolean;
  roles: role[];
  addresses: Address[];
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

export interface Address {
  addressId: number;
  street: string;
  buildingName: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  provinceId?: number;
  provinceName?: string;
  districtId?: number;
  districtName?: string;
  wardCode?: string;
  wardName?: string;
  isDefault: boolean;
}

export interface UserRow {
  userId: number;
  username: string;
  email: string;
  imageUrl: string;
  isActive: boolean;
  roles: role[];
  addresses: Address[];
}