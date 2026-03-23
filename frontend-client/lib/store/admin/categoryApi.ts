import { baseApi } from './baseApi';
import { Category, CategoryResponse } from '@/types/category/category';

export interface CategoryQueryParams {
    page?: number;
    size?: number;
    search?: string;
}

const PUBLIC_API = '/api/v1/categories';
const ADMIN_API = '/api/v1/admin/categories';

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<CategoryResponse, CategoryQueryParams | undefined>({
            query: (params) => ({
                url: PUBLIC_API,
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'AdminCategory', id: 'LIST' },
                          ...result.content.map(({ id }) => ({ type: 'AdminCategory' as const, id })),
                      ]
                    : [{ type: 'AdminCategory', id: 'LIST' }],
        }),

        getCategoryById: builder.query<Category, number>({
            query: (id) => ({
                url: `${PUBLIC_API}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'AdminCategory', id }],
        }),

        createCategory: builder.mutation<Category, Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>({
            query: (data) => ({
                url: ADMIN_API,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'AdminCategory', id: 'LIST' }],
        }),

        updateCategory: builder.mutation<Category, { id: number; data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>> }>({
            query: ({ id, data }) => ({
                url: `${ADMIN_API}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AdminCategory', id },
                { type: 'AdminCategory', id: 'LIST' },
            ],
        }),

        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `${ADMIN_API}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'AdminCategory', id },
                { type: 'AdminCategory', id: 'LIST' },
            ],
        }),

        updateCategoryImage: builder.mutation<Category, { id: number; file: File }>({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url: `${ADMIN_API}/${id}/image`,
                    method: 'PUT',
                    body: formData,
                    formData: true,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'AdminCategory', id }],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryImageMutation,
} = categoryApi;
