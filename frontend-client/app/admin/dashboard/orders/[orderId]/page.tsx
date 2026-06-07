'use client';

import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { useGetOrderDetailsQuery } from '@/lib/store/admin';
import { useParams } from 'next/navigation';
import { OrderDetailView } from '@/components/admin/orders/order-detail/order-detail-view';
import PageContainer from '@/components/admin/layout/page-container';

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = Number(params.orderId);

    const { data: currentOrder, isLoading } = useGetOrderDetailsQuery(orderId);

    if (isLoading) {
        return <div className="p-8 text-center">Đang tải chi tiết đơn hàng…</div>;
    }

    if (!currentOrder) {
        return <div className="p-8 text-center">Không tìm thấy đơn hàng</div>;
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
