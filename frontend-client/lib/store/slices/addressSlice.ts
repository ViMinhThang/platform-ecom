import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from '@/types/user';
import { getUserAddresses, createAddress, updateAddress, deleteAddress } from '@/lib/services/address-service';
import { getErrorMessage } from '@/lib/errors';

interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
}

const initialState: AddressState = {
    addresses: [],
    loading: false,
    error: null,
};

export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (token: string | undefined, { rejectWithValue }) => {
        if (!token) {
            return rejectWithValue('Not authenticated');
        }
        try {
            const addresses = await getUserAddresses(token);
            return addresses;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async ({ address, token }: { address: Address; token: string }, { rejectWithValue }) => {
        try {
            const newAddress = await createAddress(address, token);
            return newAddress;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const editAddress = createAsyncThunk(
    'address/editAddress',
    async ({ addressId, address, token }: { addressId: number; address: Address; token: string }, { rejectWithValue }) => {
        try {
            const updatedAddress = await updateAddress(addressId, address, token);
            return updatedAddress;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const removeAddress = createAsyncThunk(
    'address/removeAddress',
    async ({ addressId, token }: { addressId: number; token: string }, { rejectWithValue }) => {
        try {
            await deleteAddress(addressId, token);
            return addressId;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add Address
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload);
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Edit Address
            .addCase(editAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editAddress.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.addresses.findIndex((a) => a.addressId === action.payload.addressId);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })
            .addCase(editAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Remove Address
            .addCase(removeAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter((a) => a.addressId !== action.payload);
            })
            .addCase(removeAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;
