import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Review, ProductReviewSummary } from '@/types/review';
import {
    getProductReviews,
    getProductReviewSummary,
    createReview,
    GetReviewsParams,
    CreateReviewPayload
} from '@/lib/services/review-service';
import { getErrorMessage } from '@/lib/errors';
import { logger } from '@/lib/logger';

interface ReviewState {
    reviews: Review[];
    summary: ProductReviewSummary | null;
    loading: boolean;
    submitting: boolean;
    error: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        lastPage: boolean;
    };
}

const initialState: ReviewState = {
    reviews: [],
    summary: null,
    loading: false,
    submitting: false,
    error: null,
    pagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    },
};

export const fetchProductReviews = createAsyncThunk(
    'reviews/fetchProductReviews',
    async ({ productId, params }: { productId: number | string; params?: GetReviewsParams }, { rejectWithValue }) => {
        try {
            const response = await getProductReviews(productId, params);
            return response;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchReviewSummary = createAsyncThunk(
    'reviews/fetchReviewSummary',
    async (productId: number | string, { rejectWithValue }) => {
        try {
            const summary = await getProductReviewSummary(productId);
            return summary;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const submitReview = createAsyncThunk(
    'reviews/submitReview',
    async ({ payload, token }: { payload: CreateReviewPayload; token: string }, { rejectWithValue }) => {
        try {
            await createReview(payload, token);
            // Return payload to potentially update UI optimistically or just signal success
            return payload;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetReviews: (state) => {
            state.reviews = [];
            state.summary = null;
            state.pagination = initialState.pagination;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reviews
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.content;
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    lastPage: action.payload.isLast,
                };
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Summary
            .addCase(fetchReviewSummary.pending, (state) => {
                // We don't necessarily want to show full loading state for summary if reviews are loading
                // but for now let's keep it simple
            })
            .addCase(fetchReviewSummary.fulfilled, (state, action) => {
                state.summary = action.payload;
            })
            .addCase(fetchReviewSummary.rejected, (state, action) => {
                // Summary failure shouldn't block the UI significantly
                logger.error('Failed to fetch review summary:', action.payload);
            })

            // Submit Review
            .addCase(submitReview.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
