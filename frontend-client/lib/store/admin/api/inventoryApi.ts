import { baseApi } from './baseApi';
import { InventoryDTO, InventorySettingsRequest, StockAdjustmentRequest } from '@/types/inventory/inventory';

export interface InventoryTransactionDTO {
    id: number;
    inventoryId: number;
    variantId: number;
    type: 'SALE' | 'ADJUSTMENT' | 'RESERVATION' | 'RELEASE' | 'PURCHASE' | 'RETURN' | 'INITIAL';
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

const API_BASE = '/api/v1/sellers/inventory';

export const inventoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getInventory: builder.query<PaginatedResponse<InventoryDTO>, { page?: number; size?: number; sortBy?: string; sortOrder?: string } | undefined>({
            query: (params = {}) => ({
                url: API_BASE,
                method: 'GET',
                params: { page: 0, size: 20, sortBy: 'variantId', sortOrder: 'asc', ...params },
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'Inventory', id: 'LIST' },
                          ...result.content.map(({ variantId }) => ({ type: 'Inventory' as const, id: variantId })),
                      ]
                    : [{ type: 'Inventory', id: 'LIST' }],
        }),

        getInventoryByVariantId: builder.query<InventoryDTO, number>({
            query: (variantId) => ({
                url: `${API_BASE}/${variantId}`,
                method: 'GET',
            }),
            providesTags: (result, error, variantId) => [{ type: 'Inventory', id: variantId }],
        }),

        getLowStockItems: builder.query<InventoryDTO[], void>({
            query: () => ({
                url: `${API_BASE}/low-stock`,
                method: 'GET',
            }),
            providesTags: [{ type: 'Inventory', id: 'LOW_STOCK' }],
        }),

        getTransactionHistory: builder.query<PaginatedResponse<InventoryTransactionDTO>, { variantId: number; page?: number; size?: number }>({
            query: ({ variantId, page = 0, size = 20 }) => ({
                url: `${API_BASE}/${variantId}/transactions`,
                method: 'GET',
                params: { page, size },
            }),
            providesTags: (result, error, { variantId }) => [
                { type: 'Inventory', id: `TX_${variantId}` },
            ],
        }),

        adjustStock: builder.mutation<InventoryDTO, { variantId: number; request: StockAdjustmentRequest }>({
            query: ({ variantId, request }) => ({
                url: `${API_BASE}/${variantId}/stock`,
                method: 'PUT',
                body: request,
            }),
            invalidatesTags: (result, error, { variantId }) => [
                { type: 'Inventory', id: variantId },
                { type: 'Inventory', id: `TX_${variantId}` },
                { type: 'Inventory', id: 'LIST' },
                { type: 'Inventory', id: 'LOW_STOCK' },
            ],
        }),

        updateInventorySettings: builder.mutation<InventoryDTO, { variantId: number; request: InventorySettingsRequest }>({
            query: ({ variantId, request }) => ({
                url: `${API_BASE}/${variantId}/settings`,
                method: 'PUT',
                body: request,
            }),
            invalidatesTags: (result, error, { variantId }) => [
                { type: 'Inventory', id: variantId },
                { type: 'Inventory', id: 'LIST' },
                { type: 'Inventory', id: 'LOW_STOCK' },
            ],
        }),

        createInventory: builder.mutation<InventoryDTO, { productId: number; variantId: number; sku?: string; initialStock?: number }>({
            query: ({ productId, variantId, sku, initialStock = 0 }) => ({
                url: API_BASE,
                method: 'POST',
                params: { productId, variantId, sku, initialStock },
            }),
            invalidatesTags: [
                { type: 'Inventory', id: 'LIST' },
                { type: 'Inventory', id: 'LOW_STOCK' },
            ],
        }),

        deleteInventory: builder.mutation<void, number>({
            query: (variantId) => ({
                url: `${API_BASE}/${variantId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'Inventory', id: 'LIST' },
                { type: 'Inventory', id: 'LOW_STOCK' },
            ],
        }),
    }),
});

export const {
    useGetInventoryQuery,
    useGetInventoryByVariantIdQuery,
    useGetLowStockItemsQuery,
    useGetTransactionHistoryQuery,
    useAdjustStockMutation,
    useUpdateInventorySettingsMutation,
    useCreateInventoryMutation,
    useDeleteInventoryMutation,
} = inventoryApi;
