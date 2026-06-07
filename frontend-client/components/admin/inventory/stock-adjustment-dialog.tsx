'use client';

import { useMemo, useState, useReducer } from 'react';
import {
    useAdjustStockMutation,
    useUpdateInventorySettingsMutation
} from '@/lib/store/admin';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Minus, Plus } from 'lucide-react';
import { InventoryDTO } from '@/types/inventory/inventory';

interface StockAdjustmentDialogProps {
    inventory: InventoryDTO | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StockAdjustmentDialog({
    inventory,
    open,
    onOpenChange,
}: StockAdjustmentDialogProps) {
    const [adjustStock, { isLoading: isAdjusting }] = useAdjustStockMutation();
    const [updateInventorySettings, { isLoading: isSavingSettings }] =
        useUpdateInventorySettingsMutation();

    const [form, setForm] = useReducer(
        (prev: any, next: any) => ({ ...prev, ...next }),
        {
            adjustmentType: 'add' as 'add' | 'subtract',
            quantity: 0,
            reason: '',
            lowStockThreshold: inventory?.lowStockThreshold ?? 0,
            reorderPoint: inventory?.reorderPoint ?? 0,
            reorderQuantity: inventory?.reorderQuantity ?? 0,
            trackInventory: inventory?.trackInventory ?? true,
        }
    );

    const hasStockAdjustment = form.quantity > 0;
    const hasSettingsChanges = Boolean(
        inventory &&
            (form.lowStockThreshold !== inventory.lowStockThreshold ||
                form.reorderPoint !== inventory.reorderPoint ||
                form.reorderQuantity !== inventory.reorderQuantity ||
                form.trackInventory !== inventory.trackInventory)
    );
    const isSaving = isAdjusting || isSavingSettings;

    const newStock = inventory
        ? form.adjustmentType === 'add'
            ? inventory.totalStock + form.quantity
            : inventory.totalStock - form.quantity
        : 0;

    const dialogDescription = useMemo(() => {
        if (!inventory) {
            return '';
        }

        return inventory.sku
            ? `Biến thể #${inventory.variantId} • SKU: ${inventory.sku}`
            : `Biến thể #${inventory.variantId}`;
    }, [inventory]);

    const resetForm = () => {
        if (inventory) {
            setForm({
                adjustmentType: 'add',
                quantity: 0,
                reason: '',
                lowStockThreshold: inventory.lowStockThreshold,
                reorderPoint: inventory.reorderPoint,
                reorderQuantity: inventory.reorderQuantity,
                trackInventory: inventory.trackInventory,
            });
        }
    };

    const handleSubmit = async () => {
        if (!inventory) {
            return;
        }

        if (!hasStockAdjustment && !hasSettingsChanges) {
            onOpenChange(false);
            return;
        }

        try {
            if (hasSettingsChanges) {
                await updateInventorySettings({
                    variantId: inventory.variantId,
                    request: {
                        ...(form.lowStockThreshold !== inventory.lowStockThreshold
                            ? { lowStockThreshold: form.lowStockThreshold }
                            : {}),
                        ...(form.reorderPoint !== inventory.reorderPoint
                            ? { reorderPoint: form.reorderPoint }
                            : {}),
                        ...(form.reorderQuantity !== inventory.reorderQuantity
                            ? { reorderQuantity: form.reorderQuantity }
                            : {}),
                        ...(form.trackInventory !== inventory.trackInventory
                            ? { trackInventory: form.trackInventory }
                            : {}),
                    },
                }).unwrap();
            }

            if (hasStockAdjustment) {
                const adjustment = form.adjustmentType === 'add' ? form.quantity : -form.quantity;
                await adjustStock({
                    variantId: inventory.variantId,
                    request: {
                        adjustment,
                        reason: form.reason || `Manual ${form.adjustmentType}`,
                        referenceType: 'MANUAL',
                    },
                }).unwrap();
            }

            toast.success('Đã cập nhật kho hàng', {
                description: hasStockAdjustment
                    ? `Đã ${form.adjustmentType === 'add' ? 'thêm' : 'trừ'} ${form.quantity} đơn vị và lưu cài đặt.`
                    : 'Đã lưu cài đặt kho hàng.',
            });

            onOpenChange(false);
            resetForm();
        } catch {
            toast.error('Lỗi', {
                description: 'Không thể cập nhật kho hàng',
            });
        }
    };

    const saveDisabled =
        isSaving ||
        (!hasSettingsChanges && !hasStockAdjustment) ||
        (hasStockAdjustment && newStock < 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa kho hàng</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted p-3">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Hiện tại</p>
                            <p className="text-2xl font-bold">{inventory?.totalStock ?? 0}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Thay đổi</p>
                            <p
                                className={`text-2xl font-bold ${
                                    form.adjustmentType === 'add' ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {hasStockAdjustment ? `${form.adjustmentType === 'add' ? '+' : '-'}${form.quantity}` : '0'}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Mới</p>
                            <p
                                className={`text-2xl font-bold ${
                                    hasStockAdjustment && newStock < 0 ? 'text-red-600' : ''
                                }`}
                            >
                                {hasStockAdjustment ? newStock : inventory?.totalStock ?? 0}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-lg border p-4">
                        <div>
                            <h3 className="font-medium">Cài đặt kho hàng</h3>
                            <p className="text-sm text-muted-foreground">
                                Cập nhật ngưỡng cảnh báo và hành vi theo dõi tồn kho.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="lowStockThreshold">Ngưỡng sắp hết hàng</Label>
                                <Input
                                    id="lowStockThreshold"
                                    type="number"
                                    min={0}
                                    value={form.lowStockThreshold}
                                    onChange={(e) =>
                                        setForm({ lowStockThreshold: Math.max(0, parseInt(e.target.value) || 0) })
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="reorderPoint">Điểm đặt hàng lại</Label>
                                <Input
                                    id="reorderPoint"
                                    type="number"
                                    min={0}
                                    value={form.reorderPoint}
                                    onChange={(e) =>
                                        setForm({ reorderPoint: Math.max(0, parseInt(e.target.value) || 0) })
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="reorderQuantity">Số lượng đặt hàng lại</Label>
                                <Input
                                    id="reorderQuantity"
                                    type="number"
                                    min={0}
                                    value={form.reorderQuantity}
                                    onChange={(e) =>
                                        setForm({ reorderQuantity: Math.max(0, parseInt(e.target.value) || 0) })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-md border px-3 py-2">
                                <div className="space-y-1">
                                    <Label htmlFor="trackInventory">Theo dõi kho</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Bật hoặc tắt việc theo dõi số lượng cho biến thể này.
                                    </p>
                                </div>
                                <Switch
                                    id="trackInventory"
                                    checked={form.trackInventory}
                                    onCheckedChange={(v) => setForm({ trackInventory: v })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-lg border p-4">
                        <div>
                            <h3 className="font-medium">Điều chỉnh tồn kho</h3>
                            <p className="text-sm text-muted-foreground">
                                Tùy chọn thêm hoặc giảm tồn kho hiện tại. Bỏ trống nếu chỉ cần lưu cài đặt.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label>Loại điều chỉnh</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={form.adjustmentType === 'add' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setForm({ adjustmentType: 'add' })}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Thêm tồn kho
                                </Button>
                                <Button
                                    type="button"
                                    variant={form.adjustmentType === 'subtract' ? 'destructive' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setForm({ adjustmentType: 'subtract' })}
                                >
                                    <Minus className="mr-2 size-4" />
                                    Giảm tồn kho
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Số lượng</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min={0}
                                value={form.quantity}
                                onChange={(e) => setForm({ quantity: Math.max(0, parseInt(e.target.value) || 0) })}
                                placeholder="Nhập số lượng"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reason">Lý do (tùy chọn)</Label>
                            <Textarea
                                id="reason"
                                value={form.reason}
                                onChange={(e) => setForm({ reason: e.target.value })}
                                placeholder="Ví dụ: Nhận hàng, Hàng hỏng, v.v."
                                rows={2}
                            />
                        </div>

                        {hasStockAdjustment && newStock < 0 && (
                            <p className="text-sm text-red-600">
                                Cảnh báo: Tồn kho không thể nhỏ hơn 0. Tối đa có thể giảm: {inventory?.totalStock ?? 0}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={saveDisabled}>
                        {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
