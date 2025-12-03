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

export interface GHNService {
    service_id: number;
    short_name: string;
    service_type_id: number;
}

export interface GHNItem {
    name: string;
    code?: string;
    quantity: number;
    price?: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    category?: {
        level1: string;
    };
}

export interface GHNFeeRequest {
    service_id: number;
    service_type_id?: number | null;
    insurance_value: number;
    coupon: string | null;
    to_ward_code: string;
    to_district_id: number;
    from_district_id: number;
    from_ward_code?: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    cod_failed_amount?: number;
    items?: GHNItem[];
}

export interface GHNFeeResponse {
    total: number;
}
