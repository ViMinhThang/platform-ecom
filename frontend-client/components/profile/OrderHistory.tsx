'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Order } from '@/types/user';
import { useBuyAgain } from '@/hooks/useBuyAgain';
import { OrderCard } from './OrderCard';
import { ReviewDialog } from './ReviewDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchUserOrders } from '@/lib/store/slices/orderSlice';

/**
 * Component for displaying user order history in card layout.
 * Refactored to use Redux with NextAuth session token.
 */
export function OrderHistory() {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const { orders, pagination, loading } = useAppSelector((state) => state.orders);

    // Review dialog state
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<number | null>(null);
    const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);

    const { buyAgain } = useBuyAgain();

    // Initial fetch
    useEffect(() => {
        if (session?.accessToken && orders.length === 0 && !loading) {
            dispatch(fetchUserOrders({ token: session.accessToken as string }));
        }
    }, [dispatch, session, orders.length, loading]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < pagination.totalPages && session?.accessToken) {
            dispatch(fetchUserOrders({
                token: session.accessToken as string,
                pageNumber: newPage,
                pageSize: pagination.pageSize
            }));
        }
    };

    const handleReviewOrderItem = (productId: number, orderId: number) => {
        setReviewProductId(productId);
        setReviewOrderId(orderId);
        setReviewDialogOpen(true);
    };

    const handleBuyAgain = async (order: Order) => {
        await buyAgain(order.orderItems);
    };

    const handleReviewSuccess = () => {
        toast.success('Thank you for your review!');
    };

    if (loading && orders.length === 0) {
        return <LoadingSpinner size="lg" />;
    }

    if (orders.length === 0) {
        return (
            <EmptyState
                icon={<Package className="h-12 w-12" />}
                title="No orders found"
                description="Your order history will appear here."
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Orders Grid */}
            <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                    <OrderCard
                        key={order.orderId}
                        order={order}
                        onReviewOrderItem={handleReviewOrderItem}
                        onBuyAgain={handleBuyAgain}
                    />
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={pagination.pageNumber}
                totalPages={pagination.totalPages}
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
