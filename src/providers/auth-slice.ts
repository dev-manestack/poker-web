import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  checkedAuth: false,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
      state.checkedAuth = true;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      window.location.reload();
    },
  },
});

export const { setAuthenticated, logout, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
