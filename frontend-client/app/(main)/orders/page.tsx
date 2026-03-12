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
import { Loader2, Package, ChevronRight, Truck } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { imageUrl } from '@/lib/utils/imageUrl';
import { ReviewDialog } from '@/components/profile/ReviewDialog';
import { ReviewAction } from '@/components/orders/ReviewAction';
import { Suspense } from 'react';

type OrderTab = 'all' | 'to_ship' | 'shipping' | 'to_receive' | 'completed' | 'cancelled';

const ORDER_TABS: { value: OrderTab; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'to_ship', label: 'Chờ giao hàng' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'to_receive', label: 'Chờ nhận hàng' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
];

const TAB_STATUS_MAP: Record<OrderTab, SubOrderStatus[]> = {
    all: [],
    to_ship: [SubOrderStatus.PENDING, SubOrderStatus.PROCESSING, SubOrderStatus.READY_TO_PICK],
    shipping: [SubOrderStatus.PICKING, SubOrderStatus.PICKED, SubOrderStatus.STORING, SubOrderStatus.TRANSPORTING, SubOrderStatus.SORTING],
    to_receive: [SubOrderStatus.DELIVERING, SubOrderStatus.SHIPPED],
    completed: [SubOrderStatus.DELIVERED],
    cancelled: [SubOrderStatus.CANCELLED, SubOrderStatus.RETURNING, SubOrderStatus.RETURNED, SubOrderStatus.REFUNDED],
};

function OrdersPageContent() {
    const dispatch = useAppDispatch();
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { orders, loading } = useAppSelector((state) => state.orders);
    const [activeTab, setActiveTab] = useState<OrderTab>((searchParams.get('tab') as OrderTab) || 'all');

    // Review states
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<number | null>(null);
    const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const handleReviewOrderItem = (productId: number, orderId: number) => {
        setReviewProductId(productId);
        setReviewOrderId(orderId);
        setReviewDialogOpen(true);
    };

    const handleReviewSuccess = () => {
        setRefreshCounter(prev => prev + 1);
    };

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

                <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-3">
                    <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-white dark:bg-zinc-950 border-b rounded-none h-auto p-0 px-4 gap-10 scrollbar-hide shadow-sm sticky top-16 z-10">
                        {ORDER_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex-shrink-0 h-16 px-0 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-transparent shadow-none"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {filteredOrders.length === 0 ? (
                    <Card className="border-2 border-dashed bg-zinc-50/50">
                        <CardContent className="py-20 text-center">
                            <Package className="h-16 w-16 mx-auto text-zinc-300 mb-6" />
                            <h3 className="text-xl font-black uppercase tracking-tight">Không tìm thấy đơn hàng</h3>
                            <p className="text-muted-foreground mt-2 text-sm font-medium uppercase tracking-tight">
                                {activeTab === 'all'
                                    ? "Bạn chưa thực hiện bất kỳ đơn hàng nào."
                                    : `Không có đơn hàng nào ở trạng thái "${{
                                        all: 'Tất cả',
                                        to_ship: 'Chờ giao hàng',
                                        shipping: 'Đang giao',
                                        to_receive: 'Chờ nhận hàng',
                                        completed: 'Đã hoàn thành',
                                        cancelled: 'Đã hủy'
                                    }[activeTab]}".`
                                }
                            </p>
                            <Button asChild className="mt-8 px-10 h-12 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Link href="/products">Bắt đầu mua sắm</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <OrderCard key={`${order.id}-${refreshCounter}`} order={order} onReview={handleReviewOrderItem} refreshTrigger={refreshCounter} />
                        ))}
                    </div>
                )}
                
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
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrdersPageContent />
        </Suspense>
    );
}

function OrderCard({ order, onReview, refreshTrigger }: { order: OrderGroupDTO, onReview: (productId: number, orderId: number) => void, refreshTrigger?: number }) {
    const getStatusColor = (status: SubOrderStatus) => {
        switch (status) {
            case SubOrderStatus.DELIVERED: return 'bg-green-100 text-green-800 border-green-200';
            case SubOrderStatus.DELIVERING:
            case SubOrderStatus.TRANSPORTING:
            case SubOrderStatus.SHIPPED: return 'bg-blue-100 text-blue-800 border-blue-200';
            case SubOrderStatus.CANCELLED:
            case SubOrderStatus.RETURNED: return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <Card className="overflow-hidden">
            {order.subOrders.map((subOrder) => (
                <div key={subOrder.id} className="border-b last:border-b-0">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 flex items-center justify-between border-b">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black uppercase tracking-wider">{subOrder.sellerName}</span>
                            <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0 h-5 ${getStatusColor(subOrder.status)}`}>
                                {subOrder.status.replace(/_/g, ' ')}
                            </Badge>
                        </div>
                        {subOrder.ghnOrderCode && (
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                <Truck className="h-3 w-3" />
                                <span>GHN: {subOrder.ghnOrderCode}</span>
                            </div>
                        )}
                    </div>

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
                                <div className="text-right flex flex-col items-end gap-2 justify-center">
                                    <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                                    <ReviewAction 
                                        productId={item.productId}
                                        orderId={order.id}
                                        status={subOrder.status}
                                        onReview={onReview}
                                        refreshTrigger={refreshTrigger}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-4 py-4 border-t bg-zinc-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Tổng tiền: </span>
                                <span className="font-black text-xl tracking-tighter text-primary">${subOrder.total.toFixed(2)}</span>
                            </div>
                            <Button variant="outline" size="sm" asChild className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-2">
                                <Link href={`/orders/${order.id}?subOrder=${subOrder.id}`}>
                                    Chi tiết
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </Card>
    );
}
