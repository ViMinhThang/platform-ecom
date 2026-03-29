import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';
import { env } from '@/lib/config/env';

import type { Category, ProductResponse, ProductDetail } from '@/types/product';
import type { CartDTO, AddToCartRequest } from '@/types/cart.types';
import type { Address } from '@/types/user';
import type { ReviewResponse, ProductReviewSummary } from '@/types/review';
import type { VoucherDTO, DiscountResult, CalculateDiscountRequest } from '@/types/promotion.types';
import type {
    OrderGroupDTO,
    CreateOrderRequest,
    CheckoutSession,
    ConfirmPaymentRequest
} from '@/types/order.types';
import { PaginatedResponse } from '@/types/common.types';
import { UserProfile } from '@/types/user';

interface ApiResponseWrapper {
    code?: number;
    message?: string;
    success?: boolean;
    data: unknown;
}

const baseQuery = fetchBaseQuery({
    baseUrl: env.apiBaseUrl,
    prepareHeaders: async (headers) => {
        const session = await getSession();
        if (session?.accessToken) {
            headers.set('Authorization', `Bearer ${session.accessToken}`);
        }
        return headers;
    },
});

const baseQueryWithResponse: BaseQueryFn = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    if (result.data && typeof result.data === 'object' && 'data' in result.data) {
        result.data = (result.data as ApiResponseWrapper).data;
    }

    return result;
};

interface GetProductsQueryParams {
    page?: number;
    perPage?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
}

const transformProductsParams = (params: GetProductsQueryParams): URLSearchParams => {
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) searchParams.set('page', params.page.toString());
    if (params.perPage !== undefined) searchParams.set('size', params.perPage.toString());
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params.minRating !== undefined) searchParams.set('minRating', params.minRating.toString());
    
    return searchParams;
};

export const api = createApi({
    baseQuery: baseQueryWithResponse,
    reducerPath: 'api',
    tagTypes: ['Product', 'Category', 'ProductDetail', 'Cart', 'Order', 'Review', 'Address', 'Voucher', 'User'],
    endpoints: (builder) => ({
        // ============== CATEGORIES ==============
        getCategories: builder.query<Category[], void>({
            query: () => ({
                url: '/api/v1/categories',
                method: 'GET',
            }),
            transformResponse: (response: { content: Category[] }) => response.content,
            providesTags: [{ type: 'Category', id: 'LIST' }],
        }),

        // ============== PRODUCTS ==============
        getProducts: builder.query<ProductResponse, GetProductsQueryParams | undefined>({
            query: (params) => {
                const searchParams = transformProductsParams(params || {});
                const query = searchParams.toString();
                return {
                    url: `/api/v1/products${query ? `?${query}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'Product' as const, id: 'LIST' },
                          ...result.content.map(({ id }) => ({ type: 'Product' as const, id })),
                      ]
                    : [{ type: 'Product' as const, id: 'LIST' }],
        }),
        getProductById: builder.query<ProductDetail, number | string>({
            query: (id) => ({
                url: `/api/v1/products/${id}/with-variants`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'ProductDetail' as const, id }],
        }),
        getProductBySlug: builder.query<ProductDetail, string>({
            query: (slug) => ({
                url: `/api/v1/products/slug/${encodeURIComponent(slug)}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, slug) => [{ type: 'ProductDetail' as const, id: `slug-${slug}` }],
        }),

        // ============== CART ==============
        getCart: builder.query<CartDTO, void>({
            query: () => ({
                url: '/api/v1/cart',
                method: 'GET',
            }),
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation<CartDTO, AddToCartRequest>({
            query: (request) => ({
                url: '/api/v1/cart/add',
                method: 'POST',
                body: request,
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartQuantity: builder.mutation<CartDTO, { productId: number; variantId?: number; change: number }>({
            query: ({ productId, variantId, change }) => {
                const params = new URLSearchParams();
                params.append('quantityChange', change.toString());
                if (variantId) params.append('variantId', variantId.toString());
                return {
                    url: `/api/v1/cart/items/${productId}?${params.toString()}`,
                    method: 'PUT',
                };
            },
            invalidatesTags: ['Cart'],
        }),
        removeCartItem: builder.mutation<void, { productId: number; variantId?: number }>({
            query: ({ productId, variantId }) => {
                const params = variantId ? `?variantId=${variantId}` : '';
                return {
                    url: `/api/v1/cart/items/${productId}${params}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Cart'],
        }),
        clearCart: builder.mutation<void, void>({
            query: () => ({
                url: '/api/v1/cart/clear',
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),

        // ============== ORDERS ==============
        getOrders: builder.query<PaginatedResponse<OrderGroupDTO>, { page?: number; size?: number }>({
            query: ({ page = 0, size = 10 } = {}) => ({
                url: `/api/v1/order-groups?page=${page}&size=${size}`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'Order' as const, id: 'LIST' },
                          ...result.content.map(({ id }) => ({ type: 'Order' as const, id })),
                      ]
                    : [{ type: 'Order' as const, id: 'LIST' }],
        }),
        getOrderById: builder.query<OrderGroupDTO, number>({
            query: (orderId) => ({
                url: `/api/v1/order-groups/${orderId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Order' as const, id }],
        }),
        initiateCheckout: builder.mutation<CheckoutSession, CreateOrderRequest>({
            query: (request) => ({
                url: '/api/v1/order-groups/initiate-checkout',
                method: 'POST',
                body: request,
            }),
        }),
        confirmPayment: builder.mutation<OrderGroupDTO, ConfirmPaymentRequest>({
            query: (request) => ({
                url: '/api/v1/order-groups/confirm-payment',
                method: 'POST',
                body: request,
            }),
            invalidatesTags: ['Order', 'Cart'],
        }),
        cancelOrder: builder.mutation<void, number>({
            query: (orderId) => ({
                url: `/api/v1/order-groups/${orderId}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: ['Order'],
        }),

        // ============== REVIEWS ==============
        getProductReviews: builder.query<ReviewResponse, { productId: number | string; pageNumber?: number; pageSize?: number }>({
            query: ({ productId, pageNumber = 0, pageSize = 10 }) => ({
                url: `/api/v1/reviews/public/product/${productId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'Review' as const, id: `product-${result.content[0]?.productId}` },
                          ...result.content.map(({ id }) => ({ type: 'Review' as const, id })),
                      ]
                    : [{ type: 'Review' as const, id: 'LIST' }],
        }),
        getProductReviewSummary: builder.query<ProductReviewSummary, number | string>({
            query: (productId) => ({
                url: `/api/v1/reviews/public/summary/product/${productId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, productId) => [{ type: 'Review' as const, id: `summary-${productId}` }],
        }),
        createReview: builder.mutation<void, { productId: number; orderId: number; rating: number; comment?: string; email: string }>({
            query: (payload) => ({
                url: '/api/v1/reviews',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Review'],
        }),

        // ============== ADDRESSES ==============
        getAddresses: builder.query<Address[], void>({
            query: () => ({
                url: '/api/v1/users/addresses',
                method: 'GET',
            }),
            providesTags: ['Address'],
        }),
        addAddress: builder.mutation<Address, Address>({
            query: (address) => ({
                url: '/api/v1/users/addresses',
                method: 'POST',
                body: address,
            }),
            invalidatesTags: ['Address'],
        }),
        updateAddress: builder.mutation<Address, { addressId: number; address: Address }>({
            query: ({ addressId, address }) => ({
                url: `/api/v1/users/addresses/${addressId}`,
                method: 'PUT',
                body: address,
            }),
            invalidatesTags: ['Address'],
        }),
        deleteAddress: builder.mutation<void, number>({
            query: (addressId) => ({
                url: `/api/v1/users/addresses/${addressId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Address'],
        }),

        // ============== PROMOTIONS ==============
        getAutoApplyVouchers: builder.query<VoucherDTO[], void>({
            query: () => ({
                url: '/api/v1/vouchers/available',
                method: 'GET',
            }),
            providesTags: ['Voucher'],
        }),
        getVoucherByCode: builder.query<VoucherDTO, string>({
            query: (code) => ({
                url: `/api/v1/vouchers/code/${code}`,
                method: 'GET',
            }),
            providesTags: ['Voucher'],
        }),
        validateVoucher: builder.mutation<boolean, { code: string; userId: number }>({
            query: ({ code, userId }) => ({
                url: `/api/v1/vouchers/validate/${code}?userId=${userId}`,
                method: 'GET',
            }),
        }),
        calculateDiscount: builder.mutation<DiscountResult, CalculateDiscountRequest>({
            query: (request) => ({
                url: '/api/v1/vouchers/calculate',
                method: 'POST',
                body: request,
            }),
        }),

        // ============== USER ==============
        getUserProfile: builder.query<UserProfile, void>({
            query: () => ({
                url: '/api/v1/users/me',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation<UserProfile, { username: string; email: string }>({
            query: (data) => ({
                url: '/api/v1/users/me',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        getSellerInfo: builder.query<{ userId: number; username: string; imageUrl?: string }, number>({
            query: (userId) => ({
                url: `/api/v1/internal/user-service/users/${userId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'User' as const, id: `seller-${id}` }],
        }),
    }),
});

export const {
    // Categories
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
    // Products
    useGetProductsQuery,
    useLazyGetProductsQuery,
    useGetProductByIdQuery,
    useGetProductBySlugQuery,
    // Cart
    useGetCartQuery,
    useLazyGetCartQuery,
    useAddToCartMutation,
    useUpdateCartQuantityMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
    // Orders
    useGetOrdersQuery,
    useLazyGetOrdersQuery,
    useGetOrderByIdQuery,
    useInitiateCheckoutMutation,
    useConfirmPaymentMutation,
    useCancelOrderMutation,
    // Reviews
    useGetProductReviewsQuery,
    useGetProductReviewSummaryQuery,
    useCreateReviewMutation,
    // Addresses
    useGetAddressesQuery,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    // Promotions
    useGetAutoApplyVouchersQuery,
    useLazyGetAutoApplyVouchersQuery,
    useGetVoucherByCodeQuery,
    useValidateVoucherMutation,
    useCalculateDiscountMutation,
    // User
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useGetSellerInfoQuery,
} = api;

export default api;
