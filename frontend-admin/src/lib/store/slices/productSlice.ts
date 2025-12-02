import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product, ProductRow, PaginatedProducts } from '@/types/product/product';
import { API_ENDPOINTS, PAGINATION } from '@/config/constants';
import { createRequestConfig, handleApiError, unwrapResponse } from '@/lib/utils/api';
import { logger } from '@/lib/logger';
import { APIResponse } from '@/types/api-response';

/**
 * Parameters for fetching products with pagination and filtering
 */
interface FetchProductsParams {
    token: string;
    params?: {
        page?: number;
        size?: number;
        search?: string;
        status?: string;
    };
}

/**
 * Parameters for creating a product
 */
interface CreateProductParams {
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
    token: string;
}

/**
 * Parameters for updating a product
 */
interface UpdateProductParams {
    id: number;
    data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;
    token: string;
}

/**
 * Parameters for deleting a product
 */
interface DeleteProductParams {
    id: number;
    token: string;
}

/**
 * Parameters for fetching a single product
 */
interface FetchProductByIdParams {
    id: number;
    token: string;
}

interface ProductState {
    items: ProductRow[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        lastPage: boolean;
    };
}

const initialState: ProductState = {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
    pagination: {
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.DEFAULT_SIZE,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    },
};

// Async Thunks

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ token, params }: FetchProductsParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('GET', API_ENDPOINTS.PRODUCTS_SELLER, params);

            const response = await axios.get<APIResponse<PaginatedProducts>>(API_ENDPOINTS.PRODUCTS_SELLER, {
                ...createRequestConfig(token),
                params,
            });

            logger.apiResponse('GET', API_ENDPOINTS.PRODUCTS_SELLER, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to fetch products');
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async ({ id, token }: FetchProductByIdParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS_SELLER}/${id}`;
            logger.apiRequest('GET', url);

            const response = await axios.get<APIResponse<Product>>(url, createRequestConfig(token));

            logger.apiResponse('GET', url, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to fetch product with ID ${id}`);
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async ({ data, token }: CreateProductParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', API_ENDPOINTS.PRODUCTS_SELLER, { data });

            const response = await axios.post<APIResponse<ProductRow>>(
                API_ENDPOINTS.PRODUCTS_SELLER,
                data,
                createRequestConfig(token)
            );

            logger.apiResponse('POST', API_ENDPOINTS.PRODUCTS_SELLER, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to create product');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, data, token }: UpdateProductParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS_SELLER}/${id}`;
            logger.apiRequest('PUT', url, { data });

            const response = await axios.put<APIResponse<Product>>(url, data, createRequestConfig(token));

            logger.apiResponse('PUT', url, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to update product with ID ${id}`);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async ({ id, token }: DeleteProductParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS_SELLER}/${id}`;
            logger.apiRequest('DELETE', url);

            const response = await axios.delete<APIResponse<string>>(url, createRequestConfig(token));

            logger.apiResponse('DELETE', url, response.status);
            unwrapResponse(response); // Unwrap to verify success
            return id;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to delete product with ID ${id}`);
        }
    }
);

// Slice

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.content;
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    lastPage: action.payload.lastPage,
                };
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch Product By Id
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Product
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload); // Add new product to start of list
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Product
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
                // Update in list if exists
                const index = state.items.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    // Note: ProductRow might have different fields than Product, mapping might be needed if types diverge significantly
                    // For now assuming compatible or just updating what we can
                    // Ideally we should refetch or map properly. Let's assume we refresh list or just update what we have.
                    // Since ProductRow is a subset/different view, we might not be able to fully update it from Product response without mapping.
                    // For simplicity, we'll leave the list update for a refetch or optimistic update if needed.
                    // But let's try to update at least the common fields if possible.
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Product
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
