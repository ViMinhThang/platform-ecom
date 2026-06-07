"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SortPanelProps {
    totalResults: number;
}

const SORT_OPTIONS = [
    { value: "createdAt-desc", label: "Mới nhất" },
    { value: "totalSold-desc", label: "Bán chạy nhất" },
    { value: "price-asc", label: "Giá: Thấp đến Cao" },
    { value: "price-desc", label: "Giá: Cao đến Thấp" },
    { value: "averageRating-desc", label: "Đánh giá cao nhất" },
] as const;

function SortPanelContent({ totalResults }: SortPanelProps) {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const get = searchParams.get.bind(searchParams);
    const toString = searchParams.toString.bind(searchParams);

    const sortBy = get("sortBy") || "createdAt";
    const sortOrder = get("sortOrder") || "desc";
    const currentSort = `${sortBy}-${sortOrder}`;

    const currentLabel =
        SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Mới nhất";

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split("-");
        const params = new URLSearchParams(toString());
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-labels">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
                Hiển thị{" "}
                <span className="text-foreground text-[11px]">{totalResults}</span> kết quả
            </p>

            <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/30 whitespace-nowrap">
                    Sắp xếp:
                </span>
                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px] sm:w-[200px] rounded-sm border-foreground/10 bg-transparent text-[10px] font-semibold uppercase tracking-widest h-9 px-3 data-[placeholder]:text-foreground/40 transition-colors duration-150 hover:border-foreground/20 focus:border-foreground/30">
                        <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-foreground/10 font-labels min-w-[180px]">
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-[10px] font-semibold uppercase tracking-widest data-[state=checked]:text-foreground data-[highlighted]:bg-foreground/5"
                            >
                                <span className="flex items-center gap-2">
                                    {option.label}
                                    {option.value === currentSort && (
                                        <span className="size-1.5 rounded-full bg-foreground/30" />
                                    )}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export function SortPanel(props: SortPanelProps) {
    return (
        <Suspense fallback={<div className="h-10 animate-pulse bg-secondary/40 rounded-sm" />}>
            <SortPanelContent {...props} />
        </Suspense>
    );
}
