import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/user";
import { adminApi } from "../api/admin";
import themeReducer from "../providers/theme-slice";
import authReducer from "../providers/auth-slice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    theme: themeReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
