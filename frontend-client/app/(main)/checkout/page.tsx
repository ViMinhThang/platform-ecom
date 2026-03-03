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
import { useAppSelector } from "@/lib/store/hooks";
import { logger } from "@/lib/logger";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { imageUrl } from "@/lib/utils/imageUrl";

import { usePromotion } from "@/hooks/usePromotion";
import { VoucherSection } from "@/components/checkout/VoucherSection";

export default function CheckoutPage() {
    const {
        checkout,
        checkoutSession,
        currentOrder,
        startCheckout,
        loading: orderLoading,
        error: orderError,
        setShipping
    } = useCheckout();
    const { cart } = useCart();
    const [stripePromise, setStripePromise] = useState<Promise<any>>(Promise.resolve(null));
    const [stripeError, setStripeError] = useState<string | null>(null);

    useEffect(() => {
        const initStripe = async () => {
            const stripe = getStripe();
            if (!stripe) {
                setStripeError('Payment system is not configured. Please contact support.');
            }
            setStripePromise(Promise.resolve(stripe));
        };
        initStripe();
    }, []);
    const [elementsOptions, setElementsOptions] = useState<any>(null);

    const { shippingFee, loading: shippingLoading, calculateTotalShipping } = useShipping();
    const { addresses } = useAppSelector((state) => state.address);
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
        return <div className="container py-12 text-center">Đang tải trang thanh toán...</div>;
    }

    const totalAmount = discountResult ? discountResult.finalTotal : (cart.totalAmount + shippingFee);

    return (
        <div className="bg-zinc-50/30 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
                <h1 className="text-3xl md:text-5xl font-black mb-12 font-header tracking-tight text-zinc-900 border-b pb-8">
                    Thanh <span className="text-primary italic">toán</span>
                </h1>

                <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
                    {/* Main Checkout Flow */}
                    <div className="space-y-12">

                        {/* Step 1: Address */}
                        <div className={`transition-all duration-500 ${checkout.step !== 'address' ? 'opacity-50 blur-[1px]' : ''}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black font-header text-lg shadow-sm border-2 ${checkout.step === 'address' ? 'bg-primary text-white border-primary' : 'bg-white text-zinc-400 border-zinc-200'
                                    }`}>
                                    1
                                </div>
                                <h2 className="text-2xl font-bold font-header tracking-tight">Địa chỉ giao hàng</h2>
                            </div>

                            <div className="bg-white border rounded-none p-8 shadow-sm">
                                <AddressForm />
                            </div>
                        </div>

                        {/* Step 2: Payment */}
                        <div className={`transition-all duration-500 ${checkout.step !== 'payment' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black font-header text-lg shadow-sm border-2 ${checkout.step === 'payment' ? 'bg-primary text-white border-primary' : 'bg-white text-zinc-400 border-zinc-200'
                                    }`}>
                                    2
                                </div>
                                <h2 className="text-2xl font-bold font-header tracking-tight">Phương thức thanh toán</h2>
                            </div>

                            <div className="bg-white border rounded-none p-8 shadow-sm">
                                {checkout.step === 'payment' && (
                                    stripeError ? (
                                        <Alert variant="destructive" className="rounded-none">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle className="font-bold">Lỗi cấu hình thanh toán</AlertTitle>
                                            <AlertDescription className="text-zinc-600 font-medium">{stripeError}</AlertDescription>
                                        </Alert>
                                    ) : orderLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Đang thiết lập thanh toán bảo mật...</p>
                                        </div>
                                    ) : orderError ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                            <div className="bg-red-50 p-6 rounded-full">
                                                <AlertCircle className="h-10 w-10 text-red-500" />
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="font-bold text-xl font-header">Khởi tạo thanh toán thất bại</h3>
                                                <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed">{orderError}</p>
                                            </div>
                                            <Button onClick={() => startCheckout()} variant="outline" className="rounded-none px-8 h-12 font-bold border-2">
                                                Thử lại ngay
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

                        {/* Step 3: Review Items (eBay style) */}
                        <div className={`transition-all duration-500`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black font-header text-lg shadow-sm border-2 bg-white text-zinc-900 border-zinc-900">
                                    3
                                </div>
                                <h2 className="text-2xl font-bold font-header tracking-tight">Kiểm tra lại sản phẩm</h2>
                            </div>

                            <div className="bg-white border rounded-none p-8 shadow-sm space-y-8">
                                {cart.items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-6 pb-8 border-b last:border-0 last:pb-0">
                                        <div className="w-24 h-24 bg-zinc-50 rounded-none border border-zinc-100 flex-shrink-0 relative overflow-hidden p-2">
                                            <img src={imageUrl.product(item.imageUrl)} alt={item.productName} className="object-contain w-full h-full" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-bold text-base leading-tight">{item.productName}</h3>
                                            {item.variantName && (
                                                <p className="text-xs text-zinc-400 font-medium italic">{item.variantName}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2">
                                                <p className="text-sm font-bold">Số lượng: <span className="text-primary">{item.quantity}</span></p>
                                                <p className="text-sm font-bold">Đơn giá: {formatCurrency(item.price)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black tracking-tighter">{formatCurrency(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 flex items-center gap-2 text-zinc-400 text-xs font-medium">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Vui lòng kiểm tra kỹ số lượng và phân loại trước khi thanh toán.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white border rounded-none p-8 shadow-md">
                            <h3 className="text-xl font-bold mb-8 font-header tracking-tight border-b pb-4">Tóm tắt đơn hàng</h3>

                            <div className="space-y-6 mb-8 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                                {cart.items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 items-start">
                                        <div className="w-16 h-16 bg-zinc-50 rounded-none border border-zinc-100 flex-shrink-0 relative overflow-hidden">
                                            <img src={imageUrl.product(item.imageUrl)} alt={item.productName} className="object-cover w-full h-full" />
                                            <div className="absolute top-0 right-0 bg-primary/90 text-white text-[10px] font-black px-1.5 py-0.5 min-w-[18px] text-center">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate leading-tight mb-1">{item.productName}</p>
                                            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
                                                {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                            <p className="text-xs font-black">{formatCurrency(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t pt-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500 font-medium">Tạm tính</span>
                                    <span className="font-bold tabular-nums">{formatCurrency(cart.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500 font-medium">Phí vận chuyển</span>
                                    <span className="font-bold tabular-nums">
                                        {shippingLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        ) : (
                                            shippingFee > 0 ? (
                                                <span className="text-zinc-900">{formatCurrency(shippingFee)}</span>
                                            ) : (
                                                <span className="text-zinc-400 italic text-xs">Chưa tính</span>
                                            )
                                        )}
                                    </span>
                                </div>

                                {/* Voucher Section */}
                                <div className="pt-2">
                                    <VoucherSection />
                                </div>

                                <div className="border-t border-dashed pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold">Tổng thanh toán</span>
                                    <span className="text-2xl font-black tracking-tighter text-primary tabular-nums">
                                        {formatCurrency(totalAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-8 pt-6 border-t flex items-start gap-3 bg-primary/5 p-4 rounded-none border border-primary/10">
                                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-primary uppercase tracking-widest">Bảo vệ mua hàng 100%</p>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                                        Cam kết hoàn tiền và bảo mật thanh toán tuyệt đối.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Back Link */}
                        <div className="text-center px-4 leading-relaxed">
                            <p className="text-[11px] text-zinc-400 font-medium px-4">
                                Bằng cách đặt hàng, bạn đồng ý với các
                                <span className="text-zinc-900 font-bold hover:underline cursor-pointer px-1">Điều khoản dịch vụ</span>
                                của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
