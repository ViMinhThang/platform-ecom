import type { ProductResponse } from "@/types/Product";
import { apiSlice } from "./apiSlice";

interface ProductState {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse, ProductState>({
      query: ({
        pageNumber = 0,
        pageSize = 10,
        sortBy = "id",
        sortOrder = "asc",
      }) =>
        `/public/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: "/products",
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),
    getProductByName: builder.query({
      query: (name) => `/public/products/keyword/${name}`,
      providesTags: ["Products"],
    }),
    getProductsByCategory: builder.query<
      ProductResponse,
      ProductState & { category: string }
    >({
      query: ({
        category,
        pageNumber = 0,
        pageSize = 10,
        sortBy = "id",
        sortOrder = "asc",
      }) =>
        `/public/categories/${category}/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      providesTags: ["Products"],
    }),
    getProductByNameEqually: builder.query({
      query: (name) => `/public/products/name/${name}`,
      providesTags: ["Products"],
    }),
    updateProductById: builder.mutation({
      query: ({ productId, data }: { productId: Number; data: any }) => ({
        url: `/admin/products/${productId}`,
        method: "PUT",
        body: data,
        providesTags: ["Products"],
      }),
    }),
    deleteProductById: builder.mutation({
      query: (productId: number) => ({
        url: `/admin/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags:["Products"]
    }),
  }),
});

export const {
  useGetProductByNameQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetProductsByCategoryQuery,
  useGetProductByNameEquallyQuery,
  useDeleteProductByIdMutation,
  useUpdateProductByIdMutation,
} = productsApiSlice;
