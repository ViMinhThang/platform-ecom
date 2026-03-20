import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    sidebarOpen: boolean;
    modalOpen: Record<string, boolean>;
}

const initialState: UIState = {
    sidebarOpen: true,
    modalOpen: {},
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        openModal: (state, action: PayloadAction<string>) => {
            state.modalOpen[action.payload] = true;
        },
        closeModal: (state, action: PayloadAction<string>) => {
            state.modalOpen[action.payload] = false;
        },
    },
});

export const { toggleSidebar, setSidebarOpen, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
