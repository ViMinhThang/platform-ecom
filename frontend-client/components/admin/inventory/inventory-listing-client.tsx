"use client";

import { useMemo, useState, useReducer } from "react";
import { InventoryTable } from "./inventory-tables";
import { getInventoryColumns } from "./inventory-tables/columns";
import {
    useDeleteInventoryMutation,
    useGetInventoryQuery,
    useGetLowStockItemsQuery
} from "@/lib/store/admin";
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

const EMPTY_INVENTORY_ITEMS: InventoryDTO[] = [];

export default function InventoryListingClient() {
    const [dialogState, setDialogState] = useReducer(
        (prev: any, next: any) => ({ ...prev, ...next }),
        { selectedInventory: null as InventoryDTO | null, adjustDialogOpen: false, createDialogOpen: false, deleteDialogOpen: false, inventoryToDelete: null as InventoryDTO | null }
    );
    const [tableState, setTableState] = useReducer(
        (prev: any, next: any) => ({ ...prev, ...next }),
        { page: 0, perPage: 10, searchQuery: "", sortBy: "variantId", sortOrder: "asc" }
    );

    const { data, isLoading, refetch } = useGetInventoryQuery({
        page: tableState.page,
        size: tableState.perPage,
        sortBy: tableState.sortBy,
        sortOrder: tableState.sortOrder
    });
    const { data: lowStockData } = useGetLowStockItemsQuery();
    const [deleteInventory] = useDeleteInventoryMutation();

    const items = data?.content ?? EMPTY_INVENTORY_ITEMS;
    const totalItems = data?.totalElements || 0;
    const lowStockItems = lowStockData ?? EMPTY_INVENTORY_ITEMS;

    const loadInventory = () => {
        refetch();
    };

    const handleAdjustFromAlert = (item: InventoryDTO) => {
        setDialogState({ selectedInventory: item, adjustDialogOpen: true });
    };

    const handleEditInventory = (item: InventoryDTO) => {
        setDialogState({ selectedInventory: item, adjustDialogOpen: true });
    };

    const handleDeleteRequest = (item: InventoryDTO) => {
        setDialogState({ inventoryToDelete: item, deleteDialogOpen: true });
    };

    const handleDialogClose = (open: boolean) => {
        setDialogState({ adjustDialogOpen: open });
        if (!open) {
            setDialogState({ selectedInventory: null });
            loadInventory();
        }
    };

    const handleCreateDialogClose = (open: boolean) => {
        setDialogState({ createDialogOpen: open });
    };

    const handleDeleteDialogChange = (open: boolean) => {
        setDialogState({ deleteDialogOpen: open });
        if (!open) {
            setDialogState({ inventoryToDelete: null });
        }
    };

    const handleConfirmDelete = async () => {
        if (dialogState.inventoryToDelete) {
            try {
                await deleteInventory(dialogState.inventoryToDelete.variantId).unwrap();
                toast.success(`Đã xóa kho hàng cho biến thể #${dialogState.inventoryToDelete.variantId}`);
                loadInventory();
            } catch {
                toast.error("Không thể xóa kho hàng");
            }
        }

        setDialogState({ deleteDialogOpen: false, inventoryToDelete: null });
    };

    const filteredItems = useMemo(
        () =>
            tableState.searchQuery
                ? items.filter(
                      (item) =>
                          item.variantId.toString().includes(tableState.searchQuery) ||
                          item.sku?.toLowerCase().includes(tableState.searchQuery.toLowerCase())
                  )
                : items,
        [items, tableState.searchQuery]
    );

    const columns = getInventoryColumns({
        onEdit: handleEditInventory,
        onDelete: handleDeleteRequest,
    });

    if (isLoading && items.length === 0) {
        return <div>Đang tải kho hàng…</div>;
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
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo ID biến thể hoặc SKU..."
                            value={tableState.searchQuery}
                            onChange={(e) => setTableState({ searchQuery: e.target.value })}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={tableState.sortBy} onValueChange={(v) => setTableState({ sortBy: v })}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="variantId">ID Biến thể</SelectItem>
                                <SelectItem value="availableStock">Tồn kho khả dụng</SelectItem>
                                <SelectItem value="totalStock">Tổng tồn kho</SelectItem>
                                <SelectItem value="sku">SKU</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={tableState.sortOrder} onValueChange={(v) => setTableState({ sortOrder: v })}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Thứ tự" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Tăng dần</SelectItem>
                                <SelectItem value="desc">Giảm dần</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setDialogState({ createDialogOpen: true })} size="sm">
                        <Plus className="mr-2 size-4" />
                        Tạo kho hàng
                    </Button>
                    <Button onClick={loadInventory} variant="outline" size="sm">
                        <RefreshCw className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Làm mới
                    </Button>
                </div>
            </div>

            <InventoryTable
                data={filteredItems}
                totalItems={totalItems}
                columns={columns}
                onPageChange={(v) => setTableState({ page: v })}
                onPerPageChange={(v) => setTableState({ perPage: v })}
                currentPage={tableState.page}
                pageSize={tableState.perPage}
            />

            <StockAdjustmentDialog
                key={dialogState.selectedInventory?.variantId ?? "inventory-empty"}
                inventory={dialogState.selectedInventory}
                open={dialogState.adjustDialogOpen}
                onOpenChange={handleDialogClose}
            />

            <CreateInventoryDialog
                open={dialogState.createDialogOpen}
                onOpenChange={handleCreateDialogClose}
                onSuccess={loadInventory}
            />

            <AlertDialog open={dialogState.deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa kho hàng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc muốn xóa kho hàng cho biến thể #{dialogState.inventoryToDelete?.variantId}?
                            Hành động này không thể hoàn tác và sẽ xóa tất cả các giao dịch và đặt chỗ liên quan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
