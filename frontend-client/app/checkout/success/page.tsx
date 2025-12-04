"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchOrderById } from "@/lib/store/slices/orderSlice";
import { resetCheckout } from "@/lib/store/slices/checkoutSlice";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
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
                    <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="h-16 w-16 text-green-600" />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Payment Successful!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                </div>

                {/* Order Details */}
                {currentOrder && (
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 text-left space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Package className="h-4 w-4" />
                            Order Details
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Order Number</span>
                                <span className="font-medium">{currentOrder.groupNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Amount</span>
                                <span className="font-bold text-lg">
                                    ${currentOrder.totalAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Status</span>
                                <span className="font-medium text-green-600">Paid</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Items</span>
                                <span>
                                    {currentOrder.subOrders.reduce((acc, so) => acc + so.items.length, 0)} item(s)
                                </span>
                            </div>
                        </div>

                        {/* Items Preview */}
                        <div className="border-t pt-4 space-y-2">
                            {currentOrder.subOrders.flatMap(so => so.items).slice(0, 3).map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.quantity}x {item.productName}</span>
                                    <span>${item.totalPrice.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button asChild size="lg">
                        <Link href="/orders">
                            View My Orders
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/products">
                            Continue Shopping
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
