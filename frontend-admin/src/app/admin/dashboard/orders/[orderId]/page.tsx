'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { useGetOrderDetailsQuery } from '@/lib/store/api';
import { useParams } from 'next/navigation';
import { OrderDetailView } from '@/features/orders/components/order-detail/order-detail-view';
import PageContainer from '@/components/layout/page-container';

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = Number(params.orderId);

    const { data: currentOrder, isLoading } = useGetOrderDetailsQuery(orderId);

    if (isLoading) {
        return <div className="p-8 text-center">Loading order details...</div>;
    }

    if (!currentOrder) {
        return <div className="p-8 text-center">Order not found</div>;
    }

    return (
        <PageContainer scrollable>
            <div className="space-y-4 w-full">
                <Breadcrumbs />
                <OrderDetailView order={currentOrder} />
            </div>
        </PageContainer>
    );
}
