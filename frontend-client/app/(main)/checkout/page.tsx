"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/services/stripe.service";
import { Loader2, AlertCircle, ShieldCheck, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShipping } from "@/hooks/useShipping";
import { useGetAddressesQuery } from "@/lib/store/api/clientApi";
import { logger } from "@/lib/logger";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { imageUrl } from "@/lib/utils/imageUrl";

import { usePromotion } from "@/hooks/usePromotion";
import { VoucherSection } from "@/components/checkout/VoucherSection";
import Link from "next/link";

const STEPS = [
    { key: "address", label: "Địa chỉ", number: "01" },
    { key: "payment", label: "Thanh toán", number: "02" },
    { key: "review", label: "Xác nhận", number: "03" },
];

export default function CheckoutPage() {
    const {
        checkout,
        startCheckout,
        loading: orderLoading,
        error: orderError,
        setShipping
    } = useCheckout();
    const checkoutSession = checkout.checkoutSession;
    const currentOrder = checkout.currentOrder;
    const { cart } = useCart();
    const [stripePromise, setStripePromise] = useState<Promise<any>>(Promise.resolve(null));
    const [stripeError, setStripeError] = useState<string | null>(null);

    useEffect(() => {
        const initStripe = async () => {
            const stripe = await getStripe();
            if (!stripe) {
                setStripeError('Hệ thống thanh toán chưa được cấu hình. Vui lòng liên hệ hỗ trợ.');
            }
            setStripePromise(Promise.resolve(stripe));
        };
        initStripe();
    }, []);
    const [elementsOptions, setElementsOptions] = useState<any>(null);

    const { shippingFee, loading: shippingLoading, calculateTotalShipping } = useShipping();
    const { data: addresses = [] } = useGetAddressesQuery();
    const { discountResult } = usePromotion(cart, shippingFee);

    useEffect(() => {
        if (cart && checkout.selectedAddressId && addresses.length > 0) {
            const selectedAddress = addresses.find(a => a.addressId === checkout.selectedAddressId);
            if (selectedAddress) {
                calculateTotalShipping(cart, selectedAddress);
            }
        }
    }, [cart, checkout.selectedAddressId, addresses, calculateTotalShipping]);

    useEffect(() => {
        if (shippingFee > 0) {
            setShipping(shippingFee);
        }
    }, [shippingFee, setShipping]);

    useEffect(() => {
        if (checkoutSession?.clientSecret) {
            setElementsOptions({
                clientSecret: checkoutSession.clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#ab2d00',
                    },
                },
            });
        }
    }, [checkoutSession]);

    useEffect(() => {
        if (checkout.step === 'payment' && !checkoutSession && !orderLoading && !orderError && !currentOrder) {
            startCheckout().catch((err) => logger.error("Failed to initiate checkout", err));
        }
    }, [checkout.step, checkoutSession, orderLoading, startCheckout, orderError, currentOrder]);

    if (!cart) {
        return <div className="max-w-[1600px] mx-auto py-12 text-center text-foreground/50 text-sm">Đang tải trang thanh toán...</div>;
    }

    const totalAmount = discountResult ? discountResult.finalTotal : (cart.totalAmount + shippingFee);
    const currentStepIndex = STEPS.findIndex(s => s.key === checkout.step);

    return (
        <div className="bg-background min-h-screen antialiased">
            <div className="max-w-[1600px] mx-auto py-12 md:py-24 px-6 md:px-12">
                {/* Header */}
                <div className="mb-12 space-y-4">
                    <h1 className="font-header text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        Thanh toán
                    </h1>
                    <p className="text-sm text-foreground/50">Hoàn tất đơn hàng của bạn một cách an toàn</p>
                </div>

                {/* Step Progress Indicator */}
                <div className="mb-12 flex items-center gap-0 max-w-lg">
                    {STEPS.map((step, i) => {
                        const isActive = step.key === checkout.step;
                        const isComplete = i < currentStepIndex;
                        return (
                            <div key={step.key} className="flex items-center flex-1">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                        isComplete ? 'bg-primary text-white' :
                                        isActive ? 'bg-signature-gradient text-white shadow-md' : 
                                        'bg-surface-container-low text-foreground/30'
                                    }`}>
                                        {isComplete ? <Check className="w-4 h-4" /> : step.number}
                                    </div>
                                    <span className={`text-sm font-semibold hidden md:block ${
                                        isActive ? 'text-foreground' : 'text-foreground/40'
                                    }`}>{step.label}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 rounded-full transition-colors ${
                                        isComplete ? 'bg-primary' : 'bg-surface-container'
                                    }`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-[1fr_400px] gap-8 md:gap-12 items-start">
                    {/* Main Flow */}
                    <div className="space-y-8">

                        {/* Step 1: Address */}
                        <div className={`transition-all duration-500 ${checkout.step !== 'address' ? 'opacity-50' : ''}`}>
                            <h2 className="text-lg font-bold mb-6 text-foreground">Địa chỉ giao hàng</h2>
                            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm">
                                <AddressForm />
                            </div>
                        </div>

                        {/* Step 2: Payment */}
                        <div className={`transition-all duration-500 ${checkout.step !== 'payment' ? 'opacity-40 pointer-events-none' : ''}`}>
                            <h2 className="text-lg font-bold mb-6 text-foreground">Phương thức thanh toán</h2>
                            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm">
                                {checkout.step === 'payment' && (
                                    stripeError ? (
                                        <Alert variant="destructive" className="rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle className="font-bold">Lỗi cấu hình thanh toán</AlertTitle>
                                            <AlertDescription className="text-sm">{stripeError}</AlertDescription>
                                        </Alert>
                                    ) : orderLoading ? (
                                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <p className="text-sm text-foreground/50 animate-pulse">Đang thiết lập thanh toán bảo mật...</p>
                                        </div>
                                    ) : orderError ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
                                            <div className="bg-destructive/10 p-5 rounded-full">
                                                <AlertCircle className="h-8 w-8 text-destructive" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-bold text-foreground">Khởi tạo thanh toán thất bại</h3>
                                                <p className="text-sm text-foreground/50 max-w-sm mx-auto">{orderError}</p>
                                            </div>
                                            <Button onClick={() => startCheckout()} variant="outline" size="default">
                                                Thử lại
                                            </Button>
                                        </div>
                                    ) : (
                                        elementsOptions && (
                                            <Elements stripe={stripePromise} options={elementsOptions}>
                                                <PaymentForm />
                                            </Elements>
                                        )
                                    )
                                )}
                            </div>
                        </div>

                        {/* Step 3: Review */}
                        <div>
                            <h2 className="text-lg font-bold mb-6 text-foreground">Kiểm tra đơn hàng</h2>
                            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm space-y-6">
                                {cart.items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-5 pb-6 last:pb-0">
                                        <div className="w-20 h-20 bg-surface-container-low rounded-lg flex-shrink-0 relative overflow-hidden p-1.5">
                                            <img src={imageUrl.product(item.imageUrl)} alt={item.productName} className="object-contain w-full h-full" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-bold text-sm text-foreground">{item.productName}</h3>
                                            {item.variantName && (
                                                <p className="text-xs text-foreground/50">{item.variantName}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-1.5">
                                                <p className="text-xs text-foreground/50">Số lượng: <span className="text-foreground font-medium">{item.quantity}</span></p>
                                                <p className="text-xs text-foreground/50">Đơn giá: <span className="text-foreground font-medium">{formatCurrency(item.price)}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-foreground">{formatCurrency(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-3 flex items-center gap-2 text-foreground/40 text-xs">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Vui lòng kiểm tra kỹ số lượng và phân loại trước khi thanh toán.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:sticky lg:top-32 space-y-6">
                        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sunlight">
                            <h3 className="text-sm font-bold mb-8 text-foreground">Tóm tắt đơn hàng</h3>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-auto pr-2">
                                {cart.items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 items-start">
                                        <div className="aspect-4/5 w-14 relative bg-surface-container rounded-3xl overflow-hidden group/img">
                                            <img src={imageUrl.product(item.imageUrl)} alt={item.productName} className="object-cover w-full h-full" />
                                            <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 min-w-[16px] text-center rounded-bl-md">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold truncate text-foreground">{item.productName}</p>
                                            <p className="text-xs text-foreground/40">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                            <p className="text-xs font-bold text-foreground">{formatCurrency(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-foreground/50">Tạm tính</span>
                                    <span className="font-semibold tabular-nums text-sm text-foreground">{formatCurrency(cart.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-foreground/50">Phí vận chuyển</span>
                                    <span className="font-semibold tabular-nums text-sm">
                                        {shippingLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        ) : (
                                            shippingFee > 0 ? (
                                                <span className="text-foreground">{formatCurrency(shippingFee)}</span>
                                            ) : (
                                                <span className="text-foreground/40 text-xs">Chưa tính</span>
                                            )
                                        )}
                                    </span>
                                </div>

                                {/* Voucher */}
                                <div className="shrink-0">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                </div>
                                <div className="pt-1">
                                    <VoucherSection />
                                </div>

                                <div className="pt-4 mt-2 flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground">Tổng thanh toán</span>
                                    <span className="text-2xl font-bold tracking-tight text-primary tabular-nums">
                                        {formatCurrency(totalAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-6 pt-5 flex items-start gap-3 bg-primary/5 p-4 rounded-lg">
                                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-primary">Bảo vệ mua hàng 100%</p>
                                    <p className="text-xs text-foreground/40 leading-relaxed">
                                        Cam kết hoàn tiền và bảo mật thanh toán tuyệt đối.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Legal */}
                        <div className="text-center px-4">
                            <p className="text-xs text-foreground/40 leading-relaxed">
                                Bằng cách đặt hàng, bạn đồng ý với
                                <Link href="/terms" className="text-primary font-medium hover:underline mx-1">Điều khoản dịch vụ</Link>
                                của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
