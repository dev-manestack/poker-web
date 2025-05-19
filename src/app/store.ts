import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/user";
import themeReducer from "../providers/theme-slice";
import authReducer from "../providers/auth-slice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    theme: themeReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
