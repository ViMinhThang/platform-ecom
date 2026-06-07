"use client";

import { useState, useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { useGetAddressesQuery } from "@/lib/store/api/clientApi";

export function AddressForm() {
    const { selectAddress, checkout, setStep } = useCheckout();
    const { data: addresses = [], isLoading: loading } = useGetAddressesQuery();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-select default address or first available
    useEffect(() => {
        if (addresses.length > 0 && !checkout.selectedAddressId) {
            const defaultAddress = addresses.find(a => a.isDefault);
            if (defaultAddress) {
                selectAddress(defaultAddress.addressId!);
            } else {
                selectAddress(addresses[0].addressId!);
            }
        }
    }, [addresses, checkout.selectedAddressId, selectAddress]);

    const handleContinue = () => {
        if (checkout.selectedAddressId) {
            setStep('payment');
        }
    };

    if (!mounted) return null;

    if (loading && addresses.length === 0) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-border rounded-sm bg-muted/10">
                <p className="text-muted-foreground mb-4 font-bold text-sm uppercase tracking-widest">Bạn chưa có địa chỉ nào được lưu.</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] opacity-50">Vui lòng truy cập hồ sơ của bạn để thêm địa chỉ.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <RadioGroup
                value={checkout.selectedAddressId?.toString()}
                onValueChange={(val) => selectAddress(Number(val))}
                className="grid gap-6 grid-cols-1"
            >
                {addresses.map((addr) => (
                    <div key={addr.addressId}>
                        <RadioGroupItem value={addr.addressId!.toString()} id={`addr-${addr.addressId}`} className="peer sr-only" />
                        <Label
                            htmlFor={`addr-${addr.addressId}`}
                            className="block rounded-sm border border-border bg-background p-8 hover:bg-muted/30 hover:shadow-md peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/[0.03] cursor-pointer transition-all relative overflow-hidden group shadow-sm w-full"
                        >
                            {/* Selected Indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-peer-data-[state=checked]:opacity-100 transition-all transform scale-90 group-peer-data-[state=checked]:scale-100">
                                <div className="bg-primary text-primary-foreground rounded-sm p-1.5 shadow-lg border border-primary">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-[220px_1fr_200px] gap-8 items-start w-full">
                                {/* Section 1: Title & Status */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-base tracking-widest uppercase text-foreground">
                                            {addr.buildingName || "Địa chỉ nhận"}
                                        </span>
                                    </div>
                                    {addr.isDefault && (
                                        <div className="mt-1">
                                            <span className="text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-sm border border-primary/20">
                                                Mặc định
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Section 2: Street Info */}
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-[8px] font-bold uppercase tracking-[0.2em] mb-1.5 opacity-50">ĐƯỜNG / SỐ NHÀ</p>
                                    <p className="text-foreground font-bold text-sm leading-tight uppercase tracking-widest">
                                        {addr.street}
                                    </p>
                                </div>

                                {/* Section 3: Full Location */}
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-[8px] font-bold uppercase tracking-[0.2em] mb-1.5 opacity-50">KHU VỰC</p>
                                    <div className="text-[11px] font-bold text-foreground leading-relaxed uppercase tracking-widest">
                                        <p>{addr.wardName}</p>
                                        <p>{addr.districtName}</p>
                                        <p className="text-muted-foreground opacity-50">{addr.provinceName || addr.city}, {addr.country}</p>
                                    </div>
                                </div>
                            </div>
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <div className="pt-4 flex justify-end items-center gap-4">
                <Button variant="ghost" className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary h-12 px-6">
                    + Thêm địa chỉ mới
                </Button>
                <Button
                    className="min-w-[240px] rounded-sm h-12 font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-primary/10"
                    disabled={!checkout.selectedAddressId || !checkout.shippingFee || checkout.shippingFee <= 0}
                    onClick={handleContinue}
                >
                    Tiếp tục thanh toán
                </Button>
            </div>
        </div>
    );
}
