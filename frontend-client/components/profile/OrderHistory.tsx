'use client';

import { useState } from 'react';
import { useBuyAgain } from '@/hooks/useBuyAgain';
import { OrderCard } from './OrderCard';
import { ReviewDialog } from './ReviewDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
import { useGetOrdersQuery } from '@/lib/store/api/clientApi';
import type { OrderGroupDTO } from '@/types/order.types';

export function OrderHistory() {
    const [currentPage, setCurrentPage] = useState(0);
    const { data: ordersData, isLoading } = useGetOrdersQuery({ page: currentPage, size: 10 });

    const orders = ordersData?.content || [];
    const totalPages = ordersData?.totalPages || 0;

    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<number | null>(null);
    const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);

    const { buyAgain } = useBuyAgain();

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleReviewOrderItem = (productId: number, orderId: number) => {
        setReviewProductId(productId);
        setReviewOrderId(orderId);
        setReviewDialogOpen(true);
    };

    const handleBuyAgain = async (order: any) => {
        // await buyAgain(order.orderItems);
    };

    const handleReviewSuccess = () => {
        toast.success('Thank you for your review!');
    };

    if (isLoading && orders.length === 0) {
        return <LoadingSpinner size="lg" />;
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Package className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
                <p className="text-sm mt-1 mb-4">When you place an order, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Orders Grid */}
            <div className="grid grid-cols-1 gap-6">
                {orders.map((order: OrderGroupDTO) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onReviewOrderItem={handleReviewOrderItem}
                        onBuyAgain={handleBuyAgain}
                    />
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Review Dialog */}
            {reviewProductId && reviewOrderId && (
                <ReviewDialog
                    open={reviewDialogOpen}
                    onOpenChange={setReviewDialogOpen}
                    productId={reviewProductId}
                    orderId={reviewOrderId}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
}
