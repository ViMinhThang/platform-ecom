"use client";

import React, { useEffect, useState } from "react";
import { ReviewDialog } from "@/components/profile/ReviewDialog";
import { useOrders } from "@/hooks/useOrders";
import { SubOrderCard } from "@/components/orders/SubOrderCard";
import { TrackingTimeline } from "@/components/orders/TrackingTimeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Truck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { currentOrder, loading, loadOrderDetails } = useOrders();
    const { id } = React.use(params);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<number | null>(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const handleReviewOrderItem = (productId: number) => {
        setReviewProductId(productId);
        setReviewDialogOpen(true);
    };

    const handleReviewSuccess = () => {
        setRefreshCounter(prev => prev + 1);
    };

    useEffect(() => {
        if (id) {
            loadOrderDetails(Number(id));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!currentOrder && !loading) {
        return <div className="container py-12 text-center">Order not found</div>;
    }

    if (!currentOrder) return null;

    return (
        <div className="container mx-auto py-12 px-4 md:px-8 font-header bg-background">
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent group">
                    <Link href="/orders" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Quay lại danh sách
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 border-b border-border pb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-6 text-foreground uppercase tracking-tighter">
                        Đơn hàng <span className="text-primary italic">#{currentOrder.groupNumber}</span>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-sm border-primary/20 bg-primary/5 text-primary">
                            {currentOrder.overallStatus.replace(/_/g, " ")}
                        </Badge>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-3 opacity-60">
                        Đặt ngày {format(new Date(currentOrder.createdAt), "MMMM d, yyyy 'lúc' h:mm a")}
                    </p>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 shadow-sm px-4 py-1 bg-muted/5 rounded-sm border border-border inline-block">Tổng thanh toán</p>
                    <p className="text-4xl font-bold tracking-tighter text-primary mt-2">{formatCurrency(currentOrder.totalAmount)}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {currentOrder.subOrders.some(so => so.ghnOrderCode) && (
                        <Card className="border border-border shadow-md rounded-sm overflow-hidden bg-background mb-8">
                            <CardHeader className="bg-muted/10 border-b border-border py-4">
                                <CardTitle className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-foreground font-header">
                                    <Truck className="h-4 w-4 text-primary" />
                                    Theo dõi vận chuyển
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <TrackingTimeline
                                    ghnOrderCode={currentOrder.subOrders.find(so => so.ghnOrderCode)?.ghnOrderCode || ''}
                                />
                            </CardContent>
                        </Card>
                    )}

                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-muted-foreground">
                            <div className="h-px bg-border flex-1" />
                            Danh sách kiện hàng
                            <div className="h-px bg-border flex-1" />
                        </h2>
                        {currentOrder.subOrders.map((subOrder) => (
                            <SubOrderCard 
                                key={`${subOrder.id}-${refreshCounter}`} 
                                subOrder={subOrder} 
                                orderId={currentOrder.id} 
                                onReview={handleReviewOrderItem} 
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar - Order Info */}
                <div className="space-y-8">
                    <div className="bg-background p-8 rounded-sm border border-border shadow-md space-y-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-border pb-4">Thông tin thanh toán</h3>
                        <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Phương thức</span>
                                <span className="text-foreground">Thẻ tín dụng</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Trạng thái</span>
                                <Badge variant={currentOrder.paymentStatus === 'SUCCEEDED' ? 'default' : 'secondary'} className="text-[8px] font-bold uppercase tracking-widest rounded-sm border-none bg-primary/10 text-primary">
                                    {currentOrder.paymentStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background p-8 rounded-sm border border-border shadow-md space-y-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-border pb-4">Địa chỉ giao hàng</h3>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-loose">
                            <p className="text-foreground mb-4">Mã địa chỉ: {currentOrder.shippingAddressId}</p>
                            <p>123 Đường Chính</p>
                            <p>Quận 1, TP. Hồ Chí Minh</p>
                            <p>Việt Nam</p>
                        </div>
                    </div>

                    <div className="bg-background p-8 rounded-sm border border-border shadow-lg space-y-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-border pb-4">Tóm tắt đơn hàng</h3>
                        <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Tạm tính</span>
                                <span className="text-foreground">{formatCurrency(currentOrder.totalAmount - (currentOrder.taxAmount || 0) - currentOrder.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Phí vận chuyển</span>
                                <span className="text-foreground">{formatCurrency(currentOrder.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Thuế</span>
                                <span className="text-foreground">{formatCurrency(currentOrder.taxAmount || 0)}</span>
                            </div>
                            <div className="border-t border-border border-dashed pt-4 mt-6 flex justify-between items-center">
                                <span className="text-xs text-foreground">Tổng cộng</span>
                                <span className="text-xl text-primary font-bold tracking-tighter">{formatCurrency(currentOrder.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Dialog */}
            {reviewProductId && currentOrder && (
                <ReviewDialog
                    open={reviewDialogOpen}
                    onOpenChange={setReviewDialogOpen}
                    productId={reviewProductId}
                    orderId={currentOrder.id}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
}
