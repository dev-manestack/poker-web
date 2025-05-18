import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/auth";
import themeReducer from "./theme-slice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
