"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { useGetTopSellersQuery } from "@/lib/store/api/clientApi";

interface FilterPanelProps {
    categorySlug?: string;
}

export function FilterPanel({ categorySlug }: FilterPanelProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [minPriceInput, setMinPriceInput] = useState("0");
    const [maxPriceInput, setMaxPriceInput] = useState("10000000");
    const [selectedRating, setSelectedRating] = useState<string>("");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedSellers, setSelectedSellers] = useState<number[]>([]);

    const { data: topSellers } = useGetTopSellersQuery(
        { categorySlug: categorySlug || "", limit: 10 },
        { skip: !categorySlug }
    );

    useEffect(() => {
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        if (minPrice && maxPrice) {
            setPriceRange([Number(minPrice), Number(maxPrice)]);
            setMinPriceInput(minPrice);
            setMaxPriceInput(maxPrice);
        }

        const minRating = searchParams.get("minRating");
        if (minRating) {
            setSelectedRating(minRating);
        }

        const inStock = searchParams.get("inStock") === "true";
        setInStockOnly(inStock);

        const sellerIds = searchParams.get("sellerIds")
            ? searchParams.get("sellerIds")?.split(",").map(Number)
            : [];
        setSelectedSellers(sellerIds || []);
    }, [searchParams]);

    const handlePriceSliderChange = (value: number[]) => {
        setPriceRange(value);
        setMinPriceInput(value[0].toString());
        setMaxPriceInput(value[1].toString());
    };

    const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        setMinPriceInput(val);
    };

    const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        setMaxPriceInput(val);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        const min = Number(minPriceInput);
        const max = Number(maxPriceInput);
        params.set("minPrice", min.toString());
        params.set("maxPrice", max.toString());
        setPriceRange([min, max]);
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

    const handleInStockChange = (checked: boolean) => {
        setInStockOnly(checked);
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set("inStock", "true");
        } else {
            params.delete("inStock");
        }
        router.push(`?${params.toString()}`);
    };

    const handleSellerToggle = (sellerId: number) => {
        const updatedSellers = selectedSellers.includes(sellerId)
            ? selectedSellers.filter((id) => id !== sellerId)
            : [...selectedSellers, sellerId];
        
        setSelectedSellers(updatedSellers);
        const params = new URLSearchParams(searchParams.toString());
        if (updatedSellers.length > 0) {
            params.set("sellerIds", updatedSellers.join(","));
        } else {
            params.delete("sellerIds");
        }
        router.push(`?${params.toString()}`);
    };

    const clearAllFilters = () => {
        router.push(window.location.pathname);
    };

    return (
        <div className="space-y-12 font-labels">
            {/* Header: Title and Clear */}
            <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40">Bộ lọc</h2>
                {(searchParams.toString() !== "" && searchParams.toString() !== "page=0") && (
                    <button 
                        onClick={clearAllFilters}
                        className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity flex items-center gap-2"
                    >
                        Xóa hết
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Price Range */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Khoảng giá</h3>
                <div className="space-y-8">
                    <Slider
                        max={50000000}
                        step={100000}
                        value={priceRange}
                        onValueChange={handlePriceSliderChange}
                        onValueCommit={applyPriceFilter}
                        className="py-4"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Từ</Label>
                            <div className="relative">
                                <Input 
                                    value={minPriceInput}
                                    onChange={handleMinPriceInputChange}
                                    onBlur={applyPriceFilter}
                                    className="h-10 text-[11px] rounded-none border-foreground/10 bg-transparent pr-8 font-header"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-foreground/30">₫</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Đến</Label>
                            <div className="relative">
                                <Input 
                                    value={maxPriceInput}
                                    onChange={handleMaxPriceInputChange}
                                    onBlur={applyPriceFilter}
                                    className="h-10 text-[11px] rounded-none border-foreground/10 bg-transparent pr-8 font-header"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-foreground/30">₫</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Trạng thái</h3>
                <div className="flex items-center space-x-3">
                    <Checkbox 
                        id="inStock" 
                        checked={inStockOnly} 
                        onCheckedChange={handleInStockChange}
                        className="rounded-none border-foreground/10 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                    />
                    <Label 
                        htmlFor="inStock" 
                        className="text-[11px] font-bold uppercase tracking-widest text-foreground/60 cursor-pointer select-none"
                    >
                        Chỉ xem còn hàng
                    </Label>
                </div>
            </div>

            {/* Rating */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Đánh giá</h3>
                <RadioGroup value={selectedRating} onValueChange={handleRatingChange} className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3 group cursor-pointer">
                            <RadioGroupItem 
                                value={rating.toString()} 
                                id={`rating-${rating}`} 
                                className="rounded-none border-foreground/10 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                            />
                            <Label
                                htmlFor={`rating-${rating}`}
                                className="flex items-center cursor-pointer flex-1"
                            >
                                <div className="flex items-center text-primary mr-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={
                                                i < rating ? "fill-current" : "text-foreground/10"
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors">
                                    {rating === 5 ? "Tối đa" : "trở lên"}
                                </span>
                            </Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-3 pt-2">
                         <RadioGroupItem 
                                value="" 
                                id="rating-all" 
                                className="rounded-none border-foreground/10 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                            />
                        <Label htmlFor="rating-all" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 cursor-pointer">Tất cả</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Sellers */}
            {topSellers && topSellers.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Nhà bán hàng</h3>
                    <div className="space-y-3">
                        {topSellers.map((seller) => (
                            <div key={seller.sellerId} className="flex items-center space-x-3">
                                <Checkbox 
                                    id={`seller-${seller.sellerId}`} 
                                    checked={selectedSellers.includes(seller.sellerId)}
                                    onCheckedChange={() => handleSellerToggle(seller.sellerId)}
                                    className="rounded-none border-foreground/10 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                                />
                                <Label 
                                    htmlFor={`seller-${seller.sellerId}`} 
                                    className="text-[11px] font-bold uppercase tracking-widest text-foreground/60 cursor-pointer flex-1 truncate"
                                >
                                    {seller.sellerName}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
