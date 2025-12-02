import { Product } from "./product";

export interface CartProduct extends Product {
    quantity: number;
    variantId?: number;
    variantSku?: string;
    sellerName?: string;
    minPrice?: number; // Backend ProductDTO has minPrice
}

export interface Cart {
    cartId: number;
    totalPrice: number;
    products: CartProduct[];
}
