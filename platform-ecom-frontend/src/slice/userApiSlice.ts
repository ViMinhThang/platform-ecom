import type { UserResponse, User } from "@/types/User";
import { apiSlice } from "./apiSlice";

interface UserState {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, UserState>({
      query: ({
        pageNumber = 0,
        pageSize = 10,
        sortBy = "user_id",
        sortOrder = "asc",
      }) =>
        `/admin/users?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (userId: string) => `/admin/users/${userId}`,
      providesTags: ["Users"],
    }),
    getRoles: builder.query({
      query: () => `/admin/users/roles`,
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "/admin/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUserById: builder.mutation<
      User,
      { userId: number; data: Partial<User> }
    >({
      query: ({ userId, data }) => ({
        url: `/admin/users/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUserById: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
  useGetUserByIdQuery,
  useGetRolesQuery,
} = usersApiSlice;
