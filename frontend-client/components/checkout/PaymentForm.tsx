"use client";

import { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { currentOrder, completeCheckout } = useCheckout();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || !currentOrder) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success?orderId=${currentOrder.id}`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
            </div>

            {message && (
                <Alert variant={message === "Payment succeeded!" ? "default" : "destructive"}>
                    {message === "Payment succeeded!" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{message === "Payment succeeded!" ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full"
                size="lg"
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : `Pay $${currentOrder?.totalAmount.toFixed(2)}`}
                </span>
            </Button>
        </form>
    );
}
