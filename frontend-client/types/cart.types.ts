export interface CartItemDTO {
    id: number;
    productId: number;
    variantId?: number;
    quantity: number;
    price: number;
    totalPrice: number;
    addedAt: string;

    // Product details from product service
    productName: string;
    variantName?: string;
    imageUrl: string;
    sellerId: number;
    sellerName: string;
}

export interface CartDTO {
    id: number;
    userId: number;
    items: CartItemDTO[];
    totalAmount: number;
    totalItems: number;
    createdAt: string;
    updatedAt: string;
}

export interface AddToCartRequest {
    productId: number;
    variantId?: number;
    quantity: number;
}

// Frontend-specific: Cart grouped by seller
export interface CartBySeller {
    sellerId: number;
    sellerName: string;
    items: CartItemDTO[];
    subtotal: number;
}
