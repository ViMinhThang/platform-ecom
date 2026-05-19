export type SaleCampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export interface SaleCampaignItem {
    id: number;
    variantId: number;
    productId: number;
    productName: string;
    productSlug: string;
    variantSku: string;
    imageUrl: string | null;
    originalPrice: number;
    salePrice: number;
    discountPercent: number;
    stockLimit: number;
    soldCount: number;
    remainingStock: number;
    sortOrder: number;
    isAvailable: boolean;
}

export interface SaleCampaignCategory {
    id: number;
    categoryId: number;
    categoryName: string;
    categorySlug: string;
    categoryImageUrl: string | null;
}

export interface SaleCampaignDiscountTier {
    id?: number;
    minPrice: number;
    maxPrice: number;
    discountPercent: number;
    sortOrder?: number;
}

export interface SaleCampaign {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    bannerUrl: string | null;
    status: SaleCampaignStatus;
    startTime: string;
    endTime: string;
    items: SaleCampaignItem[];
    categories: SaleCampaignCategory[];
    discountTiers: SaleCampaignDiscountTier[];
    totalItems: number;
    remainingSeconds: number;
    createdAt: string;
    updatedAt: string;
}

export interface SaleCampaignResponse {
    content: SaleCampaign[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}

export interface CreateSaleCampaignRequest {
    name: string;
    description?: string;
    bannerUrl?: string;
    startTime: string;
    endTime: string;
    categoryIds: number[];
    discountTiers: SaleCampaignDiscountTier[];
}

export interface UpdateSaleCampaignRequest {
    name?: string;
    description?: string;
    bannerUrl?: string;
    startTime?: string;
    endTime?: string;
}
