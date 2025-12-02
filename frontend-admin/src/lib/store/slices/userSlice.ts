import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, UserResponse, role } from '@/types/user/user';
import { APIResponse } from '@/types/api'; // Assuming this exists, or I'll define it inline or import from utils
import { API_ENDPOINTS, PAGINATION } from '@/config/constants';
import { createRequestConfig, createMultipartConfig, handleApiError } from '@/lib/utils/api';
import { logger } from '@/lib/logger';

/**
 * Parameters for fetching users with pagination and filtering
 */
interface FetchUsersParams {
    token: string;
    params?: {
        page?: number;
        size?: number;
        search?: string;
        role?: string;
    };
}

/**
 * Parameters for fetching a single user
 */
interface FetchUserByIdParams {
    id: number;
    token: string;
}

/**
 * Parameters for creating a user
 */
interface CreateUserParams {
    data: Partial<User>;
    token: string;
}

/**
 * Parameters for updating a user
 */
interface UpdateUserParams {
    id: number;
    data: Partial<User>;
    token: string;
}

/**
 * Parameters for deleting a user
 */
interface DeleteUserParams {
    id: number;
    token: string;
}

/**
 * Parameters for updating user image
 */
interface UpdateUserImageParams {
    id: number;
    file: File;
    token: string;
}

/**
 * Parameters for fetching all roles
 */
interface FetchRolesParams {
    token: string;
}

/**
 * API response for roles
 */
interface RolesResponse {
    allRoles: role[];
}

interface UserState {
    items: User[];
    selectedUser: User | null;
    roles: role[];
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

const initialState: UserState = {
    items: [],
    selectedUser: null,
    roles: [],
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

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ token, params }: FetchUsersParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('GET', API_ENDPOINTS.ADMIN_USERS, params);

            const response = await axios.get<APIResponse<UserResponse>>(API_ENDPOINTS.ADMIN_USERS, {
                ...createRequestConfig(token),
                params,
            });

            logger.apiResponse('GET', API_ENDPOINTS.AUTH, response.status);
            return response.data.data;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to fetch users');
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async ({ id, token }: FetchUserByIdParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.ADMIN_USERS}/${id}`;
            logger.apiRequest('GET', url);

            const response = await axios.get<User>(url, createRequestConfig(token));

            logger.apiResponse('GET', url, response.status);
            return response.data;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to fetch user with ID ${id}`);
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async ({ data, token }: CreateUserParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', API_ENDPOINTS.ADMIN_USERS, { data });

            const response = await axios.post<User>(
                API_ENDPOINTS.ADMIN_USERS,
                data,
                createRequestConfig(token)
            );

            logger.apiResponse('POST', API_ENDPOINTS.AUTH, response.status);
            return response.data;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to create user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, data, token }: UpdateUserParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.ADMIN_USERS}/${id}`;
            logger.apiRequest('PUT', url, { data });

            const response = await axios.put<User>(url, data, createRequestConfig(token));

            logger.apiResponse('PUT', url, response.status);
            return response.data;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to update user with ID ${id}`);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async ({ id, token }: DeleteUserParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.ADMIN_USERS}/${id}`;
            logger.apiRequest('DELETE', url);

            const response = await axios.delete(url, createRequestConfig(token));

            logger.apiResponse('DELETE', url, response.status);
            return id;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to delete user with ID ${id}`);
        }
    }
);

export const updateUserImage = createAsyncThunk(
    'users/updateUserImage',
    async ({ id, file, token }: UpdateUserImageParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.ADMIN_USERS}/${id}/image`;
            logger.apiRequest('PUT', url, { fileName: file.name });

            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.put<string>(url, formData, createMultipartConfig(token));

            logger.apiResponse('PUT', url, response.status);
            return { id, imageUrl: response.data };
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to update image for user with ID ${id}`);
        }
    }
);

export const fetchAllRoles = createAsyncThunk(
    'users/fetchAllRoles',
    async ({ token }: FetchRolesParams, { rejectWithValue }) => {
        try {
            const url = API_ENDPOINTS.ADMIN_ROLES;
            logger.apiRequest('GET', url);

            const response = await axios.get<RolesResponse>(url, createRequestConfig(token));

            logger.apiResponse('GET', url, response.status);
            return response.data.allRoles;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to fetch roles');
        }
    }
);

// Slice

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Users
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
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
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch User By Id
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create User
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update User
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
                const index = state.items.findIndex((u) => u.userId === action.payload.userId);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete User
        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.userId !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update User Image
        builder
            .addCase(updateUserImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserImage.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming we want to update the image in the list/selected user
                if (state.selectedUser && state.selectedUser.userId === action.payload.id) {
                    state.selectedUser.imageUrl = action.payload.imageUrl;
                }
                const index = state.items.findIndex((u) => u.userId === action.payload.id);
                if (index !== -1) {
                    state.items[index].imageUrl = action.payload.imageUrl;
                }
            })
            .addCase(updateUserImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch Roles
        builder
            .addCase(fetchAllRoles.pending, (state) => {
                // Maybe separate loading state for roles? Or just use global loading
                // Using global loading for now
            })
            .addCase(fetchAllRoles.fulfilled, (state, action) => {
                state.roles = action.payload;
            })
            .addCase(fetchAllRoles.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedUser, clearError } = userSlice.actions;
export default userSlice.reducer;
