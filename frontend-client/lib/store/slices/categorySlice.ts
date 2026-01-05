import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '@/types/product';
import { getCategories } from '@/lib/services/product-service';
import { getErrorMessage } from '@/lib/errors';

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const categories = await getCategories();
            return categories;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
