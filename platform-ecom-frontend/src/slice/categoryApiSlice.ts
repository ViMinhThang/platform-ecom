import type { Category, CategoryResponse } from "@/types/Category";
import { apiSlice } from "./apiSlice";
interface CategoryState {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}

// Category API Slice
export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query<CategoryResponse, CategoryState>({
      query: () => `/public/categories`,
      providesTags: ["Categories", "Products"],
    }),

    getCategoryById: builder.query<Category, number>({
      query: (categoryId) => `/public/categories/${categoryId}`,
    }),

    updateCategoryById: builder.mutation<
      Category,
      { categoryId: number; categoryName: string; isAvailable: string }
    >({
      query: ({ categoryId, categoryName, isAvailable }) => ({
        url: `/public/categories/${categoryId}`,
        method: "PUT",
        body: { categoryName, isAvailable },
      }),
      invalidatesTags: ["Categories"],
    }),

    // Create new category
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (data) => ({
        url: `/public/categories`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategoryById: builder.mutation<string, number>({
      query: (categoryId) => ({
        url: `/admin/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useDeleteCategoryByIdMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryByIdMutation,
  useCreateCategoryMutation,
} = categoryApiSlice;
