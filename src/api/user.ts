import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuthenticated } from "../providers/auth-slice";
import type { GameTable } from "./admin";
const baseURL = import.meta.env.VITE_BACKEND_URL;

interface User {
  userId: number;
  email: string;
  isVerified: boolean;
  username: string;
  profileURL: string;
  role: string;
  bankName: string;
  accountNumber: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${baseURL}/api/v1/user`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(setAuthenticated(false));
  }

  return result;
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
  tagTypes: ["UserList", "tables"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: LoginCredentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData: User) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    me: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
    searchUsers: builder.query<User[], void>({
      query: () => ({
        url: "/search",
        method: "GET",
      }),
      providesTags: ["UserList"],
    }),
    fetchTables: builder.query<GameTable[], void>({
      query: () => ({
        url: "/table",
        method: "GET",
      }),
      providesTags: ["tables"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useFetchTablesQuery,
  useSearchUsersQuery,
} = userApi;
export type { User, LoginCredentials };
