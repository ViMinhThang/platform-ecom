'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type SortOption = 'price-asc' | 'price-desc' | 'discount-desc' | 'sold-count-desc';

interface SaleCampaignSortProps {
    value: SortOption;
    onValueChange: (value: SortOption) => void;
}

export function SaleCampaignSort({ value, onValueChange }: SaleCampaignSortProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap hidden sm:inline-block">Sắp xếp:</span>
            <Select value={value} onValueChange={(val) => onValueChange(val as SortOption)}>
                <SelectTrigger className="w-[180px] h-9 rounded-sm border-border focus:ring-primary/20 bg-background text-[11px] font-bold uppercase tracking-widest">
                    <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border shadow-xl">
                    <SelectItem value="sold-count-desc">Bán chạy nhất</SelectItem>
                    <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                    <SelectItem value="discount-desc">Giảm giá nhiều nhất</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
