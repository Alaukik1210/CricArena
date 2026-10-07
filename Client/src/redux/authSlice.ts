import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    loading: boolean;
}

const initialState: AuthState = {
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = authSlice.actions;
export default authSlice.reducer;
