"use client";

import { useState, useMemo } from "react";
import { InventoryTable } from "./inventory-tables";
import { columns } from "./inventory-tables/columns";
import { useGetInventoryQuery, useGetLowStockItemsQuery, useDeleteInventoryMutation } from "@/lib/store/api";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";
import { LowStockAlert } from "./low-stock-alert";
import { InventoryStats } from "./inventory-stats";
import { InventoryDTO } from "@/types/inventory/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CreateInventoryDialog } from "./create-inventory-dialog";

export default function InventoryListingClient() {
    const [selectedInventory, setSelectedInventory] = useState<InventoryDTO | null>(null);
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [inventoryToDelete, setInventoryToDelete] = useState<InventoryDTO | null>(null);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("variantId");
    const [sortOrder, setSortOrder] = useState("asc");

    const { data, isLoading, refetch } = useGetInventoryQuery({ page, size: perPage, sortBy, sortOrder });
    const { data: lowStockData } = useGetLowStockItemsQuery();
    const [deleteInventory] = useDeleteInventoryMutation();

    const items = data?.content || [];
    const totalItems = data?.totalElements || 0;
    const lowStockItems = lowStockData || [];

    const loadInventory = () => {
        refetch();
    };

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

    const handleCreateDialogClose = (open: boolean) => {
        setCreateDialogOpen(open);
    };

    const handleConfirmDelete = async () => {
        if (inventoryToDelete) {
            try {
                await deleteInventory(inventoryToDelete.variantId).unwrap();
                toast.success(`Inventory for variant #${inventoryToDelete.variantId} deleted successfully`);
                loadInventory();
            } catch (error) {
                toast.error("Failed to delete inventory");
            }
        }
        setDeleteDialogOpen(false);
        setInventoryToDelete(null);
    };

    const filteredItems = useMemo(() => searchQuery
        ? items.filter(
            (item) =>
                item.variantId.toString().includes(searchQuery) ||
                item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : items, [items, searchQuery]);

    if (isLoading && items.length === 0) {
        return <div>Loading inventory...</div>;
    }

    return (
        <>
            <InventoryStats
                items={items}
                lowStockCount={lowStockItems.length}
                loading={isLoading}
            />

            <LowStockAlert items={lowStockItems} onAdjust={handleAdjustFromAlert} />

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
                <div className="flex gap-2">
                    <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Inventory
                    </Button>
                    <Button onClick={loadInventory} variant="outline" size="sm">
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <InventoryTable
                data={filteredItems}
                totalItems={totalItems}
                columns={columns}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
                currentPage={page}
                pageSize={perPage}
            />

            <StockAdjustmentDialog
                inventory={selectedInventory}
                open={adjustDialogOpen}
                onOpenChange={handleDialogClose}
            />

            <CreateInventoryDialog
                open={createDialogOpen}
                onOpenChange={handleCreateDialogClose}
                onSuccess={loadInventory}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Inventory</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the inventory for variant #{inventoryToDelete?.variantId}?
                            This action cannot be undone and will also delete all related transactions and reservations.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
