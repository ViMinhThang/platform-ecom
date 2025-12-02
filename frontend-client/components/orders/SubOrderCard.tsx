"use client";

import { SubOrderDTO, SubOrderStatus } from "@/types/order.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface SubOrderCardProps {
    subOrder: SubOrderDTO;
}

export function SubOrderCard({ subOrder }: SubOrderCardProps) {
    const getStatusIcon = (status: SubOrderStatus) => {
        switch (status) {
            case SubOrderStatus.DELIVERED: return <CheckCircle className="h-5 w-5 text-green-600" />;
            case SubOrderStatus.SHIPPED: return <Truck className="h-5 w-5 text-blue-600" />;
            case SubOrderStatus.CANCELLED: return <AlertCircle className="h-5 w-5 text-red-600" />;
            default: return <Package className="h-5 w-5 text-zinc-600" />;
        }
    };

    return (
        <Card className="overflow-hidden mb-6">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-6 py-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {getStatusIcon(subOrder.status)}
                    <div>
                        <p className="font-semibold text-sm">Package from {subOrder.sellerName}</p>
                        <p className="text-xs text-muted-foreground">
                            Status: <span className="font-medium text-foreground">{subOrder.status.replace(/_/g, " ")}</span>
                        </p>
                    </div>
                </div>

                {subOrder.trackingNumber && (
                    <div className="text-right text-sm">
                        <p className="text-muted-foreground">Tracking Number</p>
                        <p className="font-medium font-mono">{subOrder.trackingNumber}</p>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {subOrder.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-zinc-100">
                                {/* Placeholder image */}
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Img</div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.productName}</h4>
                                {item.variantName && <p className="text-xs text-muted-foreground">{item.variantName}</p>}
                                <div className="flex justify-between mt-2 text-sm">
                                    <span className="text-muted-foreground">Qty: {item.quantity}</span>
                                    <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                    <div className="space-x-2">
                        {subOrder.status === SubOrderStatus.DELIVERED && (
                            <Button variant="outline" size="sm">Request Refund</Button>
                        )}
                        {subOrder.status === SubOrderStatus.PENDING && (
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Cancel Item
                            </Button>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-muted-foreground mr-2">Subtotal:</span>
                        <span className="font-bold">${subOrder.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
