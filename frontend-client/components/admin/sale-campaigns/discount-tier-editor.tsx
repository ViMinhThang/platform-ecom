'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PlusIcon, TrashIcon, PercentIcon } from 'lucide-react';
import { SaleCampaignDiscountTier } from '@/types/sale-campaign';

interface DiscountTierEditorProps {
    tiers: SaleCampaignDiscountTier[];
    onChange: (tiers: SaleCampaignDiscountTier[]) => void;
    disabled?: boolean;
}

export function DiscountTierEditor({ tiers, onChange, disabled }: DiscountTierEditorProps) {
    const addTier = () => {
        const newTier: SaleCampaignDiscountTier = {
            minPrice: 0,
            maxPrice: 0,
            discountPercent: 10,
            sortOrder: tiers.length,
        };
        onChange([...tiers, newTier]);
    };

    const updateTier = (index: number, field: keyof SaleCampaignDiscountTier, value: number) => {
        const updated = [...tiers];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeTier = (index: number) => {
        const updated = tiers.filter((_, i) => i !== index);
        onChange(updated);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-base font-semibold">Khung giá giảm</Label>
                    <p className="text-sm text-muted-foreground">
                        Định nghĩa mức giảm giá theo khoảng giá sản phẩm
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTier}
                    disabled={disabled}
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Thêm khung
                </Button>
            </div>

            {tiers.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground">
                        <PercentIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Chưa có khung giá giảm nào</p>
                        <p className="text-xs">Nhấn "Thêm khung" để bắt đầu</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {tiers.map((tier, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                            <CardContent className="py-3 pl-5">
                                <div className="flex items-end gap-4">
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">
                                                Giá tối thiểu
                                            </Label>
                                            <Input
                                                type="number"
                                                value={tier.minPrice}
                                                onChange={(e) =>
                                                    updateTier(index, 'minPrice', Number(e.target.value))
                                                }
                                                disabled={disabled}
                                                placeholder="0"
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">
                                                Giá tối đa
                                            </Label>
                                            <Input
                                                type="number"
                                                value={tier.maxPrice}
                                                onChange={(e) =>
                                                    updateTier(index, 'maxPrice', Number(e.target.value))
                                                }
                                                disabled={disabled}
                                                placeholder="0"
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">
                                                Giảm (%)
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={99}
                                                    value={tier.discountPercent}
                                                    onChange={(e) =>
                                                        updateTier(index, 'discountPercent', Number(e.target.value))
                                                    }
                                                    disabled={disabled}
                                                    className="h-9 pr-8"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => removeTier(index)}
                                        disabled={disabled}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(tier.minPrice != null && tier.minPrice > 0 && tier.maxPrice != null && tier.maxPrice > 0) && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Sản phẩm từ {formatCurrency(tier.minPrice)} đến{' '}
                                        {formatCurrency(tier.maxPrice)} sẽ được giảm{' '}
                                        <span className="font-semibold text-primary">
                                            {tier.discountPercent}%
                                        </span>
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {tiers.length > 0 && (
                <p className="text-xs text-muted-foreground italic">
                    💡 Tips: Sản phẩm có giá không nằm trong bất kỳ khung nào sẽ không được áp dụng giảm giá.
                </p>
            )}
        </div>
    );
}
