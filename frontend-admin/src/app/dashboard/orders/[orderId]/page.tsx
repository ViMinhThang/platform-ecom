'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchOrderDetails } from '@/lib/store/slices/orderSlice';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { OrderDetailView } from '../../../../features/orders/components/order-detail/order-detail-view';
import PageContainer from '@/components/layout/page-container';

export default function OrderDetailPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { currentOrder, loading } = useAppSelector((state) => state.orders);
    const orderId = Number(params.orderId);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetails(orderId));
        }
    }, [dispatch, orderId]);


    if (loading && !currentOrder) {
        return <div className="p-8 text-center">Loading order details...</div>;
    }

    if (!currentOrder && !loading) {
        return <div className="p-8 text-center">Order not found</div>;
    }

    return (
        <PageContainer scrollable>
            <div className="space-y-4">
                <Breadcrumbs />
                {currentOrder && <OrderDetailView order={currentOrder} />}
            </div>
        </PageContainer>
    );
}
