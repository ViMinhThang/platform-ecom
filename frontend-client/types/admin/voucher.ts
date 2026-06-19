export type VoucherType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type VoucherStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type ApplyMode = 'AUTO' | 'CODE_REQUIRED';

export interface Voucher {
    id: number;
    code: string | null;
    name: string;
    description: string | null;
    type: VoucherType;
    categoryId?: number;
    applyMode: ApplyMode;
    status: VoucherStatus;
    discountValue: number;
    minOrderAmount: number | null;
    maxDiscountAmount: number | null;
    usageLimit: number | null;
    usageLimitPerUser: number | null;
    currentUsageCount: number;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
}

export interface VoucherResponse {
    content: Voucher[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}

export interface CreateVoucherRequest {
    code?: string;
    name: string;
    description?: string;
    type: VoucherType;
    categoryId?: number;
    applyMode: ApplyMode;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    usageLimitPerUser?: number;
    startTime: string;
    endTime: string;
}

export const VOUCHER_TYPE_LABELS: Record<VoucherType, string> = {
    PERCENTAGE: 'Phần trăm',
    FIXED_AMOUNT: 'Số tiền cố định',
};

export const VOUCHER_STATUS_LABELS: Record<VoucherStatus, string> = {
    DRAFT: 'Nháp',
    SCHEDULED: 'Đã lên lịch',
    ACTIVE: 'Đang hoạt động',
    EXPIRED: 'Hết hạn',
    CANCELLED: 'Đã hủy',
};

export const APPLY_MODE_LABELS: Record<ApplyMode, string> = {
    AUTO: 'Tự động áp dụng',
    CODE_REQUIRED: 'Yêu cầu mã',
};
