'use client';

import { OrderItem } from '@/types/user';
import { Button } from '@/components/ui/button';
import { canReviewOrder } from '@/lib/utils/orderStatus';
import { Star, Package } from 'lucide-react';
import { imageUrl } from '@/lib/utils/imageUrl';
import Image from 'next/image';

interface OrderItemCardProps {
    item: OrderItem;
    orderStatus: string;
    onReviewClick: () => void;
}

/**
 * Component for displaying individual order items.
 * Shows product info, variant details, and review button.
 */
export function OrderItemCard({ item, orderStatus, onReviewClick }: OrderItemCardProps) {
    const itemTotal = item.quantity * item.orderedProductPrice;
    const variant = item.productVariant;
    const hasImage = variant?.imageUrl;

    return (
        <div className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors flex">
            {/* Product Image */}
            <div className="shrink-0 w-[100px] h-[100px] bg-muted flex items-center justify-center">
                {hasImage ? (
                    <Image
                        width={100}
                        height={100}
                        src={imageUrl.product(variant.imageUrl!)}
                        alt={item.product.name}
                        unoptimized={true}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Package className="h-8 w-8 text-muted-foreground" />
                )}
            </div>

            <div className="p-3 space-y-2 flex-1">
                {/* Product Info */}
                <div>
                    <p className="font-medium text-sm line-clamp-2">
                        {item.product.name}
                    </p>
                    {/* Variant Name */}
                    {variant?.variantName && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Variant: <span className="text-foreground">{variant.variantName}</span>
                        </p>
                    )}
                    {variant?.sku && !variant.sku.startsWith('VAR-') && (
                        <p className="text-xs text-muted-foreground">
                            SKU: {variant.sku}
                        </p>
                    )}
                </div>

                {/* Variant Options (Color, Size, etc.) */}
                {variant?.optionValues && variant.optionValues.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                        {variant.optionValues.map((opt, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-secondary px-2 py-1 rounded"
                            >
                                {opt.productOptionValue.displayValue}
                            </span>
                        ))}
                    </div>
                )}

                {/* Price & Quantity */}
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                    <span className="text-muted-foreground">
                        Qty: {item.quantity} × ${item.orderedProductPrice.toFixed(2)}
                    </span>
                    <span className="font-semibold">
                        ${itemTotal.toFixed(2)}
                    </span>
                </div>

                {/* Review Button */}
                {canReviewOrder(orderStatus) && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={onReviewClick}
                    >
                        <Star className="h-3 w-3 mr-1" />
                        Write Review
                    </Button>
                )}
            </div>
        </div>
    );
}

