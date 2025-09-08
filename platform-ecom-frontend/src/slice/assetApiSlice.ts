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
  }),
});

export const { useUploadAssetMutation } = assestApiSlice;
