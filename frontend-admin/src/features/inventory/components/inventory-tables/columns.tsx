'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InventoryDTO } from '@/types/inventory/inventory';
import { ArrowUpDown, AlertTriangle, Edit } from 'lucide-react';

export const columns: ColumnDef<InventoryDTO>[] = [
    {
        accessorKey: 'variantId',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Variant ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-mono text-sm">#{row.getValue('variantId')}</span>
        ),
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => (
            <span className="font-mono text-sm">
                {row.getValue('sku') || '-'}
            </span>
        ),
    },
    {
        accessorKey: 'availableStock',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Available
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const available = row.getValue('availableStock') as number;
            const isLow = row.original.isLowStock;
            return (
                <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                        {available}
                    </span>
                    {isLow && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                </div>
            );
        },
    },
    {
        accessorKey: 'reservedStock',
        header: 'Reserved',
        cell: ({ row }) => (
            <Badge variant="secondary" className="font-mono">
                {row.getValue('reservedStock')}
            </Badge>
        ),
    },
    {
        accessorKey: 'totalStock',
        header: 'Total',
        cell: ({ row }) => (
            <span className="font-semibold">{row.getValue('totalStock')}</span>
        ),
    },
    {
        accessorKey: 'lowStockThreshold',
        header: 'Threshold',
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.getValue('lowStockThreshold')}
            </span>
        ),
    },
    {
        accessorKey: 'trackInventory',
        header: 'Tracking',
        cell: ({ row }) => {
            const tracked = row.getValue('trackInventory') as boolean;
            return (
                <Badge variant={tracked ? 'default' : 'outline'}>
                    {tracked ? 'Active' : 'Disabled'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        const event = new CustomEvent('inventory-edit', {
                            detail: row.original,
                        });
                        window.dispatchEvent(event);
                    }}
                >
                    <Edit className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
