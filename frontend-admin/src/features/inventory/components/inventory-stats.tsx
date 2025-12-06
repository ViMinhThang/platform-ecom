'use client';

import { InventoryDTO } from '@/lib/services/inventory-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, Clock, BarChart3 } from 'lucide-react';

interface InventoryStatsProps {
    items: InventoryDTO[];
    lowStockCount: number;
    loading?: boolean;
}

export function InventoryStats({ items, lowStockCount, loading }: InventoryStatsProps) {
    const totalStock = items.reduce((sum, item) => sum + item.totalStock, 0);
    const totalAvailable = items.reduce((sum, item) => sum + item.availableStock, 0);
    const totalReserved = items.reduce((sum, item) => sum + item.reservedStock, 0);

    const stats = [
        {
            title: 'Total Items',
            value: items.length,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900',
        },
        {
            title: 'Total Stock',
            value: totalStock.toLocaleString(),
            icon: BarChart3,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900',
        },
        {
            title: 'Reserved',
            value: totalReserved.toLocaleString(),
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900',
        },
        {
            title: 'Low Stock',
            value: lowStockCount,
            icon: AlertTriangle,
            color: lowStockCount > 0 ? 'text-amber-600' : 'text-green-600',
            bgColor: lowStockCount > 0 ? 'bg-amber-100 dark:bg-amber-900' : 'bg-green-100 dark:bg-green-900',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? '-' : stat.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
