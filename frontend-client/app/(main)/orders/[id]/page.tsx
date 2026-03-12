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
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent">
                    <Link href="/profile/orders" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Orders
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        Order #{currentOrder.groupNumber}
                        <Badge variant="outline" className="text-base font-normal">
                            {currentOrder.overallStatus.replace(/_/g, " ")}
                        </Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Placed on {format(new Date(currentOrder.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">${currentOrder.totalAmount.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {currentOrder.subOrders.some(so => so.ghnOrderCode) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Shipment Tracking
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TrackingTimeline
                                    ghnOrderCode={currentOrder.subOrders.find(so => so.ghnOrderCode)?.ghnOrderCode || ''}
                                />
                            </CardContent>
                        </Card>
                    )}

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Shipments</h2>
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
                <div className="space-y-6">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg border">
                        <h3 className="font-semibold mb-4">Payment Information</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-medium">Credit Card</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Status</span>
                                <Badge variant={currentOrder.paymentStatus === 'SUCCEEDED' ? 'default' : 'secondary'} className="text-xs">
                                    {currentOrder.paymentStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg border">
                        <h3 className="font-semibold mb-4">Shipping Address</h3>
                        <div className="text-sm text-muted-foreground">
                            {/* Note: Address details would come from the address object, assuming we fetch it or it's embedded */}
                            <p className="font-medium text-foreground">Shipping Address ID: {currentOrder.shippingAddressId}</p>
                            <p>123 Main St</p>
                            <p>New York, NY 10001</p>
                            <p>USA</p>
                        </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg border">
                        <h3 className="font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${(currentOrder.totalAmount - currentOrder.taxAmount - currentOrder.shippingCost).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>${currentOrder.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>${currentOrder.taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                                <span>Total</span>
                                <span>${currentOrder.totalAmount.toFixed(2)}</span>
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
