'use client';

import { AdminSubOrder } from '@/types/order/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { getOrderStatusLabel } from '@/lib/utils/order-labels';
import { UpdateStatusDialog } from './update-status-dialog';
import { Package, Truck } from 'lucide-react';

interface SubOrderCardProps {
    subOrder: AdminSubOrder;
    groupId: number;
}

export const SubOrderCard: React.FC<SubOrderCardProps> = ({ subOrder, groupId }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-y-0 pb-2">
                <div className="flex flex-col gap-y-1">
                    <CardTitle className="text-base font-medium">
                        Bán bởi: {subOrder.sellerName}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                        Đơn hàng #{subOrder.subOrderNumber}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline">{getOrderStatusLabel(subOrder.status)}</Badge>
                    <UpdateStatusDialog
                        groupId={groupId}
                        subOrderId={subOrder.id}
                        currentStatus={subOrder.status}
                    />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium flex items-center gap-2">
                            <Package className="size-4" /> Sản phẩm
                        </div>
                        <div className="border rounded-md divide-y">
                            {subOrder.items.map((item) => (
                                <div key={item.id} className="p-3 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{item.productName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {item.variantName} x {item.quantity}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {formatCurrency(item.totalPrice)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Tracking Info */}
                    {subOrder.trackingNumber && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium flex items-center gap-2">
                                <Truck className="size-4" /> Thông tin theo dõi
                            </div>
                            <div className="bg-muted/50 p-3 rounded-md text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nhà vận chuyển:</span>
                                    <span>{subOrder.carrier || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mã theo dõi:</span>
                                    <span>{subOrder.trackingNumber}</span>
                                </div>
                                {subOrder.trackingUrl && (
                                    <div className="pt-1">
                                        <a
                                            href={subOrder.trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Theo dõi đơn hàng
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Sub-Order Totals */}
                    <div className="flex justify-end pt-2">
                        <div className="w-full max-w-xs space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tạm tính</span>
                                <span>{formatCurrency(subOrder.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Phí vận chuyển</span>
                                <span>{formatCurrency(subOrder.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Thuế</span>
                                <span>{formatCurrency(subOrder.tax)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-medium">
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(subOrder.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
