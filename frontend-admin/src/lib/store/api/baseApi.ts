import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';
import { env } from '@/lib/config/env';
import { logger } from '@/lib/logger';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

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
    const { url, method = 'GET' } = typeof args === 'string' ? { url: args } : args;
    logger.apiRequest(method, url, typeof args === 'object' && 'params' in args ? { params: args.params } : undefined);

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
        logger.error(`API ${method} ${url} failed`, result.error);
    } else {
        logger.debug(`API ${method} ${url} succeeded`);
        if (result.data && typeof result.data === 'object' && 'data' in result.data) {
            result.data = (result.data as ApiResponseWrapper).data;
        }
    }

    return result;
};

export const baseApi = createApi({
    baseQuery,
    reducerPath: 'api',
    tagTypes: [
        'Product',
        'ProductVariant',
        'ProductOption',
        'ProductImage',
        'Category',
        'User',
        'Order',
        'Inventory',
        'FlashSale',
    ],
    endpoints: () => ({}),
});

export default baseApi;
