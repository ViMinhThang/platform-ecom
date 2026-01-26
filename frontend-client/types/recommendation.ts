export interface ProductRecommendation {
    product_id: number;
    product_name: string;
    slug: string;
    image_url: string;
    category_id: number;
    category_name: string;
    
    // Pricing
    original_price: number;
    sale_price?: number;
    discount_percent?: number;
    is_on_sale: boolean;
    
    // Recommendation metadata
    score: number;
    reason: string;
    reason_type: 'SIMILAR' | 'COLLABORATIVE' | 'TRENDING' | 'SALE';
    
    // Stock info
    in_stock: boolean;
    stock_quantity: number;
}
