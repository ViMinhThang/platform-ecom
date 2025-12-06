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
                    <Package className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base">Stock Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        All items are well stocked! No alerts at this time.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-base text-amber-800 dark:text-amber-200">
                    Low Stock Alert ({items.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.slice(0, 5).map((item) => (
                    <div
                        key={item.variantId}
                        className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                                <TrendingDown className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    Variant #{item.variantId}
                                    {item.sku && (
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            {item.sku}
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {item.availableStock} available (threshold: {item.lowStockThreshold})
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
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {items.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                        And {items.length - 5} more items...
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
