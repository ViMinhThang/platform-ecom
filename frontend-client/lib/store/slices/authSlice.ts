import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types/user';
import { getUserProfile, updateUserInfo, validateToken } from '@/lib/services/user-service';
import { getErrorMessage } from '@/lib/errors';

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

/**
 * Check authentication by validating token from session
 * This should be called with the token from NextAuth session
 */
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (token: string | undefined, { rejectWithValue }) => {
        if (!token) {
            return rejectWithValue('No authentication token');
        }
        try {
            const user = await validateToken(token);
            return user;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

/**
 * Update user profile information
 */
export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({ data, token }: { data: { username: string; email: string }; token: string }, { rejectWithValue }) => {
        try {
            const user = await updateUserInfo(data, token);
            return user;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

/**
 * Get user profile by ID
 */
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async ({ userId, token }: { userId: string; token: string }, { rejectWithValue }) => {
        try {
            const user = await getUserProfile(userId, token);
            return user;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<UserProfile>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            // Fetch User Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
