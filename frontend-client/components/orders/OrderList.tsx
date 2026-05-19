"use client";

import { useEffect } from "react";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "./OrderCard";
import { Loader2 } from "lucide-react";

export function OrderList() {
    const { orders, loading, loadOrders } = useOrders();

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-zinc-50">
                <h3 className="text-lg font-medium">No orders yet</h3>
                <p className="text-muted-foreground mt-1">When you place an order, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}
