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
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
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
    estimatedDelivery?: string;
    createdAt: string;
    shippedAt?: string;
    deliveredAt?: string;
    items: SubOrderItemDTO[];
}

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
}

/**
 * Checkout session returned from initiateCheckout
 * Contains Stripe client secret for payment
 */
export interface CheckoutSession {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    addressId: number;
}

/**
 * Request to confirm payment and create order
 */
export interface ConfirmPaymentRequest {
    paymentIntentId: string;
    addressId: number;
}
