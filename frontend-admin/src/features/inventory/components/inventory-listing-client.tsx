"use client";

import { useEffect, useState, useCallback } from "react";
import { InventoryTable } from "./inventory-tables";
import { columns } from "./inventory-tables/columns";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchInventory, fetchLowStockItems } from "@/lib/store/slices/inventorySlice";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";
import { LowStockAlert } from "./low-stock-alert";
import { InventoryStats } from "./inventory-stats";
import { InventoryDTO } from "@/types/inventory/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function InventoryListingClient() {
    const dispatch = useAppDispatch();
    const { items, lowStockItems, loading, pagination } = useAppSelector(
        (state) => state.inventory
    );

    const [selectedInventory, setSelectedInventory] = useState<InventoryDTO | null>(null);
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("variantId");
    const [sortOrder, setSortOrder] = useState("asc");

    const totalItems = pagination.totalElements;

    // Fetch inventory data
    const loadInventory = useCallback(() => {
        dispatch(fetchInventory({ page, size: perPage, sortBy, sortOrder }));
        dispatch(fetchLowStockItems());
    }, [dispatch, page, perPage, sortBy, sortOrder]);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    // Listen for edit events from table
    useEffect(() => {
        const handleEdit = (event: CustomEvent<InventoryDTO>) => {
            setSelectedInventory(event.detail);
            setAdjustDialogOpen(true);
        };

        window.addEventListener("inventory-edit", handleEdit as EventListener);
        return () => {
            window.removeEventListener("inventory-edit", handleEdit as EventListener);
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

    if (loading && items.length === 0) {
        return <div>Loading inventory...</div>;
    }

    return (
        <>
            {/* Stats */}
            <InventoryStats
                items={items}
                lowStockCount={lowStockItems.length}
                loading={loading}
            />

            {/* Low Stock Alert */}
            <LowStockAlert items={lowStockItems} onAdjust={handleAdjustFromAlert} />

            {/* Filters and Refresh */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                <Button onClick={loadInventory} variant="outline" size="sm">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Inventory Table */}
            <InventoryTable
                data={filteredItems}
                totalItems={totalItems}
                columns={columns}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
                currentPage={page}
                pageSize={perPage}
            />

            {/* Stock Adjustment Dialog */}
            <StockAdjustmentDialog
                inventory={selectedInventory}
                open={adjustDialogOpen}
                onOpenChange={handleDialogClose}
            />
        </>
    );
}
