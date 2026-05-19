'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetOrdersQuery } from '@/lib/store/api/clientApi';
import { OrderGroupDTO, SubOrderStatus } from '@/types/order.types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ChevronRight, Truck, ShoppingBag } from 'lucide-react';
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
    { value: 'all', label: 'TẤT CẢ' },
    { value: 'to_ship', label: 'CHỜ GIAO HÀNG' },
    { value: 'shipping', label: 'ĐANG GIAO' },
    { value: 'to_receive', label: 'CHỜ NHẬN HÀNG' },
    { value: 'completed', label: 'HOÀN THÀNH' },
    { value: 'cancelled', label: 'ĐÃ HỦY' },
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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-labels italic text-foreground/40 animate-pulse">Đang truy xuất danh sách đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-labels antialiased pb-40">
            {/* STICKY HEADER BRIDGE */}
            <div className="border-b border-foreground/5 bg-white/80 backdrop-blur-md sticky top-[72px] z-30 transition-all">
                <div className="container max-w-[1600px] mx-auto px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                        <Link href="/" className="hover:text-primary transition-colors">TRANG CHỦ</Link>
                        <span>/</span>
                        <span className="text-foreground">ĐƠN HÀNG CỦA BẠN</span>
                    </div>
                </div>
            </div>

            <div className="container max-w-[1600px] mx-auto px-12 py-20">
                <div className="mb-20 space-y-6">
                    <h1 className="font-labels font-bold text-6xl uppercase tracking-tighter text-foreground">
                        Đơn hàng của bạn
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">Quản lý lịch sử giao dịch</span>
                        <div className="h-px bg-foreground/10 flex-1" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">{orders.length} HÓA ĐƠN</span>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-12">
                    <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-transparent border-b border-foreground/10 h-auto p-0 gap-12 scrollbar-hide rounded-none">
                        {ORDER_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="shrink-0 h-14 px-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-[11px] font-bold uppercase tracking-widest transition-all hover:text-primary border-transparent border-b-2"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white p-32 text-center rounded-[4px] border border-foreground/5 shadow-sm">
                        <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
                            <Package className="h-10 w-10 text-primary opacity-30" />
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-widest text-foreground font-labels">Không tìm thấy đơn hàng</h3>
                        <p className="text-[10px] text-foreground/40 mt-4 font-bold uppercase tracking-widest font-labels">
                            Hiện không có dữ liệu cho trạng thái này trong hồ sơ của bạn.
                        </p>
                        <Button asChild className="mt-12 px-12 h-14 text-[10px] font-bold uppercase tracking-widest rounded-sm bg-primary hover:opacity-90 transition-all font-labels">
                            <Link href="/products">Tiếp tục mua sắm</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
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
        <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
            <OrdersPageContent />
        </Suspense>
    );
}

function OrderCard({ order, onReview, refreshTrigger }: { order: OrderGroupDTO, onReview: (productId: number, orderId: number) => void, refreshTrigger?: number }) {
    return (
        <div className="bg-white overflow-hidden border border-foreground/10 rounded-[4px] shadow-sm transition-all hover:border-foreground/20">
            {order.subOrders.map((subOrder) => (
                <div key={subOrder.id} className="border-b border-foreground/5 last:border-b-0">
                    <div className="px-8 py-6 flex items-center justify-between border-b border-foreground/5 bg-secondary/5">
                        <div className="flex items-center gap-6">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground font-labels">{subOrder.sellerName}</span>
                            <div className="px-4 py-1.5 bg-primary/5 text-primary border border-primary/10 text-[9px] font-bold uppercase tracking-widest rounded-[2px] font-labels">
                                {subOrder.status.replace(/_/g, ' ')}
                            </div>
                        </div>
                        {subOrder.ghnOrderCode && (
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/30 font-labels">
                                <Truck className="h-4 w-4" />
                                <span>MÃ VẬN ĐƠN: {subOrder.ghnOrderCode}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-8 space-y-10">
                        {subOrder.items.map((item) => (
                            <div key={item.id} className="flex gap-10 items-center">
                                <div className="h-24 w-24 bg-secondary/5 rounded-sm border border-foreground/5 overflow-hidden flex-shrink-0 relative group">
                                    {item.imageUrl ? (
                                        <Image
                                            src={imageUrl.product(item.imageUrl)}
                                            alt={item.productName}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-foreground/20">
                                            <Package className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <p className="font-bold text-base uppercase tracking-tight text-foreground font-labels">{item.productName}</p>
                                    <div className="flex items-center gap-4">
                                        {item.variantName && (
                                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest font-labels">{item.variantName}</p>
                                        )}
                                        <div className="h-4 w-px bg-foreground/10" />
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-labels">SỐ LƯỢNG: <span className="text-foreground">{item.quantity}</span></p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-6">
                                    <p className="font-bold text-xl tracking-tighter text-foreground font-labels">{formatCurrency(item.totalPrice)}</p>
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

                    <div className="px-8 py-6 border-t border-foreground/5 bg-secondary/3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 font-labels">
                            HÓA ĐƠN: {format(new Date(order.createdAt), 'dd.MM.yyyy')}
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-16">
                            <div className="text-right">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mr-4 font-labels">TỔNG THANH TOÁN</span>
                                <span className="font-bold text-3xl tracking-tighter text-primary font-labels">{formatCurrency(subOrder.total)}</span>
                            </div>
                            <Button variant="outline" size="sm" asChild className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest border-foreground/10 shadow-sm hover:bg-foreground hover:text-white transition-all rounded-sm font-labels">
                                <Link href={`/orders/${order.id}?subOrder=${subOrder.id}`}>
                                    XEM CHI TIẾT
                                    <ChevronRight className="h-4 w-4 ml-3" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
