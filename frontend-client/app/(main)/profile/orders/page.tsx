"use client";

import { OrderList } from "@/components/orders/OrderList";

export default function OrderHistoryPage() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <h1 className="text-2xl font-semibold mb-6">Lịch sử đơn hàng</h1>
            <OrderList />
        </div>
    );
}
