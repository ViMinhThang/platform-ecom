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
    const { checkout, confirmPaymentAndCreateOrder } = useCheckout();
    const checkoutSession = checkout.checkoutSession;
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
            <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-border pb-6">
                    <div className="bg-primary/10 p-2 rounded-sm text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em]">Thông tin thẻ tín dụng / Ghi nợ</p>
                </div>

                <div className="bg-muted/10 p-8 rounded-sm border border-border shadow-inner">
                    <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
                </div>
            </div>

            {message && (
                <Alert variant={message.includes("succeeded") ? "default" : "destructive"} className="rounded-sm border border-border">
                    {message.includes("succeeded") ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle className="text-[10px] font-bold uppercase tracking-widest">{message.includes("succeeded") ? "Thành công" : "Thông báo lỗi"}</AlertTitle>
                    <AlertDescription className="text-muted-foreground text-xs font-medium">{message}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
                <Button
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                    className="w-full rounded-sm h-14 font-bold text-[11px] uppercase tracking-[0.25em] shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
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

                <p className="text-[9px] text-center text-muted-foreground font-bold uppercase tracking-widest px-8 leading-relaxed opacity-50">
                    Thông tin thanh toán của bạn được mã hóa và xử lý an toàn bởi Stripe. Chúng tôi không bao giờ lưu trữ thông tin thẻ của bạn.
                </p>
            </div>
        </form>
    );
}
