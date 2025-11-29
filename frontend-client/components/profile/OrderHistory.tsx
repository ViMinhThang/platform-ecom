'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/user';
import { getUserOrders } from '@/lib/api/profile';
import { useBuyAgain } from '@/hooks/useBuyAgain';
import { OrderCard } from './OrderCard';
import { ReviewDialog } from './ReviewDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Component for displaying user order history in card layout.
 * Refactored from table to cards for better UX and direct item actions.
 */
export function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    });

    // Review dialog state
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<number | null>(null);
    const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);

    const { buyAgain } = useBuyAgain();

    const fetchOrders = async (page: number) => {
        setLoading(true);
        try {
            const data = await getUserOrders(page, pagination.pageSize);
            setOrders(data.content);
            setPagination({
                pageNumber: data.pageNumber,
                pageSize: data.pageSize,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                lastPage: data.lastPage,
            });
        } catch (error) {
            toast.error('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(0);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            fetchOrders(newPage);
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
        // Optionally refresh orders or update UI
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
