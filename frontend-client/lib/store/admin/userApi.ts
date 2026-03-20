import { baseApi } from './baseApi';
import { User, role } from '@/types/admin/user/user';

export interface UserQueryParams {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}

export interface PaginatedUsers {
    content: User[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}

const API_BASE = '/api/v1/admin/users';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<PaginatedUsers, UserQueryParams | undefined>({
            query: (params) => ({
                url: API_BASE,
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'AdminUser', id: 'LIST' },
                          ...result.content.map(({ userId }) => ({ type: 'AdminUser' as const, id: userId })),
                      ]
                    : [{ type: 'AdminUser', id: 'LIST' }],
        }),

        getUserById: builder.query<User, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'AdminUser', id }],
        }),

        getRoles: builder.query<role[], void>({
            query: () => ({
                url: `${API_BASE}/roles`,
                method: 'GET',
            }),
            transformResponse: (response: { allRoles: role[] }) => response.allRoles || [],
            providesTags: [{ type: 'AdminUser', id: 'ROLES' }],
        }),

        createUser: builder.mutation<User, Partial<User>>({
            query: (data) => ({
                url: API_BASE,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
        }),

        updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
            query: ({ id, data }) => ({
                url: `${API_BASE}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AdminUser', id },
                { type: 'AdminUser', id: 'LIST' },
            ],
        }),

        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'AdminUser', id },
                { type: 'AdminUser', id: 'LIST' },
            ],
        }),

        uploadAvatar: builder.mutation<User, { id: number; file: File }>({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append('avatar', file);
                return {
                    url: `${API_BASE}/${id}/avatar`,
                    method: 'POST',
                    body: formData,
                    formData: true,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'AdminUser', id }],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useGetRolesQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUploadAvatarMutation,
} = userApi;
