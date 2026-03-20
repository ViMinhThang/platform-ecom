'use client';

import { useState } from 'react';
import { useAdjustStockMutation } from '@/lib/store/admin';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, Minus } from 'lucide-react';
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

    const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
    const [quantity, setQuantity] = useState<number>(0);
    const [reason, setReason] = useState('');

    const handleSubmit = async () => {
        if (!inventory || quantity <= 0) return;

        try {
            const adjustment = adjustmentType === 'add' ? quantity : -quantity;
            await adjustStock({
                variantId: inventory.variantId,
                request: {
                    adjustment,
                    reason: reason || `Manual ${adjustmentType}`,
                    referenceType: 'MANUAL',
                },
            }).unwrap();

            toast.success('Stock Adjusted', {
                description: `Successfully ${adjustmentType === 'add' ? 'added' : 'removed'} ${quantity} units.`,
            });
            onOpenChange(false);
            resetForm();
        } catch (error) {
            toast.error('Error', {
                description: 'Failed to adjust stock',
            });
        }
    };

    const resetForm = () => {
        setQuantity(0);
        setReason('');
        setAdjustmentType('add');
    };

    const newStock = inventory
        ? adjustmentType === 'add'
            ? inventory.totalStock + quantity
            : inventory.totalStock - quantity
        : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adjust Stock</DialogTitle>
                    <DialogDescription>
                        {inventory && (
                            <>
                                Variant #{inventory.variantId}
                                {inventory.sku && ` • SKU: ${inventory.sku}`}
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted p-3">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Current</p>
                            <p className="text-2xl font-bold">{inventory?.totalStock ?? 0}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Change</p>
                            <p className={`text-2xl font-bold ${adjustmentType === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                                {adjustmentType === 'add' ? '+' : '-'}{quantity}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">New</p>
                            <p className={`text-2xl font-bold ${newStock < 0 ? 'text-red-600' : ''}`}>
                                {newStock}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Adjustment Type</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={adjustmentType === 'add' ? 'default' : 'outline'}
                                className="flex-1"
                                onClick={() => setAdjustmentType('add')}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Stock
                            </Button>
                            <Button
                                type="button"
                                variant={adjustmentType === 'subtract' ? 'destructive' : 'outline'}
                                className="flex-1"
                                onClick={() => setAdjustmentType('subtract')}
                            >
                                <Minus className="mr-2 h-4 w-4" />
                                Remove Stock
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min={0}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                            placeholder="Enter quantity"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason (optional)</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Received shipment, Damaged goods, etc."
                            rows={2}
                        />
                    </div>

                    {newStock < 0 && (
                        <p className="text-sm text-red-600">
                            Warning: Stock cannot go below 0. Maximum removable: {inventory?.totalStock ?? 0}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isAdjusting || quantity <= 0 || newStock < 0}
                    >
                        {isAdjusting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Adjustment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
