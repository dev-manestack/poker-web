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

interface GameTable {
  tableId: number;
  tableName: string;
  maxPlayers: number;
  bigBlind: number;
  smallBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  variant: string;
  createdAt: string;
  createdBy: number;
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
  tagTypes: ["withdrawals", "deposits", "tables"],
  endpoints: (builder) => ({
    fetchWithdrawals: builder.query<Withdrawal[], void>({
      query: () => ({
        url: "/withdrawal",
        method: "GET",
      }),
      providesTags: ["withdrawals"],
    }),
    createDeposit: builder.mutation<
      void,
      { userId: number; amount: number; type: string; details: object }
    >({
      query: (data) => ({
        url: "/deposit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["deposits"],
    }),
    fetchDeposits: builder.query<Deposit[], void>({
      query: () => ({
        url: "/deposit",
        method: "GET",
      }),
      providesTags: ["deposits"],
    }),
    approveWithdrawal: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/withdrawal/approve?withdrawalId=${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["withdrawals"],
    }),
    adminSearchUsers: builder.query<User[], void>({
      query: () => ({
        url: "/user/search",
        method: "GET",
      }),
      providesTags: ["withdrawals"],
    }),
    createTable: builder.mutation<void, GameTable>({
      query: (data) => ({
        url: "/table",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tables"],
    }),
    updateTable: builder.mutation<void, GameTable>({
      query: (data) => ({
        url: `/table`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["tables"],
    }),
    deleteTable: builder.mutation<void, number>({
      query: (id) => ({
        url: `/table?tableId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tables"],
    }),
  }),
});

export const {
  useFetchWithdrawalsQuery,
  useFetchDepositsQuery,
  useApproveWithdrawalMutation,
  useCreateDepositMutation,
  useAdminSearchUsersQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
} = adminApi;
export type { Withdrawal, Deposit, GameTable };
