"use client";

import { useState, useEffect, useCallback } from "react";
import { productVariantService } from "@/lib/services/product-variant-service";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariantFormValues } from "@/types/product/product-variant";

const EMPTY_EXCLUDE_IDS: number[] = [];

function getVariantDisplayName(variant: VariantFormValues): string {
    if (variant.optionValues?.length > 0) {
        return variant.optionValues
            .flatMap(ov => (ov.productOptionValue?.displayValue || ov.productOptionValue?.value) ? [ov.productOptionValue?.displayValue || ov.productOptionValue?.value] : [])
            .join(", ") || "M\u1eb7c \u0111\u1ecbnh";
    }
    return "M\u1eb7c \u0111\u1ecbnh";
}

interface VariantComboboxProps {
    productId: number | null;
    value: VariantFormValues | null;
    onChange: (variant: VariantFormValues | null) => void;
    disabled?: boolean;
    excludeVariantIds?: number[];
}

export function VariantCombobox({ productId, value, onChange, disabled, excludeVariantIds = EMPTY_EXCLUDE_IDS }: VariantComboboxProps) {
    const [open, setOpen] = useState(false);
    const [variants, setVariants] = useState<VariantFormValues[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchVariants = useCallback(async (pid: number) => {
        setLoading(true);
        try {
            const result = await productVariantService.getProductVariants(pid);
            setVariants(result || []);
        } catch (error) {
            console.error("Failed to load variants", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const onProductIdChange = useCallback((pid: number | null) => {
        if (pid) {
            fetchVariants(pid);
        } else {
            setVariants([]);
            onChange(null);
        }
    }, [fetchVariants, onChange]);

    useEffect(() => {
        onProductIdChange(productId);
    }, [productId, onProductIdChange]);

    // Filter out variants that already have inventory
    const availableVariants = variants.filter(v => !excludeVariantIds.includes(v.id!));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled || !productId}
                >
                    {loading ? (
                        <><Loader2 className="mr-2 size-4 animate-spin" /> Đang tải…</>
                    ) : value ? (
                        <span className="truncate">
                            #{value.id} - {value.sku || getVariantDisplayName(value)}
                        </span>
                    ) : (
                        productId ? "Chọn biến thể..." : "Chọn sản phẩm trước"
                    )}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0">
                <Command>
                    <CommandInput placeholder="Tìm biến thể..." />
                    <CommandList>
                        <CommandEmpty>
                            {availableVariants.length === 0 && variants.length > 0
                                ? "Tất cả biến thể đã có kho hàng"
                                : "Không tìm thấy biến thể."}
                        </CommandEmpty>
                        <CommandGroup>
                            {availableVariants.map((variant) => (
                                <CommandItem
                                    key={variant.id}
                                    value={`${variant.id}-${variant.sku}`}
                                    onSelect={() => {
                                        onChange(variant);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 size-4",
                                            value?.id === variant.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>#{variant.id} - {variant.sku || getVariantDisplayName(variant)}</span>
                                        {variant.optionValues?.length > 0 && (
                                            <span className="text-xs text-muted-foreground">
                                                {variant.optionValues.map(ov =>
                                                    ov.productOptionValue?.displayValue || ov.productOptionValue?.value
                                                ).join(", ")}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
