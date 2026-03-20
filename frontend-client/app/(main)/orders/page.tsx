'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetOrdersQuery } from '@/lib/store/api/clientApi';
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
import { formatCurrency } from '@/lib/utils/formatCurrency';
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
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: ordersData, isLoading: loading } = useGetOrdersQuery({ page: 0, size: 20 });
    const orders = ordersData?.content || [];
    const [activeTab, setActiveTab] = useState<OrderTab>((searchParams.get('tab') as OrderTab) || 'all');

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
        <div className="min-h-screen bg-background font-header">
            <div className="container mx-auto py-12 px-4 max-w-5xl">
                <h1 className="text-3xl font-bold mb-12 uppercase tracking-widest text-foreground border-b border-border pb-8">
                    Đơn hàng <span className="text-primary italic">của tôi</span>
                </h1>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
                    <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-background border border-border rounded-sm h-auto p-1 gap-2 scrollbar-hide shadow-md">
                        {ORDER_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex-shrink-0 h-10 px-6 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-muted/50"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {filteredOrders.length === 0 ? (
                    <Card className="border border-dashed border-border bg-muted/5 rounded-sm shadow-sm overflow-hidden">
                        <CardContent className="py-24 text-center">
                            <div className="bg-primary/5 w-24 h-24 rounded-sm flex items-center justify-center mx-auto mb-8 border border-primary/10">
                                <Package className="h-10 w-10 text-primary opacity-40" />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-widest text-foreground">Không tìm thấy đơn hàng</h3>
                            <p className="text-[10px] text-muted-foreground mt-3 font-bold uppercase tracking-widest opacity-60">
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
                            <Button asChild className="mt-12 px-10 h-12 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg shadow-primary/10">
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
    const getStatusStyles = (status: SubOrderStatus) => {
        switch (status) {
            case SubOrderStatus.DELIVERED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case SubOrderStatus.DELIVERING:
            case SubOrderStatus.TRANSPORTING:
            case SubOrderStatus.SHIPPED: return 'bg-blue-50 text-blue-600 border-blue-100';
            case SubOrderStatus.CANCELLED:
            case SubOrderStatus.RETURNED: return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-primary/5 text-primary border-primary/10';
        }
    };

    return (
        <Card className="overflow-hidden shadow-md border border-border rounded-sm bg-background transition-all hover:shadow-lg mb-6">
            {order.subOrders.map((subOrder) => (
                <div key={subOrder.id} className="border-b border-border last:border-b-0">
                    <div className="bg-muted/10 px-6 py-4 flex items-center justify-between border-b border-border">
                        <div className="flex items-center gap-4">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">{subOrder.sellerName}</span>
                            <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm border ${getStatusStyles(subOrder.status)}`}>
                                {subOrder.status.replace(/_/g, ' ')}
                            </Badge>
                        </div>
                        {subOrder.ghnOrderCode && (
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                                <Truck className="h-3.5 w-3.5" />
                                <span>Vận chuyển: {subOrder.ghnOrderCode}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-6">
                        {subOrder.items.map((item) => (
                            <div key={item.id} className="flex gap-6 group">
                                <div className="h-20 w-20 bg-muted/30 rounded-sm border border-border overflow-hidden flex-shrink-0 shadow-inner group-hover:shadow-md transition-shadow">
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
                                            <Package className="h-6 w-6 opacity-30" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="font-bold text-sm uppercase tracking-widest text-foreground truncate">{item.productName}</p>
                                    {item.variantName && (
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">{item.variantName}</p>
                                    )}
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Số lượng: <span className="text-foreground">{item.quantity}</span></p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-3 justify-center">
                                    <p className="font-bold text-base tracking-tighter text-foreground">{formatCurrency(item.totalPrice)}</p>
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

                    <div className="px-6 py-5 border-t border-border bg-muted/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                            Hóa đơn ngày {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-12">
                            <div className="text-right">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-3 opacity-50">Tổng thanh toán: </span>
                                <span className="font-bold text-2xl tracking-tighter text-primary">{formatCurrency(subOrder.total)}</span>
                            </div>
                            <Button variant="outline" size="sm" asChild className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest border-border shadow-sm hover:bg-muted/30 rounded-sm">
                                <Link href={`/orders/${order.id}?subOrder=${subOrder.id}`}>
                                    Chi tiết
                                    <ChevronRight className="h-3.5 w-3.5 ml-2 text-primary" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </Card>
    );
}
