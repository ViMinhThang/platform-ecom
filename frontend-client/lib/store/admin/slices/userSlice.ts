import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, role } from '@/types/admin/user/user';
import { PAGINATION } from '@/config/constants';

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

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<User[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<User>) => {
            state.items.unshift(action.payload);
        },
        updateItem: (state, action: PayloadAction<User>) => {
            const index = state.items.findIndex((u) => u.userId === action.payload.userId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.userId !== action.payload);
        },
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },
        setRoles: (state, action: PayloadAction<role[]>) => {
            state.roles = action.payload;
        },
        setPagination: (state, action: PayloadAction<Omit<UserState['pagination'], never>>) => {
            state.pagination = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setItems,
    addItem,
    updateItem,
    removeItem,
    setSelectedUser,
    setRoles,
    setPagination,
    setLoading,
    setError,
    clearSelectedUser,
    clearError,
} = userSlice.actions;

export default userSlice.reducer;
