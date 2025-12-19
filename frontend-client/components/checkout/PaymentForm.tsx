"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

import { formatCurrency } from "@/lib/utils/formatCurrency";

export function PaymentForm() {
    // ... hooks ...
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
            const { paymentIntent, error } = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
                confirmParams: {
                    return_url: window.location.origin,
                }
            });

            if (error) {
                if (error.type === "card_error" || error.type === "validation_error") {
                    setMessage(error.message || "Thanh toán thất bại. Vui lòng thử lại.");
                } else {
                    setMessage("Đã xảy ra lỗi không mong muốn.");
                }
                setIsLoading(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                try {
                    const order = await confirmPaymentAndCreateOrder(paymentIntent.id);

                    router.push(`/checkout/success?orderId=${order.id}`);
                } catch (orderError: any) {
                    setMessage(orderError.message || "Thanh toán thành công nhưng tạo đơn hàng thất bại. Vui lòng liên hệ hỗ trợ.");
                    setIsLoading(false);
                }
            } else if (paymentIntent && paymentIntent.status === "processing") {
                setMessage("Thanh toán đang được xử lý. Vui lòng đợi...");
                setIsLoading(false);
            } else {
                setMessage("Thanh toán chưa hoàn tất. Vui lòng thử lại.");
                setIsLoading(false);
            }

        } catch (err: any) {
            setMessage(err.message || "Đã xảy ra lỗi không mong muốn.");
            setIsLoading(false);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
                <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
            </div>

            {message && (
                <Alert variant={message.includes("succeeded") ? "default" : "destructive"}>
                    {message.includes("succeeded") ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{message.includes("succeeded") ? "Thành công" : "Lỗi"}</AlertTitle>
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
                        Đang xử lý...
                    </>
                ) : (
                    `Thanh toán ${formatCurrency(checkoutSession?.amount || 0)}`
                )}
            </Button>
        </form>
    );
}
