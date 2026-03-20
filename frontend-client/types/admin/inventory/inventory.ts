
export interface InventoryDTO {
    id: number;
    productId: number;
    variantId: number;
    sku: string | null;
    availableStock: number;
    reservedStock: number;
    totalStock: number;
    lowStockThreshold: number;
    reorderPoint: number;
    reorderQuantity: number;
    trackInventory: boolean;
    isLowStock: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StockAdjustmentRequest {
    adjustment: number;
    reason?: string;
    referenceType?: string;
    referenceId?: string;
}

export interface InventorySettingsRequest {
    lowStockThreshold?: number;
    reorderPoint?: number;
    reorderQuantity?: number;
    trackInventory?: boolean;
}