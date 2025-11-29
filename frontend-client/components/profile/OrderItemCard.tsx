'use client';

import { OrderItem } from '@/types/user';
import { Button } from '@/components/ui/button';
import { canReviewOrder } from '@/lib/utils/orderStatus';
import { Star } from 'lucide-react';

interface OrderItemCardProps {
    item: OrderItem;
    orderStatus: string;
    onReviewClick: () => void;
}

/**
 * Component for displaying individual order items.
 * Shows product info and review button.
 */
export function OrderItemCard({ item, orderStatus, onReviewClick }: OrderItemCardProps) {
    const itemTotal = item.quantity * item.orderedProductPrice;

    return (
        <div className="border rounded-lg p-3 space-y-2 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                        Product ID: {item.productId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ${item.orderedProductPrice.toFixed(2)}
                    </p>
                </div>
                <p className="font-semibold text-sm whitespace-nowrap">
                    ${itemTotal.toFixed(2)}
                </p>
            </div>

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
    );
}
