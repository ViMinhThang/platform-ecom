"use client";

import React, { useState, useEffect } from "react";
import { ReviewDialog } from "@/components/profile/ReviewDialog";
import { useOrderDetail } from "@/hooks/useOrders";
import { SubOrderCard } from "@/components/orders/SubOrderCard";
import { TrackingTimeline } from "@/components/orders/TrackingTimeline";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Truck, FileText, MapPin, ReceiptText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useGetAddressesQuery } from "@/lib/store/api/clientApi";
import { Suspense } from "react";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

function OrderDetailPageContent({ params }: OrderDetailPageProps) {
    const { id } = React.use(params);
    const orderId = Number(id);
    const { order: currentOrder, loading } = useOrderDetail(orderId);
    const { data: addresses } = useGetAddressesQuery();
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<number | null>(null);
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [createdDate, setCreatedDate] = useState("");
    useEffect(() => {
        if (currentOrder?.createdAt) {
            setCreatedDate(format(new Date(currentOrder.createdAt), "dd.MM.yyyy 'LÚC' HH:mm"));
        }
    }, [currentOrder?.createdAt]);

    const shippingAddress = addresses?.find(addr => addr.addressId === currentOrder?.shippingAddressId);

    const handleReviewOrderItem = (productId: number) => {
        setReviewProductId(productId);
        setReviewDialogOpen(true);
    };

    const handleReviewSuccess = () => {
        setRefreshCounter(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-y-8">
                <div className="size-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-labels italic text-foreground/40 animate-pulse">Đang truy xuất hồ sơ đơn hàng…</p>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-6">
                    <p className="font-labels text-xl font-bold uppercase tracking-widest text-foreground/40">Không tìm thấy hồ sơ đơn hàng</p>
                    <Button asChild variant="outline" className="font-labels">
                        <Link href="/orders">QUAY LẠI DANH SÁCH</Link>
                    </Button>
                </div>
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
                        <Link href="/orders" className="hover:text-primary transition-colors">ĐƠN HÀNG CỦA BẠN</Link>
                        <span>/</span>
                        <span className="text-foreground">CHI TIẾT HÓA ĐƠN #{currentOrder.groupNumber}</span>
                    </div>
                </div>
            </div>

            <div className="container max-w-[1600px] mx-auto px-12 py-20">
                <div className="mb-20">
                    <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent group mb-12">
                        <Link href="/orders" className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-all font-labels">
                            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                            QUAY LẠI DANH SÁCH
                        </Link>
                    </Button>

                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-foreground/10 pb-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <h1 className="font-labels text-6xl font-semibold uppercase tracking-tighter text-foreground">
                                    Hóa đơn #{currentOrder.groupNumber}
                                </h1>
                                <div className="px-6 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-[2px] font-labels">
                                    {currentOrder.overallStatus.replace(/_/g, " ")}
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.4em] font-labels">
                                KHỞI TẠO NGÀY {createdDate}
                            </p>
                        </div>
                        <div className="text-left lg:text-right space-y-4">
                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest font-labels">TỔNG GIÁ TRỊ GIAO DỊCH</p>
                            <p className="text-6xl font-bold tracking-tighter text-primary font-labels">{formatCurrency(currentOrder.totalAmount)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-8 space-y-12">
                        {/* SHIPMENT TRACKING: WHITE CARD */}
                        {currentOrder.subOrders.some(so => so.ghnOrderCode) && (
                            <section className="bg-white p-12 rounded-[4px] border border-foreground/10 shadow-sm space-y-12">
                                <div className="flex items-center gap-4 pb-8 border-b border-foreground/5">
                                    <Truck className="size-5 text-primary" />
                                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground font-labels">HÀNH TRÌNH VẬN CHUYỂN</h2>
                                </div>
                                <TrackingTimeline
                                    ghnOrderCode={currentOrder.subOrders.find(so => so.ghnOrderCode)?.ghnOrderCode || ''}
                                />
                            </section>
                        )}

                        {/* SUB-ORDERS LIST */}
                        <div className="space-y-12">
                            <div className="flex items-center gap-6">
                                <h2 className="text-[11px] font-semibold uppercase tracking-[0.4em] text-foreground/40 font-labels italic shrink-0">DANH SÁCH KIỆN HÀNG</h2>
                                <div className="h-px bg-foreground/5 flex-1" />
                            </div>
                            
                            <div className="space-y-8">
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
                    </div>

                    {/* SIDEBAR METADATA: STICKY WHITE CARDS */}
                    <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-40">
                        {/* PAYMENT INFO */}
                        <div className="bg-white p-10 rounded-[4px] border border-foreground/10 shadow-sm space-y-10">
                            <div className="flex items-center gap-4 pb-6 border-b border-foreground/5">
                                <FileText className="size-5 text-primary/40" />
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground font-labels">THANH TOÁN</h3>
                            </div>
                            <div className="space-y-6 text-[11px] font-bold uppercase tracking-widest font-labels">
                                <div className="flex justify-between items-center text-foreground/40">
                                    <span>PHƯƠNG THỨC</span>
                                    <span className="text-foreground">CHUYỂN KHOẢN</span>
                                </div>
                                <div className="flex justify-between items-center text-foreground/40">
                                    <span>TRẠNG THÁI</span>
                                    <div className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-[2px] text-[9px]">
                                        {currentOrder.paymentStatus}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SHIPPING LOCATION */}
                        <div className="bg-white p-10 rounded-[4px] border border-foreground/10 shadow-sm space-y-10">
                            <div className="flex items-center gap-4 pb-6 border-b border-foreground/5">
                                <MapPin className="size-5 text-primary/40" />
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground font-labels">ĐỊA CHỈ NHẬN HÀNG</h3>
                            </div>
                            <div className="text-[11px] font-bold uppercase tracking-widest text-foreground/50 leading-loose font-labels">
                                {shippingAddress ? (
                                    <div className="space-y-2">
                                        <p className="text-foreground">{shippingAddress.street}, {shippingAddress.wardName}</p>
                                        <p>{shippingAddress.districtName}, {shippingAddress.provinceName}</p>
                                        <p>{shippingAddress.country || 'VIỆT NAM'}</p>
                                    </div>
                                ) : (
                                    <p className="text-foreground italic">MÃ ĐỊA CHỈ: {currentOrder.shippingAddressId}</p>
                                )}
                            </div>
                        </div>

                        {/* TRANSACTION SUMMARY */}
                        <div className="bg-white p-10 rounded-[4px] border border-foreground/10 shadow-lg space-y-10 ring-1 ring-primary/5">
                            <div className="flex items-center gap-4 pb-6 border-b border-foreground/5">
                                <ReceiptText className="size-5 text-primary" />
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground font-labels">TÓM TẮT GIAO DỊCH</h3>
                            </div>
                            <div className="space-y-6 text-[10px] font-bold uppercase tracking-widest font-labels">
                                <div className="flex justify-between items-center text-foreground/40">
                                    <span>TẠM TÍNH</span>
                                    <span className="text-foreground">{formatCurrency(currentOrder.totalAmount - (currentOrder.taxAmount || 0) - currentOrder.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-foreground/40">
                                    <span>PHÍ VẬN CHUYỂN</span>
                                    <span className="text-foreground">{formatCurrency(currentOrder.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-foreground/40">
                                    <span>THUẾ GIÁ TRỊ GIA TĂNG</span>
                                    <span className="text-foreground">{formatCurrency(currentOrder.taxAmount || 0)}</span>
                                </div>
                                <div className="border-t border-foreground/10 border-dashed pt-10 flex justify-between items-baseline">
                                    <span className="text-[11px] text-foreground/50 tracking-[0.3em]">TỔNG THANH TOÁN</span>
                                    <span className="text-4xl text-primary font-bold tracking-tighter">{formatCurrency(currentOrder.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
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

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
            <OrderDetailPageContent params={params} />
        </Suspense>
    );
}
