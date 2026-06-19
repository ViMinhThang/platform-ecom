"use client";

import { useState, useEffect } from "react";
import { OrderGroupDTO, OrderGroupStatus, PaymentStatus } from "@/types/order.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getOrderStatusLabel } from "@/lib/utils/order-labels";

interface OrderCardProps {
    order: OrderGroupDTO;
}

function getStatusColor(status: OrderGroupStatus) {
    switch (status) {
        case OrderGroupStatus.COMPLETED: return "bg-green-500/10 text-green-700 border-green-500/20";
        case OrderGroupStatus.PROCESSING: return "bg-blue-500/10 text-blue-700 border-blue-500/20";
        case OrderGroupStatus.CANCELLED: return "bg-red-500/10 text-red-700 border-red-500/20";
        default: return "bg-zinc-500/10 text-zinc-700 border-zinc-500/20";
    }
}

export function OrderCard({ order }: OrderCardProps) {
    const [orderDate, setOrderDate] = useState("");
    useEffect(() => {
        setOrderDate(format(new Date(order.createdAt), "dd/MM/yyyy", { locale: vi }));
    }, [order.createdAt]);

    // Get first few items for preview
    const previewItems = order.subOrders
        .flatMap(so => so.items)
        .slice(0, 3);

    return (
        <Card className="overflow-hidden shadow-md border-none bg-white">
            <div className="bg-emerald-50/30 px-6 py-4 border-b flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-6 text-sm">
                    <div>
                        <p className="text-muted-foreground mb-1">Ngày đặt hàng</p>
                        <p className="font-medium">{orderDate}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Tổng cộng</p>
                        <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Mã đơn hàng</p>
                        <p className="font-medium">{order.groupNumber}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getStatusColor(order.overallStatus)}>
                        {getOrderStatusLabel(order.overallStatus)}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                            Xem chi tiết
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="p-6 flex gap-6 items-center">
                <div className="flex gap-x-3 overflow-hidden">
                    {previewItems.map((item) => (
                        <div key={item.id} className="relative size-16 rounded-md border bg-white ring-2 ring-white">
                            {/* Note: In a real app, we'd need item images. Assuming item has imageUrl or we fetch it */}
                            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-xs text-muted-foreground">
                                Ảnh
                            </div>
                        </div>
                    ))}
                    {order.subOrders.flatMap(so => so.items).length > 3 && (
                        <div className="relative size-16 rounded-md border bg-zinc-100 ring-2 ring-white flex items-center justify-center text-xs font-medium text-muted-foreground">
                            +{order.subOrders.flatMap(so => so.items).length - 3}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                        {order.subOrders.length} kiện hàng từ {order.subOrders.map(so => so.sellerName).join(", ")}
                    </p>
                </div>
            </div>
        </Card>
    );
}
