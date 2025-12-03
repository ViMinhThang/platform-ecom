/**
 * Type transformers for converting DTOs to UI models
 */

import { SubOrderItemDTO } from '@/types/order.types';
import { OrderItem } from '@/types/user';

/**
 * Transform SubOrderItemDTO to OrderItem for OrderItemCard
 * Maps backend DTO fields to the UI component's expected structure
 */
export function transformSubOrderItemToOrderItem(
    item: SubOrderItemDTO,
    subOrderId: number,
    status: string
): OrderItem {
    return {
        productId: item.productId,
        quantity: item.quantity,
        orderedProductPrice: item.unitPrice,
        product: {
            id: item.productId,
            name: item.productName,
            slug: `product-${item.productId}`,
            description: '',
            images: [],
            cate: {
                id: 0,
                name: '',
                imageUrl: undefined,
            },
            status: 'ACTIVE',
        },
        productVariant: item.variantId ? {
            id: item.variantId,
            sku: `VAR-${item.variantId}`,
            price: item.unitPrice,
            stock: 0,
            isActive: true,
            imageUrl: undefined,
            optionValues: [],
        } : undefined,
    };
}
