'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X, Search } from 'lucide-react';
import { AddFlashSaleItemRequest, FlashSaleItem } from '@/types/flash-sale';
import { productService } from '@/lib/services/product-service';
import { productVariantService } from '@/lib/services/product-variant-service';
import { toast } from 'sonner';
import Image from 'next/image';

interface FlashSaleItemPickerProps {
    flashSaleId?: number;
    existingItems: FlashSaleItem[];
    onAddItems: (items: AddFlashSaleItemRequest[]) => Promise<void>;
    onRemoveItem: (itemId: number) => Promise<void>;
}

interface ProductSearchResult {
    id: number;
    name: string;
    slug: string;
    minPrice: number;
}

interface VariantSelection {
    variantId: number;
    productId: number;
    productName: string;
    sku: string;
    imageUrl: string | null;
    originalPrice: number;
    flashSalePrice: number;
    stockLimit: number;
}

export function FlashSaleItemPicker({
    flashSaleId,
    existingItems,
    onAddItems,
    onRemoveItem,
}: FlashSaleItemPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
    const [selectedItems, setSelectedItems] = useState<VariantSelection[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const response = await productService.getProducts({ search: searchQuery, size: 10 });
            setSearchResults(response.content.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                minPrice: p.minPrice,
            })));
        } catch (err) {
            toast.error('Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProduct = async (product: ProductSearchResult) => {
        try {
            const variants = await productVariantService.getProductVariants(product.id);
            if (variants.length === 0) {
                toast.error('This product has no variants');
                return;
            }

            // Add all variants from product
            const newItems: VariantSelection[] = variants
                .filter((v: any) => !existingItems.some(ei => ei.variantId === v.id))
                .filter((v: any) => !selectedItems.some(si => si.variantId === v.id))
                .map((v: any) => ({
                    variantId: v.id,
                    productId: product.id,
                    productName: product.name,
                    sku: v.sku,
                    imageUrl: v.imageUrl,
                    originalPrice: v.price,
                    flashSalePrice: Math.round(v.price * 0.8), // Default 20% off
                    stockLimit: Math.min(v.stock || 10, 10),
                }));

            if (newItems.length === 0) {
                toast.info('All variants from this product are already added');
                return;
            }

            setSelectedItems(prev => [...prev, ...newItems]);
            toast.success(`Added ${newItems.length} variant(s)`);
        } catch (err) {
            toast.error('Failed to fetch variants');
        }
    };

    const updateSelectedItem = (variantId: number, field: 'flashSalePrice' | 'stockLimit', value: number) => {
        setSelectedItems(prev =>
            prev.map(item =>
                item.variantId === variantId ? { ...item, [field]: value } : item
            )
        );
    };

    const removeSelectedItem = (variantId: number) => {
        setSelectedItems(prev => prev.filter(item => item.variantId !== variantId));
    };

    const handleAddItems = async () => {
        if (selectedItems.length === 0) {
            toast.error('No items selected');
            return;
        }

        const itemRequests: AddFlashSaleItemRequest[] = selectedItems.map((item, index) => ({
            variantId: item.variantId,
            flashSalePrice: item.flashSalePrice,
            stockLimit: item.stockLimit,
            sortOrder: index,
        }));

        await onAddItems(itemRequests);
        setSelectedItems([]);
        setIsDialogOpen(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <Card className="border-2 border-black rounded-none">
            <CardHeader className="border-b-2 border-black bg-zinc-100 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-black uppercase tracking-wider">
                    FLASH SALE ITEMS ({existingItems.length})
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white rounded-none font-bold">
                            <Plus className="mr-2 h-4 w-4" />
                            ADD PRODUCTS
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase">Add Products to Flash Sale</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Search */}
                            <div className="flex gap-2">
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="border-2 border-black rounded-none"
                                />
                                <Button onClick={handleSearch} disabled={loading} className="rounded-none">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="border-2 border-black">
                                    <div className="p-2 bg-zinc-100 font-bold text-xs uppercase">Search Results</div>
                                    <div className="divide-y-2 divide-black">
                                        {searchResults.map(product => (
                                            <div
                                                key={product.id}
                                                className="p-3 flex justify-between items-center hover:bg-zinc-50 cursor-pointer"
                                                onClick={() => handleSelectProduct(product)}
                                            >
                                                <div>
                                                    <div className="font-bold text-sm">{product.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        From {formatCurrency(product.minPrice)}
                                                    </div>
                                                </div>
                                                <Plus className="h-4 w-4" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected Items */}
                            {selectedItems.length > 0 && (
                                <div className="border-2 border-black">
                                    <div className="p-2 bg-primary text-white font-bold text-xs uppercase">
                                        Selected Items ({selectedItems.length})
                                    </div>
                                    <div className="divide-y divide-black">
                                        {selectedItems.map(item => (
                                            <div key={item.variantId} className="p-3 grid grid-cols-4 gap-2 items-center">
                                                <div className="col-span-2">
                                                    <div className="font-bold text-sm truncate">{item.productName}</div>
                                                    <div className="text-xs text-muted-foreground">{item.sku}</div>
                                                    <div className="text-xs">Original: {formatCurrency(item.originalPrice)}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px]">Sale Price</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.flashSalePrice}
                                                        onChange={(e) => updateSelectedItem(item.variantId, 'flashSalePrice', Number(e.target.value))}
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="flex items-end gap-2">
                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-[10px]">Stock</Label>
                                                        <Input
                                                            type="number"
                                                            value={item.stockLimit}
                                                            onChange={(e) => updateSelectedItem(item.variantId, 'stockLimit', Number(e.target.value))}
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeSelectedItem(item.variantId)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedItems.length > 0 && (
                                <Button onClick={handleAddItems} className="w-full rounded-none bg-black text-white font-bold">
                                    ADD {selectedItems.length} ITEM(S) TO FLASH SALE
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="p-0">
                {existingItems.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No items added yet. Click "Add Products" to add items to this flash sale.
                    </div>
                ) : (
                    <div className="divide-y divide-black">
                        {existingItems.map(item => (
                            <div key={item.id} className="p-4 flex items-center gap-4">
                                <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center border-2 border-black">
                                    {item.imageUrl ? (
                                        <Image src={item.imageUrl} alt="" width={64} height={64} className="object-cover" />
                                    ) : (
                                        <span className="text-xs text-muted-foreground">No image</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm">{item.productName}</div>
                                    <div className="text-xs text-muted-foreground">{item.variantSku}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs line-through text-muted-foreground">
                                        {formatCurrency(item.originalPrice)}
                                    </div>
                                    <div className="font-bold text-primary">{formatCurrency(item.flashSalePrice)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground">Stock</div>
                                    <div className="font-bold">{item.remainingStock}/{item.stockLimit}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground">Sold</div>
                                    <div className="font-bold">{item.soldCount}</div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveItem(item.id)}
                                    className="text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
