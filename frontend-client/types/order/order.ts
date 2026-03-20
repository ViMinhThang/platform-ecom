export interface Address {
    zipCode: string;
    addressId: number;
    street: string;
    buildingName?: string;
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
    isDefault?: boolean;
}

export interface SubOrderItem {
    id: number;
    productId: number;
    productName: string;
    variantId: number;
    variantName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface AdminSubOrder {
    id: number;
    subOrderNumber: string;
    sellerId: number;
    sellerName: string;
    sellerEmail?: string;
    status: string;
    fulfillmentStatus?: string;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    total: number;
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
    ghnOrderCode?: string;
    estimatedDelivery?: string;
    createdAt: string;
    updatedAt: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    items: SubOrderItem[];
}

export interface AdminOrderGroup {
    id: number;
    groupNumber: string;
    userId: number;
    userEmail: string;
    userName: string;
    totalAmount: number;
    taxAmount: number;
    shippingCost: number;
    discountAmount: number;
    currency: string;
    paymentStatus: string;
    overallStatus: string;
    shippingAddress: Address;
    billingAddress?: Address;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    subOrders: AdminSubOrder[];
}

export interface OrderFilterRequest {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    groupNumber?: string;
    overallStatus?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    sellerName?: string;
}

export interface TrackingUpdateRequest {
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
    estimatedDelivery?: string;
    fulfillmentStatus?: string;
}

