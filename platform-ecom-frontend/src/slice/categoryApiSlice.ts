import { apiSlice } from "./apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `/public/categories`,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApiSlice;
