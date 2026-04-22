"use client";

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

export function SortPanel({ totalResults }: SortPanelProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSort = `${searchParams.get("sortBy") || "createdAt"}-${searchParams.get("sortOrder") || "desc"}`;

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split("-");
        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-labels">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                Hiển thị <span className="text-foreground">{totalResults}</span> kết quả
            </p>

            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 whitespace-nowrap">Sắp xếp:</span>
                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[200px] rounded-none border-foreground/10 bg-transparent text-[10px] font-bold uppercase tracking-widest h-10">
                        <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-foreground/10 font-labels">
                        <SelectItem value="createdAt-desc" className="text-[10px] font-bold uppercase tracking-widest">Mới nhất</SelectItem>
                        <SelectItem value="totalSold-desc" className="text-[10px] font-bold uppercase tracking-widest">Bán chạy nhất</SelectItem>
                        <SelectItem value="price-asc" className="text-[10px] font-bold uppercase tracking-widest">Giá: Thấp đến Cao</SelectItem>
                        <SelectItem value="price-desc" className="text-[10px] font-bold uppercase tracking-widest">Giá: Cao đến Thấp</SelectItem>
                        <SelectItem value="averageRating-desc" className="text-[10px] font-bold uppercase tracking-widest">Đánh giá cao nhất</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
