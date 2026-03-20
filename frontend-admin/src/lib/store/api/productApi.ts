import { baseApi } from './baseApi';
import { Product, ProductRow, PaginatedProducts } from '@/types/product/product';

export interface ProductQueryParams {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
}

const API_BASE = '/api/v1/sellers/products';

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<PaginatedProducts, ProductQueryParams | undefined>({
            query: (params) => ({
                url: API_BASE,
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'Product', id: 'LIST' },
                          ...result.content.map(({ id }) => ({ type: 'Product' as const, id })),
                      ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),

        getProductById: builder.query<Product, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

        createProduct: builder.mutation<ProductRow, Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
            query: (data) => ({
                url: API_BASE,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        updateProduct: builder.mutation<Product, { id: number; data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> }>({
            query: ({ id, data }) => ({
                url: `${API_BASE}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
