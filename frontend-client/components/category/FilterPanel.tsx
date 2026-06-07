"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Suspense, useState, useEffect, useCallback, useMemo, useReducer } from "react";
import {
    Star,
    X,
    ChevronDown,
    RotateCcw,
    GripVertical,
} from "lucide-react";
import { useGetTopSellersQuery } from "@/lib/store/api/clientApi";
import { formatCurrency } from "@/lib/utils";

const PRICE_PRESETS = [
    { label: "Dưới 100K", min: 0, max: 100000 },
    { label: "100K - 500K", min: 100000, max: 500000 },
    { label: "500K - 1Tr", min: 500000, max: 1000000 },
    { label: "1Tr - 5Tr", min: 1000000, max: 5000000 },
    { label: "Trên 5Tr", min: 5000000, max: 50000000 },
];

const formatVietnameseNumber = (value: string): string => {
    const num = Number(value.replace(/\./g, ""));
    if (isNaN(num)) return value;
    return num.toLocaleString("vi-VN");
};

const RATINGS = [5, 4, 3, 2, 1];

function SectionHeader({
    title,
    isOpen,
    onToggle,
    children,
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <Collapsible open={isOpen} onOpenChange={onToggle}>
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full py-3 group cursor-pointer">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
                        {title}
                    </span>
                    <ChevronDown
                        className={`size-3 text-foreground/30 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pb-2">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

interface FilterPanelProps {
    categorySlug?: string;
    onFilterChange?: () => void;
}

interface FilterState {
    priceRange: [number, number];
    minPriceInput: string;
    maxPriceInput: string;
    selectedRating: string;
    inStockOnly: boolean;
    selectedSellers: number[];
}

function FilterPanelContent({ categorySlug, onFilterChange }: FilterPanelProps) {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const get = useMemo(() => searchParams.get.bind(searchParams), [searchParams]);
    const toString = useMemo(() => searchParams.toString.bind(searchParams), [searchParams]);

    const [sectionsOpen, setSectionsOpen] = useState({
        price: true,
        status: true,
        rating: true,
        sellers: true,
    });

    const [filter, setFilter] = useReducer(
        (prev: FilterState, next: Partial<FilterState>) => ({ ...prev, ...next }),
        {
            priceRange: [0, 50000000] as [number, number],
            minPriceInput: "0",
            maxPriceInput: "50000000",
            selectedRating: "",
            inStockOnly: false,
            selectedSellers: [] as number[],
        } as FilterState
    );
    const [focusedInput, setFocusedInput] = useState<"min" | "max" | null>(null);

    const { data: topSellers } = useGetTopSellersQuery(
        { categorySlug: categorySlug || "", limit: 10 },
        { skip: !categorySlug }
    );

    useEffect(() => {
        const minPrice = get("minPrice");
        const maxPrice = get("maxPrice");
        const minRating = get("minRating");
        const inStock = get("inStock") === "true";
        const sellerIds = get("sellerIds")
            ? get("sellerIds")?.split(",").map(Number)
            : [];

        if (minPrice && maxPrice) {
            setFilter({ priceRange: [Number(minPrice), Number(maxPrice)], minPriceInput: minPrice, maxPriceInput: maxPrice });
        } else {
            setFilter({ priceRange: [0, 50000000], minPriceInput: "0", maxPriceInput: "50000000" });
        }

        setFilter({ selectedRating: minRating || "", inStockOnly: inStock, selectedSellers: sellerIds || [] });
    }, [get]);

    const emitChange = useCallback(() => {
        onFilterChange?.();
    }, [onFilterChange]);

    const updateURL = useCallback((params: URLSearchParams) => {
        push(`?${params.toString()}`, { scroll: false });
        emitChange();
    }, [push, emitChange]);

    const handlePriceSliderChange = (value: number[]) => {
        setFilter({ priceRange: value as [number, number], minPriceInput: value[0].toString(), maxPriceInput: value[1].toString() });
    };

    const handlePriceCommit = useCallback(() => {
        const params = new URLSearchParams(toString());
        params.set("minPrice", filter.priceRange[0].toString());
        params.set("maxPrice", filter.priceRange[1].toString());
        updateURL(params);
    }, [filter.priceRange, toString, updateURL]);

    const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setFilter({ minPriceInput: raw });
    };

    const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setFilter({ maxPriceInput: raw });
    };

    const minDisplay = focusedInput === "min" ? filter.minPriceInput : formatVietnameseNumber(filter.minPriceInput);
    const maxDisplay = focusedInput === "max" ? filter.maxPriceInput : formatVietnameseNumber(filter.maxPriceInput);

    const applyPriceFilter = useCallback(() => {
        const params = new URLSearchParams(toString());
        const min = Number(filter.minPriceInput);
        const max = Number(filter.maxPriceInput);
        params.set("minPrice", min.toString());
        params.set("maxPrice", max.toString());
        setFilter({ priceRange: [min, max] as [number, number] });
        updateURL(params);
    }, [filter.minPriceInput, filter.maxPriceInput, toString, updateURL]);

    const handlePresetClick = (preset: typeof PRICE_PRESETS[number]) => {
        const params = new URLSearchParams(toString());
        params.set("minPrice", preset.min.toString());
        params.set("maxPrice", preset.max.toString());
        setFilter({ priceRange: [preset.min, preset.max] as [number, number], minPriceInput: preset.min.toString(), maxPriceInput: preset.max.toString() });
        updateURL(params);
    };

    const handleRatingChange = (value: string) => {
        setFilter({ selectedRating: value });
        const params = new URLSearchParams(toString());
        if (value) {
            params.set("minRating", value);
        } else {
            params.delete("minRating");
        }
        updateURL(params);
    };

    const handleInStockChange = (checked: boolean) => {
        setFilter({ inStockOnly: checked });
        const params = new URLSearchParams(toString());
        if (checked) {
            params.set("inStock", "true");
        } else {
            params.delete("inStock");
        }
        updateURL(params);
    };

    const handleSellerToggle = (sellerId: number) => {
        const updatedSellers = filter.selectedSellers.includes(sellerId)
            ? filter.selectedSellers.filter((id) => id !== sellerId)
            : [...filter.selectedSellers, sellerId];

        setFilter({ selectedSellers: updatedSellers });
        const params = new URLSearchParams(toString());
        if (updatedSellers.length > 0) {
            params.set("sellerIds", updatedSellers.join(","));
        } else {
            params.delete("sellerIds");
        }
        updateURL(params);
    };

    const clearAllFilters = () => {
        push(window.location.pathname);
        emitChange();
    };

    const activeFilterCount = [
        get("minPrice") && get("maxPrice"),
        get("inStock"),
        get("minRating"),
        get("sellerIds"),
    ].filter(Boolean).length;

    const toggleSection = (section: keyof typeof sectionsOpen) => {
        setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="space-y-2 font-labels">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-foreground/5">
                <div className="flex items-center gap-2">
                    <GripVertical className="size-3 text-foreground/20" />
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/40">
                        Bộ lọc
                    </h2>
                    {activeFilterCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="size-4 p-0 flex items-center justify-center text-[8px] font-semibold rounded-full"
                        >
                            {activeFilterCount}
                        </Badge>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-primary/70 hover:text-primary transition-colors"
                    >
                        <RotateCcw className="size-2.5" />
                        Xóa hết
                    </button>
                )}
            </div>

            {/* Price Range */}
            <div className="border-b border-foreground/5">
                <SectionHeader title="Khoảng giá" isOpen={sectionsOpen.price} onToggle={() => toggleSection("price")}>
                    <div className="space-y-4 pt-1">
                        {/* Price Presets */}
                        <div className="flex flex-wrap gap-1.5">
                            {PRICE_PRESETS.map((preset) => {
                                const isActive =
                                    Number(get("minPrice") || "0") === preset.min &&
                                    Number(get("maxPrice") || "50000000") === preset.max;
                                return (
                                    <button
                                        key={preset.label}
                                        onClick={() => handlePresetClick(preset)}
                                        className={`text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1.5 rounded-sm border transition-all duration-150 ${
                                            isActive
                                                ? "bg-foreground text-background border-foreground"
                                                : "bg-transparent text-foreground/50 border-foreground/10 hover:border-foreground/30 hover:text-foreground/70"
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>

                        <Slider
                            max={50000000}
                            step={100000}
                            value={filter.priceRange}
                            onValueChange={handlePriceSliderChange}
                            onValueCommit={handlePriceCommit}
                        />

                        <div className="flex items-center justify-between gap-3">
                            <div className="relative flex-1">
                                <Input
                                    value={minDisplay}
                                    onChange={handleMinPriceInputChange}
                                    onFocus={() => setFocusedInput("min")}
                                    onBlur={() => { setFocusedInput(null); applyPriceFilter(); }}
                                    className="h-9 text-[10px] rounded-sm border-foreground/10 bg-transparent pr-7 font-header"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-foreground/30 font-semibold">
                                    ₫
                                </span>
                            </div>
                            <span className="text-[8px] text-foreground/30 font-semibold tracking-widest uppercase px-1">
                                –
                            </span>
                            <div className="relative flex-1">
                                <Input
                                    value={maxDisplay}
                                    onChange={handleMaxPriceInputChange}
                                    onFocus={() => setFocusedInput("max")}
                                    onBlur={() => { setFocusedInput(null); applyPriceFilter(); }}
                                    className="h-9 text-[10px] rounded-sm border-foreground/10 bg-transparent pr-7 font-header"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-foreground/30 font-semibold">
                                    ₫
                                </span>
                            </div>
                        </div>

                        <div className="text-[9px] text-foreground/50 font-semibold tracking-wider text-center">
                            {formatCurrency(filter.priceRange[0])} – {formatCurrency(filter.priceRange[1])}
                        </div>
                    </div>
                </SectionHeader>
            </div>

            {/* Availability */}
            <div className="border-b border-foreground/5">
                <SectionHeader title="Trạng thái" isOpen={sectionsOpen.status} onToggle={() => toggleSection("status")}>
                    <div className="flex items-center gap-3 pt-1 pb-1">
                        <Checkbox
                            id="inStock"
                            checked={filter.inStockOnly}
                            onCheckedChange={handleInStockChange}
                            className="rounded-sm border-foreground/10 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground transition-all duration-150"
                        />
                        <Label
                            htmlFor="inStock"
                            className="text-[11px] font-semibold uppercase tracking-widest text-foreground/60 cursor-pointer select-none"
                        >
                            Chỉ xem còn hàng
                        </Label>
                    </div>
                </SectionHeader>
            </div>

            {/* Rating */}
            <div className="border-b border-foreground/5">
                <SectionHeader title="Đánh giá" isOpen={sectionsOpen.rating} onToggle={() => toggleSection("rating")}>
                    <RadioGroup
                        value={filter.selectedRating}
                        onValueChange={handleRatingChange}
                        className="space-y-2 pt-1"
                    >
                        {RATINGS.map((rating) => (
                            <div
                                key={rating}
                                className="flex items-center gap-3 group cursor-pointer"
                            >
                                <RadioGroupItem
                                    value={rating.toString()}
                                    id={`rating-${rating}`}
                                    className="rounded-full border-foreground/20 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground transition-all duration-150"
                                />
                                <Label
                                    htmlFor={`rating-${rating}`}
                                    className="flex items-center cursor-pointer flex-1"
                                >
                                    <div className="flex items-center text-amber-500 mr-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={11}
                                                className={
                                                    i < rating
                                                        ? "fill-amber-500 text-amber-500"
                                                        : "text-foreground/10"
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground/40 group-hover:text-foreground/70 transition-colors">
                                        {rating === 5 ? "Tối đa" : `${rating} trở lên`}
                                    </span>
                                </Label>
                            </div>
                        ))}
                        <div className="flex items-center gap-3 pt-1">
                            <RadioGroupItem
                                value=""
                                id="rating-all"
                                className="rounded-full border-foreground/20 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground transition-all duration-150"
                            />
                            <Label
                                htmlFor="rating-all"
                                className="text-[9px] font-semibold uppercase tracking-widest text-foreground/30 cursor-pointer hover:text-foreground/70 transition-colors"
                            >
                                Tất cả
                            </Label>
                        </div>
                    </RadioGroup>
                </SectionHeader>
            </div>

            {/* Sellers */}
            {topSellers && topSellers.length > 0 && (
                <div className="border-b border-foreground/5">
                    <SectionHeader title="Nhà bán hàng" isOpen={sectionsOpen.sellers} onToggle={() => toggleSection("sellers")}>
                        <div className="space-y-2 pt-1 max-h-48 overflow-y-auto scrollbar-thin">
                            {topSellers.map((seller) => (
                                <div
                                    key={seller.sellerId}
                                    className="flex items-center gap-3"
                                >
                                    <Checkbox
                                        id={`seller-${seller.sellerId}`}
                                        checked={filter.selectedSellers.includes(seller.sellerId)}
                                        onCheckedChange={() =>
                                            handleSellerToggle(seller.sellerId)
                                        }
                                        className="rounded-sm border-foreground/10 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground transition-all duration-150"
                                    />
                                    <Label
                                        htmlFor={`seller-${seller.sellerId}`}
                                        className="text-[11px] font-semibold uppercase tracking-widest text-foreground/60 cursor-pointer flex-1 truncate hover:text-foreground/80 transition-colors"
                                    >
                                        {seller.sellerName}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </SectionHeader>
                </div>
            )}

            {/* Apply Button for mobile consistency */}
            <div className="pt-4 pb-2">
                <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    size="sm"
                    className="w-full rounded-sm border-foreground/10 text-[9px] font-semibold uppercase tracking-widest h-9 text-foreground/50 hover:text-foreground transition-all"
                >
                    <RotateCcw className="size-3 mr-1.5" />
                    Đặt lại bộ lọc
                </Button>
            </div>
        </div>
    );
}

export function FilterPanel(props: FilterPanelProps) {
    return (
        <Suspense fallback={<div className="w-72 h-96 animate-pulse bg-secondary/10 rounded-sm" />}>
            <FilterPanelContent {...props} />
        </Suspense>
    );
}
