import { FaExclamationCircle } from "react-icons/fa";
import ProductCard from "./ProductCard";
import type { ProductResponse } from "@/types/Product";

interface ProductsProps {
  data?: ProductResponse;
  isLoading: boolean;
  error: any;
  type: string;
}

const Products = ({ data, isLoading, error, type }: ProductsProps) => {
  if (isLoading) return <p>Loading...</p>;

  if (error) {
    const errorMessage =
      (error as any)?.data?.message ||
      (error as any)?.error ||
      "Error loading products";
    return (
      <div className="flex justify-center items-center h-[200px]">
        <FaExclamationCircle className="text-slate-800 text-3xl mr-2" />
        <span className="text-slate-800 text-lg font-medium">
          {errorMessage}
        </span>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto mb-10">
      <div className="pb-5">
        {/* Grid danh sách products */}
        <div className="pb-6 pt-5 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
          {data?.content?.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>

        {/* Pagination info */}
        {type !== "HomePage" && data && (
          <div className="mt-6 text-center text-slate-700">
            Page {data.pageNumber + 1} / {data.totalPages} — Total:{" "}
            {data.totalElements} products
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
