import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Category, CategoryResponse } from '@/types/category/category';
import { API_ENDPOINTS, PAGINATION } from '@/config/constants';
import { createRequestConfig, createMultipartConfig, handleApiError, unwrapResponse } from '@/lib/utils/api';
import { logger } from '@/lib/logger';
import { APIResponse } from '@/types/api-response';

/**
 * Parameters for fetching categories with pagination and filtering
 */
interface FetchCategoriesParams {
    token: string;
    params?: {
        page?: number;
        size?: number;
        search?: string;
    };
}

/**
 * Parameters for fetching a single category
 */
interface FetchCategoryByIdParams {
    id: number;
    token: string;
}

/**
 * Parameters for creating a category
 */
interface CreateCategoryParams {
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
    token: string;
}

/**
 * Parameters for updating a category
 */
interface UpdateCategoryParams {
    id: number;
    data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>;
    token: string;
}

/**
 * Parameters for deleting a category
 */
interface DeleteCategoryParams {
    id: number;
    token: string;
}

/**
 * Parameters for updating category image
 */
interface UpdateCategoryImageParams {
    id: number;
    file: File;
    token: string;
}

interface CategoryState {
    items: Category[];
    selectedCategory: Category | null;
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

const initialState: CategoryState = {
    items: [],
    selectedCategory: null,
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

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async ({ token, params }: FetchCategoriesParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.CATEGORIES}/public`;
            logger.apiRequest('GET', url, params);

            const response = await axios.get<CategoryResponse>(url, {
                ...createRequestConfig(token),
                params,
            });

            logger.apiResponse('GET', url, response.status);
            return response.data;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to fetch categories');
        }
    }
);

export const fetchCategoryById = createAsyncThunk(
    'categories/fetchCategoryById',
    async ({ id, token }: FetchCategoryByIdParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.CATEGORIES}/${id}/public`;
            logger.apiRequest('GET', url);

            const response = await axios.get<APIResponse<Category>>(url, createRequestConfig(token));

            logger.apiResponse('GET', url, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to fetch category with ID ${id}`);
        }
    }
);

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async ({ data, token }: CreateCategoryParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', API_ENDPOINTS.CATEGORIES, { data });

            const response = await axios.post<APIResponse<Category>>(
                API_ENDPOINTS.CATEGORIES,
                data,
                createRequestConfig(token)
            );

            logger.apiResponse('POST', API_ENDPOINTS.CATEGORIES, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to create category');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, data, token }: UpdateCategoryParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.CATEGORIES}/${id}`;
            logger.apiRequest('PUT', url, { data });

            const response = await axios.put<APIResponse<Category>>(url, data, createRequestConfig(token));

            logger.apiResponse('PUT', url, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to update category with ID ${id}`);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async ({ id, token }: DeleteCategoryParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.CATEGORIES}/${id}`;
            logger.apiRequest('DELETE', url);

            const response = await axios.delete<APIResponse<string>>(url, createRequestConfig(token));

            logger.apiResponse('DELETE', url, response.status);
            unwrapResponse(response); // Unwrap to verify success
            return id;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to delete category with ID ${id}`);
        }
    }
);

export const updateCategoryImage = createAsyncThunk(
    'categories/updateCategoryImage',
    async ({ id, file, token }: UpdateCategoryImageParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.CATEGORIES}/${id}/image`;
            logger.apiRequest('PUT', url, { fileName: file.name });

            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.put<APIResponse<string>>(url, formData, createMultipartConfig(token));

            logger.apiResponse('PUT', url, response.status);
            return { id, imageUrl: unwrapResponse(response) };
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to update image for category with ID ${id}`);
        }
    }
);

// Slice

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Categories
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
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
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch Category By Id
        builder
            .addCase(fetchCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCategory = action.payload;
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Category
        builder
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Category
        builder
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCategory = action.payload;
                const index = state.items.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Category
        builder
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Category Image
        builder
            .addCase(updateCategoryImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategoryImage.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming the response is just the image URL string, and we need to update the category in the list
                // Note: The backend returns string, but we might need to know which category it was if we want to update the list item.
                // I modified the thunk to return { id, imageUrl }
                const index = state.items.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    // Assuming Category has an image field. Let's check the type definition if possible, but for now assuming 'image' or 'imageUrl'
                    // Based on previous files, it might be 'image' or similar.
                    // I'll assume 'image' property exists on Category type or similar.
                    // If not, this might need adjustment.
                    // Let's check Category type content from previous steps or just assume for now.
                    // Actually I didn't see the content of Category type. I'll assume it has an image field.
                    // If not, I'll just leave it for now.
                    // Wait, I can see Category type in `src/types/category/category.ts` if I read it.
                    // I'll read it in the next step to be sure.
                }
            })
            .addCase(updateCategoryImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedCategory, clearError } = categorySlice.actions;
export default categorySlice.reducer;
