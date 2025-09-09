import type { Product, ProductFormValues } from "@/types/Product";
import { Controller, type Control } from "react-hook-form";
import { IsAvailableToggle } from "./isAvailableToggle";
import { useGetCategoriesQuery } from "@/slice/categoryApiSlice";

interface ProductInfoCardProps {
  control: Control<ProductFormValues>; // hoặc Control<ProductFormValues>
}
const ProductInfoCard = ({ control }: ProductInfoCardProps) => {
  const { data, isLoading, error } = useGetCategoriesQuery({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "categoryName",
    sortOrder: "asc",
  });

  if (isLoading) {
    return <div>is Loading</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="bg-white shadow-md border rounded-md p-6 flex flex-col gap-4 w-[70%]">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="productName"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1">Product Name</label>
              <input
                {...field}
                type="text"
                className="border border-slate-300 rounded-md p-3 w-full"
              />
            </div>
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1">Price</label>
              <input
                {...field}
                type="number"
                className="border border-slate-300 rounded-md p-3 w-full"
              />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Controller
          name="discount"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1">Discount</label>
              <input
                {...field}
                type="number"
                className="border border-slate-300 rounded-md p-2 w-full"
              />
            </div>
          )}
        />

        <Controller
          name="specialPrice"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1">Special Price</label>
              <input
                {...field}
                type="number"
                className="border border-slate-300 rounded-md p-2 w-full"
              />
            </div>
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1">Type</label>
              <input
                {...field}
                type="text"
                className="border border-slate-300 rounded-md p-2 w-full"
              />
            </div>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1">Category</label>
              <select
                {...field}
                className="border border-slate-300 rounded-md p-2 w-full"
              >
                <option value="">Select Category</option>
                {data?.content.map((category: any) => (
                  <option key={category.categoryId} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          )}
        />

        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1">Slug</label>
              <input
                {...field}
                type="text"
                placeholder="auto-generated from product name"
                className="border border-slate-300 rounded-md p-2 w-full"
              />
            </div>
          )}
        />
        <IsAvailableToggle control={control} />
      </div>
    </div>
  );
};

export default ProductInfoCard;
