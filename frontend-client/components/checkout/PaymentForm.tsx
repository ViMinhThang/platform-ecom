"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { checkoutSession, confirmPaymentAndCreateOrder } = useCheckout();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || !checkoutSession) {
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            // Step 1: Confirm payment with Stripe (no redirect)
            const { paymentIntent, error } = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
                confirmParams: {
                    return_url: window.location.origin, // Fallback only
                }
            });

            if (error) {
                // Payment failed
                if (error.type === "card_error" || error.type === "validation_error") {
                    setMessage(error.message || "Payment failed. Please try again.");
                } else {
                    setMessage("An unexpected error occurred.");
                }
                setIsLoading(false);
                return;
            }

            // Step 2: Payment succeeded - create order in backend
            if (paymentIntent && paymentIntent.status === "succeeded") {
                try {
                    const order = await confirmPaymentAndCreateOrder(paymentIntent.id);

                    // Navigate to success page
                    router.push(`/checkout/success?orderId=${order.id}`);
                } catch (orderError: any) {
                    setMessage(orderError.message || "Payment succeeded but failed to create order. Please contact support.");
                    setIsLoading(false);
                }
            } else if (paymentIntent && paymentIntent.status === "processing") {
                setMessage("Your payment is processing. Please wait...");
                setIsLoading(false);
            } else {
                setMessage("Payment was not completed. Please try again.");
                setIsLoading(false);
            }

        } catch (err: any) {
            setMessage(err.message || "An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
            </div>

            {message && (
                <Alert variant={message.includes("succeeded") ? "default" : "destructive"}>
                    {message.includes("succeeded") ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{message.includes("succeeded") ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full"
                size="lg"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Pay $${checkoutSession?.amount.toFixed(2) || '0.00'}`
                )}
            </Button>
        </form>
    );
}
