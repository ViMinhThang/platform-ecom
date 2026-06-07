"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ActiveFilterBarProps {
    onFilterChange?: () => void;
}

function ActiveFilterBarContent({ onFilterChange }: ActiveFilterBarProps) {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const get = searchParams.get.bind(searchParams);
    const toString = searchParams.toString.bind(searchParams);

    const filters: { label: string; onRemove: () => void }[] = [];

    const minPrice = get("minPrice");
    const maxPrice = get("maxPrice");
    if (minPrice && maxPrice && (Number(minPrice) > 0 || Number(maxPrice) < 50000000)) {
        filters.push({
            label: `${formatCurrency(Number(minPrice))} - ${formatCurrency(Number(maxPrice))}`,
            onRemove: () => {
                const params = new URLSearchParams(toString());
                params.delete("minPrice");
                params.delete("maxPrice");
                push(`?${params.toString()}`);
                onFilterChange?.();
            },
        });
    }

    const inStock = get("inStock");
    if (inStock === "true") {
        filters.push({
            label: "Còn hàng",
            onRemove: () => {
                const params = new URLSearchParams(toString());
                params.delete("inStock");
                push(`?${params.toString()}`);

                onFilterChange?.();
            },
        });
    }

    const minRating = get("minRating");
    if (minRating) {
        filters.push({
            label: `≥ ${minRating} sao`,
            onRemove: () => {
                const params = new URLSearchParams(toString());
                params.delete("minRating");
                push(`?${params.toString()}`);
                onFilterChange?.();
            },
        });
    }

    const sellerIds = get("sellerIds");
    if (sellerIds) {
        const count = sellerIds.split(",").length;
        filters.push({
            label: `${count} nhà bán`,
            onRemove: () => {
                const params = new URLSearchParams(toString());
                params.delete("sellerIds");
                push(`?${params.toString()}`);
                onFilterChange?.();
            },
        });
    }

    if (filters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/30 mr-1">
                Bộ lọc:
            </span>
            {filters.map((filter) => (
                <button
                    key={filter.label}
                    onClick={filter.onRemove}
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 hover:border-foreground/20 rounded-sm transition-all duration-150 cursor-pointer"
                >
                    <span className="text-foreground/70 group-hover:text-foreground transition-colors">
                        {filter.label}
                    </span>
                    <X className="size-2.5 text-foreground/30 group-hover:text-foreground/60 transition-colors" />
                </button>
            ))}
            <button
                onClick={() => {
                    push(window.location.pathname);
                    onFilterChange?.();
                }}
                className="text-[9px] font-semibold uppercase tracking-widest text-primary/60 hover:text-primary underline underline-offset-2 transition-colors ml-1 cursor-pointer"
            >
                Xóa tất cả
            </button>
        </div>
    );
}

export function ActiveFilterBar(props: ActiveFilterBarProps) {
    return (
        <React.Suspense fallback={null}>
            <ActiveFilterBarContent {...props} />
        </React.Suspense>
    );
}
