"use client";

import { useState, useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAddresses } from "@/lib/store/slices/addressSlice";
import { useSession } from "next-auth/react";

export function AddressForm() {
    const { selectAddress, checkout, setStep } = useCheckout();
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const { addresses, loading } = useAppSelector((state) => state.address);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (session?.accessToken) {
            dispatch(fetchAddresses(session.accessToken));
        }
    }, [dispatch, session]);

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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">You don't have any saved addresses.</p>
                <p className="text-sm text-muted-foreground">Please go to your profile to add an address.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>

            <RadioGroup
                value={checkout.selectedAddressId?.toString()}
                onValueChange={(val) => selectAddress(Number(val))}
                className="grid gap-4 grid-cols-1"
            >
                {addresses.map((addr) => (
                    <div key={addr.addressId}>
                        <RadioGroupItem value={addr.addressId!.toString()} id={`addr-${addr.addressId}`} className="peer sr-only" />
                        <Label
                            htmlFor={`addr-${addr.addressId}`}
                            className="flex flex-col gap-3 rounded-xl border-2 border-muted bg-card p-6 hover:bg-accent/50 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all min-h-[120px]"
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    {addr.buildingName || "Address"}
                                    {addr.isDefault && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                                    )}
                                </span>
                            </div>
                            <div className="text-base text-muted-foreground pl-7">
                                <p>{addr.street}</p>
                                <p>{addr.wardName}, {addr.districtName}, {addr.provinceName || addr.city}</p>
                                <p className="mt-1 text-sm">{addr.country}</p>
                            </div>
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <Button
                className="w-full md:w-auto min-w-[200px]"
                size="lg"
                disabled={!checkout.selectedAddressId}
                onClick={handleContinue}
            >
                Continue to Payment
            </Button>
        </div>
    );
}
