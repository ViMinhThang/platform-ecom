import { CartItemDTO } from "./cart.types";

export type VoucherType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type ApplyMode = 'MANUAL' | 'AUTO';
export type VoucherStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface VoucherDTO {
    id: number;
    code: string;
    name: string;
    description?: string;
    type: VoucherType;
    categoryId?: number;
    applyMode: ApplyMode;
    status: VoucherStatus;
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    usageLimitPerUser?: number;
    currentUsageCount: number;
    startTime: string;
    endTime: string;
    saleCampaignId?: number;
}

export interface DiscountResult {
    originalTotal: number;
    productDiscount: number;
    shippingDiscount: number;
    totalDiscount: number;
    finalTotal: number;
    appliedProductVoucher?: VoucherDTO;
    appliedShippingVoucher?: VoucherDTO;
    warnings: string[];
}

export interface CalculateDiscountRequest {
    orderId?: number;
    items: CartItemDTO[];
    shippingFee: number;
    voucherCodes?: string[];
    userId: number;
}
