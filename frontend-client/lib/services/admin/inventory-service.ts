import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/constants";

// ==================== Types ====================
import { InventoryDTO, InventorySettingsRequest, StockAdjustmentRequest } from "@/types/inventory/inventory";

export interface InventoryTransactionDTO {
    id: number;
    inventoryId: number;
    variantId: number;
    type:
    | "SALE"
    | "ADJUSTMENT"
    | "RESERVATION"
    | "RELEASE"
    | "PURCHASE"
    | "RETURN"
    | "INITIAL";
    quantityChange: number;
    stockBefore: number;
    stockAfter: number;
    referenceType: string | null;
    referenceId: string | null;
    reason: string | null;
    performedBy: number | null;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

// ==================== Service ====================

// Use seller endpoint - backend will filter by current seller's products
const INVENTORY_API = API_ENDPOINTS.INVENTORY_SELLER;

export const inventoryService = {
    /**
     * Get all inventory items with pagination
     */
    getAll: async (
        page = 0,
        size = 20,
        sortBy = "variantId",
        sortOrder = "asc"
    ) => {
        const response = await apiClient.get<{
            data: {
                content: InventoryDTO[];
                totalElements: number;
                totalPages: number;
                number: number; // Spring uses 'number' for page number
                size: number;
            };
        }>(INVENTORY_API, {
            params: { page, size, sortBy, sortOrder },
        });
        // Map Spring Boot pagination to our interface
        const data = response.data.data;
        return {
            content: data.content,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            pageNumber: data.number, // Map 'number' to 'pageNumber'
            pageSize: data.size,
        } as PaginatedResponse<InventoryDTO>;
    },

    /**
     * Get inventory by variant ID
     */
    getByVariantId: async (variantId: number) => {
        const response = await apiClient.get<{ data: InventoryDTO }>(
            `${INVENTORY_API}/${variantId}`
        );
        return response.data.data;
    },

    /**
     * Get low stock items
     */
    getLowStock: async () => {
        const response = await apiClient.get<{ data: InventoryDTO[] }>(
            `${INVENTORY_API}/low-stock`
        );
        return response.data.data;
    },

    /**
     * Get transaction history for a variant
     */
    getTransactions: async (variantId: number, page = 0, size = 20) => {
        const response = await apiClient.get<{
            data: PaginatedResponse<InventoryTransactionDTO>;
        }>(`${INVENTORY_API}/${variantId}/transactions`, {
            params: { page, size },
        });
        return response.data.data;
    },

    /**
     * Adjust stock (add or subtract)
     */
    adjustStock: async (variantId: number, request: StockAdjustmentRequest) => {
        const response = await apiClient.put<{ data: InventoryDTO }>(
            `${INVENTORY_API}/${variantId}/adjust`,
            request
        );
        return response.data.data;
    },

    /**
     * Update inventory settings
     */
    updateSettings: async (
        variantId: number,
        request: InventorySettingsRequest
    ) => {
        const response = await apiClient.put<{ data: InventoryDTO }>(
            `${INVENTORY_API}/${variantId}/settings`,
            request
        );
        return response.data.data;
    },

    /**
     * Create inventory for a new variant
     */
    create: async (
        productId: number,
        variantId: number,
        sku?: string,
        initialStock = 0
    ) => {
        const response = await apiClient.post<{ data: InventoryDTO }>(
            INVENTORY_API,
            null,
            {
                params: { productId, variantId, sku, initialStock },
            }
        );
        return response.data.data;
    },

    /**
     * Delete inventory for a variant
     */
    delete: async (variantId: number) => {
        await apiClient.delete(`${INVENTORY_API}/${variantId}`);
    },
};

export default inventoryService;
