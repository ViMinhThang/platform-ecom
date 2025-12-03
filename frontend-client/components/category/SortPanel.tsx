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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{totalResults}</span> results
            </p>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt-desc">Newest</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="totalSold-desc">Best Selling</SelectItem>
                        <SelectItem value="averageRating-desc">Top Rated</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
