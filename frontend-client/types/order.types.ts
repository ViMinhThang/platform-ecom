export enum OrderGroupStatus {
    PAID = 'PAID',
    PROCESSING = 'PROCESSING',
    PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
    COMPLETED = 'COMPLETED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
    FULLY_REFUNDED = 'FULLY_REFUNDED',
    CANCELLED = 'CANCELLED'
}

export enum SubOrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    READY_TO_PICK = 'READY_TO_PICK',
    PICKING = 'PICKING',
    PICKED = 'PICKED',
    SHIPPED = 'SHIPPED',
    STORING = 'STORING',
    TRANSPORTING = 'TRANSPORTING',
    SORTING = 'SORTING',
    DELIVERING = 'DELIVERING',
    DELIVERED = 'DELIVERED',
    DELIVERY_FAIL = 'DELIVERY_FAIL',
    WAITING_TO_RETURN = 'WAITING_TO_RETURN',
    RETURNING = 'RETURNING',
    RETURNED = 'RETURNED',
    CANCELLED = 'CANCELLED',
    REFUND_PENDING = 'REFUND_PENDING',
    REFUNDED = 'REFUNDED',
    EXCEPTION = 'EXCEPTION',
    LOST = 'LOST',
    DAMAGE = 'DAMAGE'
}

export enum PaymentStatus {
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
    FULLY_REFUNDED = 'FULLY_REFUNDED'
}

export interface SubOrderItemDTO {
    id: number;
    productId: number;
    variantId?: number;
    productName: string;
    variantName?: string;
    imageUrl?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface SubOrderDTO {
    id: number;
    subOrderNumber: string;
    groupId: number;
    sellerId: number;
    sellerName: string;
    status: SubOrderStatus;
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
    shippedAt?: string;
    deliveredAt?: string;
    items: SubOrderItemDTO[];
}

import type { Address } from './user';

export interface OrderGroupDTO {
    id: number;
    groupNumber: string;
    userId: number;
    totalAmount: number;
    taxAmount: number;
    shippingCost: number;
    discountAmount: number;
    currency: string;
    paymentStatus: PaymentStatus;
    overallStatus: OrderGroupStatus;
    shippingAddressId: number;
    shippingAddress?: Address;
    billingAddressId?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    subOrders: SubOrderDTO[];
}

export interface CreateOrderRequest {
    addressId: number;
    paymentProvider: string;
    promoCode?: string;
    idempotencyKey: string;
    shippingFee: number;
}


export interface CheckoutSession {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    addressId: number;
}

export interface ConfirmPaymentRequest {
    paymentIntentId: string;
    addressId: number;
    shippingFee: number;
}
