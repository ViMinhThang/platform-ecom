'use client';

import { OrderGroupDTO } from '@/types/order.types';
import { OrderItemCard } from './OrderItemCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatOrderDate } from '@/lib/utils/dateUtils';
import { ShoppingCart, Package } from 'lucide-react';
import { transformSubOrderItemToOrderItem } from '@/lib/utils/transformers';

interface OrderCardProps {
    order: OrderGroupDTO;
    onReviewOrderItem: (productId: number, orderId: number) => void;
    onBuyAgain: (order: OrderGroupDTO) => void;
}

/**
 * Component for displaying order information as a card.
 * Shows order details, items, and action buttons.
 */
export function OrderCard({ order, onReviewOrderItem, onBuyAgain }: OrderCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">Order #{order.groupNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {formatOrderDate(order.createdAt)}
                        </span>
                        <StatusBadge status={order.overallStatus} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Order Items */}
                <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                        Items ({order.subOrders.flatMap(o => o.items).length})
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        {order.subOrders.flatMap(subOrder =>
                            subOrder.items.map(item =>
                                transformSubOrderItemToOrderItem(item, subOrder.id, subOrder.status)
                            )
                        ).map((item) => (
                            <OrderItemCard
                                key={`${item.productId}-${item.productVariant?.id || 'no-variant'}`}
                                item={item}
                                orderStatus={order.overallStatus}
                                onReviewClick={() => onReviewOrderItem(item.productId, order.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Total and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                    <div>
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => onBuyAgain(order)}
                        className="gap-2"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Buy Again
                    </Button>
                </div>

                {/* Payment Info */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                    Payment Status: {order.paymentStatus}
                </div>
            </CardContent>
        </Card>
    );
}
