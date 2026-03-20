'use client';

import { AdminOrderGroup } from '@/types/order/order';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SubOrderCard } from './sub-order-card';
import { OrderInfoCard } from './order-info-card';

interface OrderDetailViewProps {
    order: AdminOrderGroup;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Heading
                        title={`Order ${order.groupNumber}`}
                        description={`Placed on ${new Date(order.createdAt).toLocaleDateString()}`}
                    />
                </div>
                <div className="flex gap-2">
                    {/* Global Actions like Cancel Order could go here */}
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-lg font-medium">Sub-Orders (By Seller)</h3>
                    {order.subOrders.map((subOrder) => (
                        <SubOrderCard
                            key={subOrder.id}
                            subOrder={subOrder}
                            groupId={order.id}
                        />
                    ))}
                </div>

                <div className="space-y-6">
                    <OrderInfoCard order={order} />
                </div>
            </div>
        </div>
    );
};
