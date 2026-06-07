'use client';

import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SaleCampaignFilterProps {
    minPrice: number;
    maxPrice: number;
    currentPriceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    showInStockOnly: boolean;
    onShowInStockOnlyChange: (show: boolean) => void;
    onClearFilters: () => void;
    className?: string;
}

export function SaleCampaignFilter({
    minPrice,
    maxPrice,
    currentPriceRange,
    onPriceChange,
    showInStockOnly,
    onShowInStockOnlyChange,
    onClearFilters,
    className
}: SaleCampaignFilterProps) {
    return (
        <div className={`space-y-8 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold uppercase tracking-wider text-sm">Bộ lọc</h3>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-black"
                    onClick={onClearFilters}
                >
                    Xóa tất cả
                </Button>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase font-bold text-zinc-500">Khoảng giá</Label>
                </div>
                <Slider
                    defaultValue={[minPrice, maxPrice]}
                    value={[currentPriceRange[0], currentPriceRange[1]]}
                    min={minPrice}
                    max={maxPrice}
                    step={1000} // 1000 VND step
                    onValueChange={(val) => onPriceChange([val[0], val[1]])}
                    className="py-4"
                />
                <div className="flex items-center justify-between text-xs font-mono">
                    <span>{formatCurrency(currentPriceRange[0])}</span>
                    <span>{formatCurrency(currentPriceRange[1])}</span>
                </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-4">
                <Label className="text-xs uppercase font-bold text-zinc-500">Trạng thái</Label>
                <div className="flex items-center gap-x-2">
                    <Checkbox 
                        id="instock" 
                        checked={showInStockOnly}
                        onCheckedChange={(checked) => onShowInStockOnlyChange(checked as boolean)}
                    />
                    <label
                        htmlFor="instock"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                        Chỉ hiện sản phẩm còn hàng
                    </label>
                </div>
            </div>
        </div>
    );
}
