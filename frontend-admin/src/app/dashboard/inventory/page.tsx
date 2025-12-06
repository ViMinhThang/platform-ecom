'use client';

import { useEffect, useState, useCallback } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageContainer from '@/components/layout/page-container';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchInventory,
    fetchLowStockItems,
    clearCurrentInventory,
} from '@/lib/store/slices/inventorySlice';

import { columns } from '@/features/inventory/components/inventory-table/columns';
import { InventoryTable } from '@/features/inventory/components/inventory-table/inventory-table';
import { StockAdjustmentDialog } from '@/features/inventory/components/stock-adjustment-dialog';
import { LowStockAlert } from '@/features/inventory/components/low-stock-alert';
import { InventoryStats } from '@/features/inventory/components/inventory-stats';
import { RefreshCw, Search, Filter } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { InventoryDTO } from '@/types/inventory/inventory';

export default function InventoryPage() {
    const dispatch = useAppDispatch();
    const { items, lowStockItems, loading, pagination } = useAppSelector(
        (state) => state.inventory
    );

    const [selectedInventory, setSelectedInventory] = useState<InventoryDTO | null>(null);
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('variantId');
    const [sortOrder, setSortOrder] = useState('asc');

    // Fetch inventory data
    const loadInventory = useCallback(() => {
        dispatch(fetchInventory({ page, size: pageSize, sortBy, sortOrder }));
        dispatch(fetchLowStockItems());
    }, [dispatch, page, pageSize, sortBy, sortOrder]);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    // Listen for edit events from table
    useEffect(() => {
        const handleEdit = (event: CustomEvent<InventoryDTO>) => {
            setSelectedInventory(event.detail);
            setAdjustDialogOpen(true);
        };

        window.addEventListener('inventory-edit', handleEdit as EventListener);
        return () => {
            window.removeEventListener('inventory-edit', handleEdit as EventListener);
        };
    }, []);

    const handleAdjustFromAlert = (item: InventoryDTO) => {
        setSelectedInventory(item);
        setAdjustDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        setAdjustDialogOpen(open);
        if (!open) {
            setSelectedInventory(null);
            // Refresh data after adjustment
            loadInventory();
        }
    };

    // Filter items by search query
    const filteredItems = searchQuery
        ? items.filter(
            (item) =>
                item.variantId.toString().includes(searchQuery) ||
                item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : items;

    return (
        <PageContainer scrollable>
            <div className="space-y-6">
                <Breadcrumbs />

                <div className="flex items-start justify-between">
                    <Heading
                        title={`Inventory (${pagination.totalElements})`}
                        description="Manage stock levels, track inventory, and handle low stock alerts."
                    />
                    <Button onClick={loadInventory} variant="outline" size="sm">
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                <Separator />

                {/* Stats */}
                <InventoryStats
                    items={items}
                    lowStockCount={lowStockItems.length}
                    loading={loading}
                />

                {/* Low Stock Alert */}
                <LowStockAlert items={lowStockItems} onAdjust={handleAdjustFromAlert} />

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by Variant ID or SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="variantId">Variant ID</SelectItem>
                                <SelectItem value="availableStock">Available Stock</SelectItem>
                                <SelectItem value="totalStock">Total Stock</SelectItem>
                                <SelectItem value="sku">SKU</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Inventory Table */}
                <InventoryTable
                    columns={columns}
                    data={filteredItems}
                    pageCount={pagination.totalPages}
                    loading={loading}
                />

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {items.length} of {pagination.totalElements} items
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= pagination.totalPages - 1}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stock Adjustment Dialog */}
            <StockAdjustmentDialog
                inventory={selectedInventory}
                open={adjustDialogOpen}
                onOpenChange={handleDialogClose}
            />
        </PageContainer>
    );
}
