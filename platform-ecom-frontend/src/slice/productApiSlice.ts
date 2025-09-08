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
      query: ({ pageNumber = 0, pageSize = 10, sortBy = "id", sortOrder = "asc" }) =>
        `/public/products?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      providesTags: ["Products"],
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getProductByName: builder.query({
      query: (name) => `/public/products/keyword/${name}`,
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductByNameQuery,
  useGetProductsQuery,
  useAddProductMutation,
} = productsApiSlice;
