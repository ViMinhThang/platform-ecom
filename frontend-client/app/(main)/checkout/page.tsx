"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/services/stripe.service";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShipping } from "@/hooks/useShipping";
import { useGetAddressesQuery } from "@/lib/store/api/clientApi";
import { logger } from "@/lib/logger";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { imageUrl } from "@/lib/utils/imageUrl";

import { usePromotion } from "@/hooks/usePromotion";
import { VoucherSection } from "@/components/checkout/VoucherSection";

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
                setStripeError('Payment system is not configured. Please contact support.');
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
                        colorPrimary: '#0f172a',
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
        return <div className="container py-12 text-center text-muted-foreground font-bold uppercase tracking-widest">Đang tải trang thanh toán...</div>;
    }

    const totalAmount = discountResult ? discountResult.finalTotal : (cart.totalAmount + shippingFee);

    return (
        <div className="bg-background min-h-screen font-labels antialiased">
            <div className="max-w-[1600px] mx-auto py-24 px-12 md:px-32">
                <div className="mb-20 space-y-4">
                    <h1 className="font-header text-5xl md:text-6xl font-bold tracking-tight text-foreground uppercase">
                        Thanh <span className="text-primary italic">Toán</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">Phân hệ thanh toán bảo mật</span>
                        <div className="h-px bg-foreground/10 flex-1" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">MÃ ĐƠN HÀNG: #ACME-{Date.now().toString().slice(-6)}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
                    {/* Main Checkout Flow */}
                    <div className="space-y-12">

                        {/* Step 1: Address */}
                        <div className={`transition-all duration-500 ${checkout.step !== 'address' ? 'opacity-50 blur-[1px]' : ''}`}>
                            <div className="flex items-center gap-4 mb-12">
                                <div className={`w-12 h-12 rounded-sm flex items-center justify-center font-bold text-xl shadow-md border ${checkout.step === 'address' ? 'bg-primary text-white border-primary' : 'bg-white text-foreground/20 border-foreground/5'
                                    }`}>
                                    01
                                </div>
                                <h2 className="text-2xl font-bold tracking-[0.2em] uppercase font-labels">Địa chỉ giao hàng</h2>
                            </div>

                            <div className="bg-white border border-foreground/5 rounded-sm p-12 shadow-sm">
                                <AddressForm />
                            </div>
                        </div>

                        {/* Step 2: Payment */}
                        <div className={`transition-all duration-500 ${checkout.step !== 'payment' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                            <div className="flex items-center gap-4 mb-12">
                                <div className={`w-12 h-12 rounded-sm flex items-center justify-center font-bold text-xl shadow-md border ${checkout.step === 'payment' ? 'bg-primary text-white border-primary' : 'bg-white text-foreground/20 border-foreground/5'
                                    }`}>
                                    02
                                </div>
                                <h2 className="text-2xl font-bold tracking-[0.2em] uppercase font-labels">Phương thức thanh toán</h2>
                            </div>

                            <div className="bg-white border border-foreground/5 rounded-sm p-12 shadow-sm">
                                {checkout.step === 'payment' && (
                                    stripeError ? (
                                        <Alert variant="destructive" className="rounded-sm">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle className="font-bold">Lỗi cấu hình thanh toán</AlertTitle>
                                            <AlertDescription className="text-muted-foreground font-medium">{stripeError}</AlertDescription>
                                        </Alert>
                                    ) : orderLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse opacity-50 text-center">Đang thiết lập thanh toán bảo mật...</p>
                                        </div>
                                    ) : orderError ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                            <div className="bg-red-50 p-6 rounded-full">
                                                <AlertCircle className="h-10 w-10 text-red-500" />
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="font-bold text-lg tracking-widest uppercase text-foreground">Khởi tạo thanh toán thất bại</h3>
                                                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed text-sm">{orderError}</p>
                                            </div>
                                            <div className="flex justify-center">
                                                <Button onClick={() => startCheckout()} variant="outline" className="rounded-sm px-8 h-12 font-bold border-border shadow-sm uppercase tracking-widest text-[11px]">
                                                    Thử lại ngay
                                                </Button>
                                            </div>
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

                        {/* Step 3: Review Items */}
                        <div className={`transition-all duration-500`}>
                            <div className="flex items-center gap-4 mb-12">
                                <div className="w-12 h-12 rounded-sm flex items-center justify-center font-bold text-xl shadow-md border bg-white text-foreground/20 border-foreground/5">
                                    03
                                </div>
                                <h2 className="text-2xl font-bold tracking-[0.2em] uppercase font-labels">Kiểm tra lại sản phẩm</h2>
                            </div>

                            <div className="bg-white border border-foreground/5 rounded-sm p-12 shadow-sm space-y-12">
                                {cart.items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-6 pb-8 border-b border-border last:border-0 last:pb-0">
                                        <div className="w-24 h-24 bg-muted/30 rounded-sm border border-border flex-shrink-0 relative overflow-hidden p-2 shadow-inner">
                                            <img src={imageUrl.product(item.imageUrl)} alt={item.productName} className="object-contain w-full h-full" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">{item.productName}</h3>
                                            {item.variantName && (
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">{item.variantName}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2">
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Số lượng: <span className="text-foreground ml-1">{item.quantity}</span></p>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Đơn giá: <span className="text-foreground ml-1">{formatCurrency(item.price)}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold tracking-tighter text-foreground">{formatCurrency(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-50">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Vui lòng kiểm tra kỹ số lượng và phân loại trước khi thanh toán.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:sticky lg:top-32 space-y-10">
                        <div className="bg-white border border-foreground/5 rounded-sm p-12 shadow-lg">
                            <h3 className="text-sm font-bold mb-10 uppercase tracking-[0.3em] text-foreground border-b border-foreground/10 pb-6 font-labels">Tóm tắt đơn hàng</h3>

                            <div className="space-y-6 mb-8 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                                {cart.items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 items-start">
                                        <div className="w-16 h-16 bg-muted/30 rounded-sm border border-border flex-shrink-0 relative overflow-hidden shadow-inner">
                                            <img src={imageUrl.product(item.imageUrl)} alt={item.productName} className="object-cover w-full h-full" />
                                            <div className="absolute top-0 right-0 bg-primary/90 text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 min-w-[18px] text-center rounded-bl-sm">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold truncate leading-tight mb-1 uppercase tracking-widest text-foreground">{item.productName}</p>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
                                                {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                            <p className="text-[11px] font-bold text-foreground">{formatCurrency(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-border pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Tạm tính</span>
                                    <span className="font-bold tabular-nums text-sm text-foreground">{formatCurrency(cart.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phí vận chuyển</span>
                                    <span className="font-bold tabular-nums text-sm">
                                        {shippingLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        ) : (
                                            shippingFee > 0 ? (
                                                <span className="text-foreground">{formatCurrency(shippingFee)}</span>
                                            ) : (
                                                <span className="text-muted-foreground italic text-[10px] opacity-50">Chưa tính</span>
                                            )
                                        )}
                                    </span>
                                </div>

                                {/* Voucher Section */}
                                <div className="pt-2">
                                    <VoucherSection />
                                </div>

                                <div className="border-t border-border border-dashed pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-foreground">Tổng thanh toán</span>
                                    <span className="text-2xl font-bold tracking-tighter text-primary tabular-nums">
                                        {formatCurrency(totalAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-8 pt-6 border-t border-border flex items-start gap-3 bg-primary/5 p-4 rounded-sm border border-primary/10">
                                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Bảo vệ mua hàng 100%</p>
                                    <p className="text-[9px] text-muted-foreground leading-relaxed font-bold uppercase tracking-widest opacity-50">
                                        Cam kết hoàn tiền và bảo mật thanh toán tuyệt đối.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Back Link */}
                        <div className="text-center px-4 leading-relaxed opacity-50">
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest px-4">
                                Bằng cách đặt hàng, bạn đồng ý với các
                                <span className="text-foreground font-bold hover:underline cursor-pointer px-1">Điều khoản dịch vụ</span>
                                của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
