'use client';

import { OrderGroupDTO } from '@/types/order.types';
import { OrderItemCard } from './OrderItemCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatOrderDate } from '@/lib/utils/dateUtils';
import { ShoppingCart, Package } from 'lucide-react';
import { transformSubOrderItemToOrderItem } from '@/lib/utils/transformers';
import { formatCurrency } from '@/lib/utils';
import { getPaymentStatusLabel } from '@/lib/utils/order-labels';

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
                        <Package className="size-4 text-muted-foreground" />
                        <span className="font-semibold">Đơn hàng #{order.groupNumber}</span>
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
                        Sản phẩm ({order.subOrders.flatMap(o => o.items).length})
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        {order.subOrders.flatMap(subOrder =>
                            subOrder.items.map(item => {
                                const orderItem = transformSubOrderItemToOrderItem(item, subOrder.id, subOrder.status);
                                return (
                                    <OrderItemCard
                                        key={`${orderItem.productId}-${orderItem.productVariant?.id || 'no-variant'}`}
                                        item={orderItem}
                                        orderStatus={order.overallStatus}
                                        onReviewClick={() => onReviewOrderItem(orderItem.productId, order.id)}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Total and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                    <div>
                        <p className="text-xs text-muted-foreground">Tổng tiền</p>
                        <p className="text-2xl font-bold">{formatCurrency(order.totalAmount)}</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => onBuyAgain(order)}
                        className="gap-2"
                    >
                        <ShoppingCart className="size-4" />
                        Mua lại
                    </Button>
                </div>

                {/* Payment Info */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                    Trạng thái thanh toán: {getPaymentStatusLabel(order.paymentStatus.toUpperCase())}
                </div>
            </CardContent>
        </Card>
    );
}
