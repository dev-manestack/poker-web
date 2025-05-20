import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuthenticated } from "../providers/auth-slice";
import type { User } from "./user";
const baseURL = import.meta.env.VITE_BACKEND_URL;

interface Withdrawal {
  withdrawalId: number;
  userId: number;
  amount: number;
  createDate: string;
  approvedBy: number;
  approveDate: string;
  details: object;
  user: User;
}

interface Deposit {
  depositId: number;
  userId: number;
  amount: number;
  createDate: string;
  approvedBy: number;
  approveDate: string;
  details: object;
  user: User;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${baseURL}/api/v1/admin`,
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

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    fetchWithdrawals: builder.query<Withdrawal[], null>({
      query: () => ({
        url: "/withdrawal",
        method: "GET",
      }),
    }),
    fetchDeposits: builder.query<Deposit[], null>({
      query: () => ({
        url: "/deposit",
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchWithdrawalsQuery, useFetchDepositsQuery } = adminApi;
export type { Withdrawal, Deposit };
