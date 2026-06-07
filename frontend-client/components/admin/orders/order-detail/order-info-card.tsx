'use client';

import { AdminOrderGroup } from '@/types/order/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { getPaymentStatusLabel } from '@/lib/utils/order-labels';
import { User, CreditCard, MapPin } from 'lucide-react';

interface OrderInfoCardProps {
    order: AdminOrderGroup;
}

export const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ order }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Trạng thái thanh toán */}
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Trạng thái thanh toán</span>
                    <Badge variant={order.paymentStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                </div>

                <Separator />

                {/* Customer Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="size-4" /> Khách hàng
                    </div>
                    <div className="text-sm text-muted-foreground pl-6">
                        <p>{order.userName}</p>
                        <p>{order.userEmail}</p>
                    </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="size-4" /> Địa chỉ giao hàng
                    </div>
                    <div className="text-sm text-muted-foreground pl-6">
                        <p>{order.shippingAddress.street}</p>
                        <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>

                <Separator />

                {/* Financials */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <CreditCard className="size-4" /> Chi tiết thanh toán
                    </div>
                    <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tạm tính</span>
                            <span>{formatCurrency(order.totalAmount - order.taxAmount - order.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Phí vận chuyển</span>
                            <span>{formatCurrency(order.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Thuế</span>
                            <span>{formatCurrency(order.taxAmount)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                            <span>Tổng cộng</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
