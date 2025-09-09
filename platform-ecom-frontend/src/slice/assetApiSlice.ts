import { apiSlice } from "./apiSlice";

export const assestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadAsset: builder.mutation({
      query: (data) => ({
        url: "/assets/upload",
        method: "POST",
        body: data,
      }),
    }),
    deleteAsset: builder.mutation({
      query: ({ assetId }: { assetId: string }) => ({
        url: `/assets/${assetId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useUploadAssetMutation, useDeleteAssetMutation } =
  assestApiSlice;
