"use client";

import { useEffect, useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/services/stripe.service";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
    const { checkout, currentOrder, proceedToPayment, loading: orderLoading } = useCheckout();
    const { cart } = useCart();
    const [stripePromise] = useState(() => getStripe());
    const [elementsOptions, setElementsOptions] = useState<any>(null);

    // Initialize Stripe Elements when we have a client secret
    useEffect(() => {
        if (currentOrder?.paymentClientSecret) {
            setElementsOptions({
                clientSecret: currentOrder.paymentClientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#0f172a',
                    },
                },
            });
        }
    }, [currentOrder]);

    // Handle transition to payment step
    useEffect(() => {
        if (checkout.step === 'payment' && !currentOrder && !orderLoading) {
            // If we are in payment step but no order created yet, create it
            proceedToPayment().catch(console.error);
        }
    }, [checkout.step, currentOrder, orderLoading, proceedToPayment]);

    if (!cart) {
        return <div className="container py-12 text-center">Loading checkout...</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Checkout Flow */}
                <div className="md:col-span-2 space-y-8">

                    {/* Step 1: Address */}
                    <div className={`relative ${checkout.step !== 'address' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="absolute -left-12 top-0 flex flex-col items-center h-full">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${checkout.step === 'address' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}>
                                1
                            </div>
                            <div className="w-0.5 flex-1 bg-border"></div>
                        </div>
                        <AddressForm />
                    </div>

                    {/* Step 2: Payment */}
                    <div className={`relative ${checkout.step !== 'payment' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="absolute -left-12 top-0 flex flex-col items-center h-full">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${checkout.step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}>
                                2
                            </div>
                        </div>

                        {checkout.step === 'payment' && (
                            orderLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                elementsOptions && (
                                    <Elements stripe={stripePromise} options={elementsOptions}>
                                        <PaymentForm />
                                    </Elements>
                                )
                            )
                        )}
                        {checkout.step === 'address' && (
                            <div className="bg-muted/30 p-6 rounded-lg border border-dashed text-center text-muted-foreground">
                                Complete address selection to proceed to payment
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg border sticky top-24">
                        <h3 className="font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm mb-6">
                            {cart.items.map((item) => (
                                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between gap-2">
                                    <span className="text-muted-foreground truncate flex-1">
                                        {item.quantity}x {item.productName}
                                    </span>
                                    <span>${item.totalPrice.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cart.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping</span>
                                <span>Calculated next</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>${cart.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
