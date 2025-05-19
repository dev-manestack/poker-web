import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
