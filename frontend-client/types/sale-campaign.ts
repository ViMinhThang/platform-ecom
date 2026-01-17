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
}
