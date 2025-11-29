// User profile types for frontend

export interface Address {
    addressId?: number;
    street: string;
    buildingName: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    // GHN API fields
    provinceId?: number;
    provinceName?: string;
    districtId?: number;
    districtName?: string;
    wardCode?: string;
    wardName?: string;
    // Default address flag
    isDefault?: boolean;
}

export interface UserProfile {
    userId: number;
    username: string;
    email: string;
    imageUrl?: string;
    isActive: string;
    roles: string[];
    addresses?: Address[];
}

export interface OrderItem {
    productId: number;
    quantity: number;
    discount: number;
    orderedProductPrice: number;
}

export interface Order {
    orderId: number;
    email: string;
    orderItems: OrderItem[];
    orderDate: string;
    payment?: {
        paymentId: number;
        paymentMethod: string;
        pgPaymentId?: string;
        pgStatus?: string;
        pgResponseMessage?: string;
        pgName?: string;
    };
    totalAmount: number;
    orderStatus: string;
    addressId: number;
}

// GHN API types
export interface GHNProvince {
    ProvinceID: number;
    ProvinceName: string;
    Code?: string;
}

export interface GHNDistrict {
    DistrictID: number;
    ProvinceID: number;
    DistrictName: string;
    Code?: string;
}

export interface GHNWard {
    WardCode: string;
    DistrictID: number;
    WardName: string;
}

// API Response types
export interface ApiResponse<T> {
    code: number;
    message: string;
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
