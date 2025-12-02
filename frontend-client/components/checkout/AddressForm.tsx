"use client";

import { useState, useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, MapPin } from "lucide-react";
// import { useAddress } from "@/hooks/useAddress"; // Assuming this exists or needs to be created

// Mock address data for now if hook doesn't exist
const MOCK_ADDRESSES = [
    { id: 1, name: "Home", line1: "123 Main St", city: "New York", state: "NY", zip: "10001", country: "USA" },
    { id: 2, name: "Work", line1: "456 Corp Blvd", city: "San Francisco", state: "CA", zip: "94105", country: "USA" },
];

export function AddressForm() {
    const { selectAddress, checkout, setStep } = useCheckout();
    const [addresses, setAddresses] = useState(MOCK_ADDRESSES); // Replace with real data fetch

    const handleContinue = () => {
        if (checkout.selectedAddressId) {
            setStep('payment');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                </Button>
            </div>

            <RadioGroup
                value={checkout.selectedAddressId?.toString()}
                onValueChange={(val) => selectAddress(Number(val))}
                className="grid gap-4 md:grid-cols-2"
            >
                {addresses.map((addr) => (
                    <div key={addr.id}>
                        <RadioGroupItem value={addr.id.toString()} id={`addr-${addr.id}`} className="peer sr-only" />
                        <Label
                            htmlFor={`addr-${addr.id}`}
                            className="flex flex-col gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {addr.name}
                                </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {addr.line1}<br />
                                {addr.city}, {addr.state} {addr.zip}<br />
                                {addr.country}
                            </div>
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <Button
                className="w-full md:w-auto"
                size="lg"
                disabled={!checkout.selectedAddressId}
                onClick={handleContinue}
            >
                Continue to Payment
            </Button>
        </div>
    );
}
