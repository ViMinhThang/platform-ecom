// Sale Campaign Types for Client (Customer View)

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
    isAvailable: boolean;
}

export interface DiscountTier {
    id?: number;
    minQuantity?: number;
    discountPercent: number;
    minPrice?: number;
    maxPrice?: number;
    sortOrder?: number;
}

export interface SaleCampaign {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    bannerUrl: string | null;
    status: string;
    startTime: string;
    endTime: string;
    items: SaleCampaignItem[];
    totalItems: number;
    remainingSeconds: number;
    // Admin specific fields
    categories?: Array<{ id: number; name: string; slug: string; categoryId?: number; categoryName?: string }>;
    discountTiers?: DiscountTier[];
    minOrderAmount?: number;
    maxDiscountAmount?: number;
}

export type SaleCampaignDiscountTier = DiscountTier;

export interface CreateSaleCampaignRequest {
    name: string;
    description?: string;
    bannerUrl?: string;
    startTime: string;
    endTime: string;
    categoryIds?: number[];
    discountTiers?: DiscountTier[];
    minOrderAmount?: number;
    maxDiscountAmount?: number;
}

export interface UpdateSaleCampaignRequest extends Partial<CreateSaleCampaignRequest> {}

export interface SaleCampaignResponse {
    content: SaleCampaign[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}
