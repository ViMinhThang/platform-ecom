"use client";

import { useState, useEffect } from "react";
import { useCreateInventoryMutation } from "@/lib/store/admin";
import { ProductCombobox } from "./product-combobox";
import { VariantCombobox } from "./variant-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ProductRow } from "@/types/product/product";
import { VariantFormValues } from "@/types/product/product-variant";

interface CreateInventoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateInventoryDialog({ open, onOpenChange, onSuccess }: CreateInventoryDialogProps) {
    const [createInventory, { isLoading: isCreating }] = useCreateInventoryMutation();

    const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<VariantFormValues | null>(null);
    const [sku, setSku] = useState("");
    const [initialStock, setInitialStock] = useState("0");

    useEffect(() => {
        if (selectedVariant?.sku) {
            setSku(selectedVariant.sku);
        }
    }, [selectedVariant]);

    const resetForm = () => {
        setSelectedProduct(null);
        setSelectedVariant(null);
        setSku("");
        setInitialStock("0");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProduct || !selectedVariant) {
            toast.error("Vui lòng chọn sản phẩm và biến thể");
            return;
        }

        try {
            await createInventory({
                productId: selectedProduct.id,
                variantId: selectedVariant.id!,
                sku: sku || undefined,
                initialStock: parseInt(initialStock) || 0,
            }).unwrap();

            toast.success("Tạo kho hàng thành công");
            resetForm();
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Không thể tạo kho hàng");
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resetForm();
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạo kho hàng</DialogTitle>
                    <DialogDescription>
                        Chọn sản phẩm và biến thể để tạo kho hàng.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Sản phẩm</Label>
                            <div className="col-span-3">
                                <ProductCombobox
                                    value={selectedProduct}
                                    onChange={setSelectedProduct}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Biến thể</Label>
                            <div className="col-span-3">
                                <VariantCombobox
                                    productId={selectedProduct?.id ?? null}
                                    value={selectedVariant}
                                    onChange={setSelectedVariant}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sku" className="text-right">SKU</Label>
                            <Input
                                id="sku"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                className="col-span-3"
                                placeholder="Tự động từ biến thể"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="initialStock" className="text-right">Tồn kho ban đầu</Label>
                            <Input
                                id="initialStock"
                                type="number"
                                value={initialStock}
                                onChange={(e) => setInitialStock(e.target.value)}
                                className="col-span-3"
                                min="0"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isCreating || !selectedProduct || !selectedVariant}>
                            {isCreating ? "Đang tạo..." : "Tạo kho hàng"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
