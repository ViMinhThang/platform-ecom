"use client";

import React from "react";
import { SubOrderDTO, SubOrderStatus } from "@/types/order.types";
import { Card } from "@/components/ui/card";
import { Package, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { ReviewAction } from "./ReviewAction";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Image from "next/image";
import { imageUrl } from "@/lib/utils/imageUrl";

interface SubOrderCardProps {
    subOrder: SubOrderDTO;
    orderId: number;
    onReview?: (productId: number, orderId: number) => void;
}

function getStatusIcon(status: SubOrderStatus) {
    switch (status) {
        case SubOrderStatus.DELIVERED: return <CheckCircle className="size-5 text-primary" />;
        case SubOrderStatus.SHIPPED: return <Truck className="size-5 text-blue-500" />;
        case SubOrderStatus.CANCELLED: return <AlertCircle className="size-5 text-red-500" />;
        default: return <Package className="size-5 text-muted-foreground opacity-50" />;
    }
}

export function SubOrderCard({ subOrder, orderId, onReview }: SubOrderCardProps) {
    return (
        <Card className="overflow-hidden mb-8 border border-border shadow-md rounded-sm bg-background transition-all hover:shadow-lg">
            <div className="bg-muted/10 px-6 py-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-background p-2 rounded-sm shadow-sm border border-border">
                        {getStatusIcon(subOrder.status)}
                    </div>
                    <div>
                        <p className="font-bold text-[11px] uppercase tracking-widest text-foreground">Gói hàng từ {subOrder.sellerName}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            Trạng thái: <span className="text-primary">{subOrder.status.replace(/_/g, " ")}</span>
                        </p>
                    </div>
                </div>

                {subOrder.ghnOrderCode && (
                    <div className="text-right">
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50 mb-1.5">MÃ VẬN ĐƠN (GHN)</p>
                        <p className="font-bold text-[11px] tracking-widest text-foreground uppercase">{subOrder.ghnOrderCode}</p>
                    </div>
                )}
            </div>

            <div className="p-8">
                <div className="space-y-8">
                    {subOrder.items.map((item) => (
                        <div key={item.id} className="flex gap-6 group">
                            <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-sm border border-border bg-muted/30 shadow-inner group-hover:shadow-md transition-shadow p-2">
                                <Image src={imageUrl.product(item.imageUrl)} alt={item.productName} fill className="object-contain" unoptimized />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="font-semibold text-sm uppercase tracking-widest text-foreground">{item.productName}</h4>
                                {item.variantName && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">{item.variantName}</p>}
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Số lượng: <span className="text-foreground">{item.quantity}</span></span>
                                    <div className="text-right flex flex-col items-end gap-3">
                                        <span className="font-bold text-base tracking-tighter text-foreground">{formatCurrency(item.totalPrice)}</span>
                                        
                                        {onReview && (
                                            <ReviewAction 
                                                productId={item.productId}
                                                orderId={orderId}
                                                status={subOrder.status}
                                                onReview={onReview}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
