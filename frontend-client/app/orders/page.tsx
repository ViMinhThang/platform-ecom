'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchOrders } from '@/lib/store/slices/orderSlice';
import { OrderGroupDTO, SubOrderStatus } from '@/types/order.types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ChevronRight, Truck, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { imageUrl } from '@/lib/utils/imageUrl';

type OrderTab = 'all' | 'to_ship' | 'shipping' | 'to_receive' | 'completed' | 'cancelled';

const ORDER_TABS: { value: OrderTab; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'to_ship', label: 'To Ship' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'to_receive', label: 'To Receive' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

// Map tab to SubOrderStatus values
const TAB_STATUS_MAP: Record<OrderTab, SubOrderStatus[]> = {
    all: [],
    to_ship: [SubOrderStatus.PENDING, SubOrderStatus.PROCESSING, SubOrderStatus.READY_TO_PICK],
    shipping: [SubOrderStatus.PICKING, SubOrderStatus.PICKED, SubOrderStatus.STORING, SubOrderStatus.TRANSPORTING, SubOrderStatus.SORTING],
    to_receive: [SubOrderStatus.DELIVERING, SubOrderStatus.SHIPPED],
    completed: [SubOrderStatus.DELIVERED],
    cancelled: [SubOrderStatus.CANCELLED, SubOrderStatus.RETURNING, SubOrderStatus.RETURNED, SubOrderStatus.REFUNDED],
};

export default function OrdersPage() {
    const dispatch = useAppDispatch();
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { orders, loading, page, totalPages } = useAppSelector((state) => state.orders);
    const [activeTab, setActiveTab] = useState<OrderTab>((searchParams.get('tab') as OrderTab) || 'all');

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/auth/sign-in');
        }
    }, [authStatus, router]);

    useEffect(() => {
        if (session?.accessToken) {
            dispatch(fetchOrders({ page: 0, size: 20 }));
        }
    }, [dispatch, session]);

    // Filter orders by tab
    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'all') return true;
        const targetStatuses = TAB_STATUS_MAP[activeTab];
        return order.subOrders.some((subOrder) => targetStatuses.includes(subOrder.status));
    });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab as OrderTab);
        router.push(`/orders?tab=${tab}`, { scroll: false });
    };

    if (authStatus === 'loading' || (loading && orders.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto py-6 px-4 max-w-5xl">
                <h1 className="text-2xl font-bold mb-6">My Orders</h1>

                {/* Status Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
                    <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-background border">
                        {ORDER_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No orders found</h3>
                            <p className="text-muted-foreground mt-1">
                                {activeTab === 'all'
                                    ? "You haven't placed any orders yet."
                                    : `No orders in "${ORDER_TABS.find(t => t.value === activeTab)?.label}" status.`
                                }
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderCard({ order }: { order: OrderGroupDTO }) {
    const getStatusColor = (status: SubOrderStatus) => {
        switch (status) {
            case SubOrderStatus.DELIVERED:
                return 'bg-green-100 text-green-800 border-green-200';
            case SubOrderStatus.DELIVERING:
            case SubOrderStatus.TRANSPORTING:
            case SubOrderStatus.SHIPPED:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case SubOrderStatus.CANCELLED:
            case SubOrderStatus.RETURNED:
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <Card className="overflow-hidden">
            {order.subOrders.map((subOrder) => (
                <div key={subOrder.id} className="border-b last:border-b-0">
                    {/* Seller Header */}
                    <div className="bg-muted/50 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{subOrder.sellerName}</span>
                            <Badge variant="outline" className={getStatusColor(subOrder.status)}>
                                {subOrder.status.replace(/_/g, ' ')}
                            </Badge>
                        </div>
                        {subOrder.ghnOrderCode && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Truck className="h-4 w-4" />
                                <span>GHN: {subOrder.ghnOrderCode}</span>
                            </div>
                        )}
                    </div>

                    {/* Items */}
                    <div className="p-4 space-y-3">
                        {subOrder.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                    {item.imageUrl ? (
                                        <Image
                                            src={imageUrl.product(item.imageUrl)}
                                            alt={item.productName}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <Package className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.productName}</p>
                                    {item.variantName && (
                                        <p className="text-sm text-muted-foreground">{item.variantName}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t bg-muted/30 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {format(new Date(order.createdAt), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <span className="text-sm text-muted-foreground">Order Total: </span>
                                <span className="font-bold text-lg">${subOrder.total.toFixed(2)}</span>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/orders/${order.id}?subOrder=${subOrder.id}`}>
                                    View Details
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </Card>
    );
}
