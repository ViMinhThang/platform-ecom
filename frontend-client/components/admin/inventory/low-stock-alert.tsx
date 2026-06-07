'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, TrendingDown, Edit } from 'lucide-react';
import { InventoryDTO } from '@/types/inventory/inventory';

interface LowStockAlertProps {
    items: InventoryDTO[];
    onAdjust: (item: InventoryDTO) => void;
}

export function LowStockAlert({ items, onAdjust }: LowStockAlertProps) {
    if (items.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Package className="size-5 text-green-600" />
                    <CardTitle className="text-base">Tình trạng kho</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Tất cả sản phẩm đều có sẵn! Không có cảnh báo nào.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <AlertTriangle className="size-5 text-amber-600" />
                <CardTitle className="text-base text-amber-800 dark:text-amber-200">
                    Cảnh báo tồn kho thấp ({items.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.slice(0, 5).map((item) => (
                    <div
                        key={item.variantId}
                        className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-800"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                                <TrendingDown className="size-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    Biến thể #{item.variantId}
                                    {item.sku && (
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            {item.sku}
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {item.availableStock} có sẵn (ngưỡng: {item.lowStockThreshold})
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="font-mono">
                                {item.availableStock}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onAdjust(item)}
                            >
                                <Edit className="size-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {items.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                        Và {items.length - 5} mục khác…
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
