import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';
import { env } from '@/lib/config/env';

interface ApiResponseWrapper {
    code?: number;
    message?: string;
    success?: boolean;
    data: unknown;
}

const rawBaseQuery = fetchBaseQuery({
    baseUrl: env.apiBaseUrl,
    prepareHeaders: async (headers) => {
        const session = await getSession();
        if (session?.accessToken) {
            headers.set('Authorization', `Bearer ${session.accessToken}`);
        }
        return headers;
    },
});

const baseQuery: BaseQueryFn = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.data && typeof result.data === 'object' && 'data' in result.data) {
        result.data = (result.data as ApiResponseWrapper).data;
    }

    return result;
};

export const baseApi = createApi({
    baseQuery,
    reducerPath: 'adminApi',
    tagTypes: [
        'AdminProduct',
        'ProductVariant',
        'ProductOption',
        'ProductImage',
        'AdminCategory',
        'AdminUser',
        'AdminOrder',
        'Inventory',
        'FlashSale',
    ],
    endpoints: () => ({}),
});

export default baseApi;
