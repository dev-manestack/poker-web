import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/auth";
import themeReducer from "../providers/theme-slice";
import authReducer from "../providers/auth-slice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    theme: themeReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
