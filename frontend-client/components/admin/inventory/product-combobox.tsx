"use client";

import { useState, useEffect } from "react";
import { productService } from "@/lib/services/product-service";
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
import { ProductRow } from "@/types/product/product";

interface ProductComboboxProps {
    value: ProductRow | null;
    onChange: (product: ProductRow | null) => void;
    disabled?: boolean;
}

export function ProductCombobox({ value, onChange, disabled }: ProductComboboxProps) {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const result = await productService.getProducts({ size: 100 });
            setProducts(result.content || []);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.id.toString().includes(search)
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải...</>
                    ) : value ? (
                        <span className="truncate">{value.name}</span>
                    ) : (
                        "Chọn sản phẩm..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Tìm sản phẩm..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
                        <CommandGroup>
                            {filteredProducts.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={`${product.id}-${product.name}`}
                                    onSelect={() => {
                                        onChange(product);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.id === product.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="truncate">#{product.id} - {product.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
