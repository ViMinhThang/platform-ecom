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
import { fetchOrders } from '@/lib/store/slices/orderSlice';

/**
 * Component for displaying user order history in card layout.
 * Refactored to use Redux with NextAuth session token.
 */
export function OrderHistory() {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    // Destructure correctly from OrderState
    const { orders, page, totalPages, loading } = useAppSelector((state) => state.orders);

    // Review dialog state
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<number | null>(null);
    const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);

    const { buyAgain } = useBuyAgain();

    // Initial fetch
    useEffect(() => {
        if (session?.accessToken && orders.length === 0 && !loading) {
            dispatch(fetchOrders({ page: 0, size: 10 }));
        }
    }, [dispatch, session, orders.length, loading]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages && session?.accessToken) {
            dispatch(fetchOrders({
                page: newPage,
                size: 10
            }));
        }
    };

    const handleReviewOrderItem = (productId: number, orderId: number) => {
        setReviewProductId(productId);
        setReviewOrderId(orderId);
        setReviewDialogOpen(true);
    };

    const handleBuyAgain = async (order: any) => {
        // TODO: Fix type compatibility between OrderGroupDTO and Order
        // await buyAgain(order.orderItems);
    };

    const handleReviewSuccess = () => {
        toast.success('Thank you for your review!');
    };

    if (loading && orders.length === 0) {
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
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        // @ts-ignore - Temporary bypass for type mismatch
                        order={order}
                        onReviewOrderItem={handleReviewOrderItem}
                        // @ts-ignore
                        onBuyAgain={handleBuyAgain}
                    />
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={page}
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
