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
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Thông tin thẻ tín dụng / Ghi nợ</p>
                </div>

                <div className="bg-zinc-50/50 p-6 rounded-xl border border-zinc-100">
                    <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
                </div>
            </div>

            {message && (
                <Alert variant={message.includes("succeeded") ? "default" : "destructive"} className="rounded-xl">
                    {message.includes("succeeded") ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle className="font-bold">{message.includes("succeeded") ? "Thành công" : "Thông báo lỗi"}</AlertTitle>
                    <AlertDescription className="text-zinc-600 font-medium">{message}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <Button
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                    className="w-full rounded-none h-14 font-black text-base uppercase tracking-[0.2em] shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98]"
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                            Đang xử lý thanh toán...
                        </>
                    ) : (
                        `Xác nhận & Thanh toán`
                    )}
                </Button>

                <p className="text-[10px] text-center text-zinc-400 font-medium px-8 leading-relaxed">
                    Thông tin thanh toán của bạn được mã hóa và xử lý an toàn bởi Stripe. Chúng tôi không bao giờ lưu trữ thông tin thẻ của bạn.
                </p>
            </div>
        </form>
    );
}
