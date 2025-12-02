import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, ProductDetail, ProductRow } from '@/types/product';
import { getPublicProducts, getPublicProductWithVariants, GetProductsParams } from '@/lib/services/product-service';
import { getErrorMessage } from '@/lib/errors';

interface ProductState {
    products: ProductRow[];
    selectedProduct: ProductDetail | null;
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
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    pagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    },
};

export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (params: GetProductsParams = {}, { rejectWithValue }) => {
        try {
            const response = await getPublicProducts(params);
            return response;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchProductDetail = createAsyncThunk(
    'product/fetchProductDetail',
    async (productId: number | string, { rejectWithValue }) => {
        try {
            const product = await getPublicProductWithVariants(productId);
            return product;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const productSlice = createSlice({
    name: 'product',
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
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.content;
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
            })
            // Fetch Product Detail
            .addCase(fetchProductDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
