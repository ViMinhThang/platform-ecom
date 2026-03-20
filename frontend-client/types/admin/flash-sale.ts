export type FlashSaleStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export interface FlashSaleItem {
    id: number;
    variantId: number;
    productId: number;
    productName: string;
    productSlug: string;
    variantSku: string;
    imageUrl: string | null;
    originalPrice: number;
    flashSalePrice: number;
    discountPercent: number;
    stockLimit: number;
    soldCount: number;
    remainingStock: number;
    sortOrder: number;
    isAvailable: boolean;
}

export interface FlashSale {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    bannerUrl: string | null;
    status: FlashSaleStatus;
    startTime: string;
    endTime: string;
    items: FlashSaleItem[];
    totalItems: number;
    remainingSeconds: number;
    createdAt: string;
    updatedAt: string;
}

export interface FlashSaleResponse {
    content: FlashSale[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}

export interface CreateFlashSaleRequest {
    name: string;
    description?: string;
    bannerUrl?: string;
    startTime: string;
    endTime: string;
    items?: AddFlashSaleItemRequest[];
}

export interface UpdateFlashSaleRequest {
    name?: string;
    description?: string;
    bannerUrl?: string;
    startTime?: string;
    endTime?: string;
}

export interface AddFlashSaleItemRequest {
    variantId: number;
    flashSalePrice: number;
    stockLimit: number;
    sortOrder?: number;
}

export interface UpdateFlashSaleItemRequest {
    flashSalePrice?: number;
    stockLimit?: number;
    sortOrder?: number;
}
