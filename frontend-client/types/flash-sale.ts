// Flash Sale Types for Client (Customer View)

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
    isAvailable: boolean;
}

export interface FlashSale {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    bannerUrl: string | null;
    status: string;
    startTime: string;
    endTime: string;
    items: FlashSaleItem[];
    totalItems: number;
    remainingSeconds: number;
}
