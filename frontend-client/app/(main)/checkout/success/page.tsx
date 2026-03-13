"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchOrderById } from "@/lib/store/slices/orderSlice";
import { resetCheckout } from "@/lib/store/slices/checkoutSlice";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/formatCurrency";

import { Suspense } from "react";

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentOrder, loading } = useAppSelector((state) => state.orders);

    const orderId = searchParams.get("orderId");

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderById(Number(orderId)));
        }

        // Clear checkout state
        dispatch(resetCheckout());
    }, [orderId, dispatch]);

    if (loading) {
        return (
            <div className="container py-20 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 px-4 max-w-2xl">
            <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="p-6 rounded-sm bg-primary/10 shadow-inner border border-primary/20">
                        <CheckCircle2 className="h-12 w-12 text-primary" />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-foreground">Thanh toán <span className="text-primary italic">thành công</span></h1>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] opacity-60">
                        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
                    </p>
                </div>

                {/* Order Details */}
                {currentOrder && (
                    <div className="bg-background border border-border rounded-sm p-8 text-left space-y-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />
                        
                        <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            <Package className="h-3 w-3" />
                            Chi tiết đơn hàng
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="text-muted-foreground">Mã đơn hàng</span>
                                <span className="text-foreground">{currentOrder.groupNumber}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Tổng thanh toán</span>
                                <span className="text-2xl font-bold tracking-tighter text-primary">
                                    {formatCurrency(currentOrder.totalAmount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Trạng thái</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm border border-primary/20">Đã thanh toán</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="text-muted-foreground">Sản phẩm</span>
                                <span className="text-foreground">
                                    {currentOrder.subOrders.reduce((acc, so) => acc + so.items.length, 0)} món
                                </span>
                            </div>
                        </div>

                        {/* Items Preview */}
                        <div className="border-t border-border border-dashed pt-6 space-y-3">
                            {currentOrder.subOrders.flatMap(so => so.items).slice(0, 3).map((item) => (
                                <div key={item.id} className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                    <span className="text-muted-foreground opacity-70">
                                        <span className="text-foreground">{item.quantity}x</span> {item.productName}
                                    </span>
                                    <span className="text-foreground">{formatCurrency(item.totalPrice)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Button asChild className="rounded-sm h-12 px-8 font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-primary/10">
                        <Link href="/orders">
                            Xem đơn hàng
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" className="rounded-sm h-12 px-8 font-bold text-[11px] uppercase tracking-widest border-border hover:bg-muted/30" asChild>
                        <Link href="/products">
                            Tiếp tục mua sắm
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
