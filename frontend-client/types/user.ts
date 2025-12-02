import { Product, ProductVariant } from "./product";

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

// TypeScript interfaces matching backend DTOs

// Order related types

export interface OrderItem {
    productId: number;
    quantity: number;
    orderedProductPrice: number;
    product: Product
    productVariant?: ProductVariant;
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
