'use client';

import { AdminOrderGroup } from '@/types/order/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { User, CreditCard, MapPin } from 'lucide-react';

interface OrderInfoCardProps {
    order: AdminOrderGroup;
}

export const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ order }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Payment Status */}
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Payment Status</span>
                    <Badge variant={order.paymentStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                        {order.paymentStatus}
                    </Badge>
                </div>

                <Separator />

                {/* Customer Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4" /> Customer
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
                        <MapPin className="h-4 w-4" /> Shipping Address
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
                        <CreditCard className="h-4 w-4" /> Payment Details
                    </div>
                    <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(order.totalAmount - order.taxAmount - order.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{formatCurrency(order.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span>{formatCurrency(order.taxAmount)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
