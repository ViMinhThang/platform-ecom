"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export function FilterPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [selectedRating, setSelectedRating] = useState<string>("");

    useEffect(() => {
        // Sync state with URL params on mount
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        if (minPrice && maxPrice) {
            setPriceRange([Number(minPrice), Number(maxPrice)]);
        }

        const minRating = searchParams.get("minRating");
        if (minRating) {
            setSelectedRating(minRating);
        }
    }, [searchParams]);

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", priceRange[0].toString());
        params.set("maxPrice", priceRange[1].toString());
        router.push(`?${params.toString()}`);
    };

    const handleRatingChange = (value: string) => {
        setSelectedRating(value);

        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("minRating", value);
        } else {
            params.delete("minRating");
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="space-y-4">
                    <Slider
                        defaultValue={[0, 10000000]}
                        max={50000000}
                        step={100000}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        onValueCommit={applyPriceFilter}
                    />
                    <div className="flex items-center justify-between text-sm">
                        <span>
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(priceRange[0])}
                        </span>
                        <span>
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(priceRange[1])}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-4">Minimum Rating</h3>
                <RadioGroup value={selectedRating} onValueChange={handleRatingChange}>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                            <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                            <Label
                                htmlFor={`rating-${rating}`}
                                className="flex items-center cursor-pointer"
                            >
                                <div className="flex items-center text-yellow-400 mr-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={
                                                i < rating ? "fill-current" : "text-muted-foreground"
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">& Up</span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}
