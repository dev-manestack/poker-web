import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  checkedAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
      state.checkedAuth = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      window.location.reload();
    },
  },
});

export const { setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
