import { FaExclamationCircle } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "@/slice/productApiSlice";

const Products = () => {
  const { data: products, isLoading, error } = useGetProductsQuery({
    pageNumber: 0,
    pageSize: 12,
    sortBy: "price",
    sortOrder: "desc",
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    const errorMessage =
      (error as any)?.data?.message || (error as any)?.error || "Error loading products";
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
    <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
      <div className="min-h-[700px]">
        <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
          {products?.content?.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
        <p className="text-center mt-4">
          Page {(products?.pageNumber ?? 0) + 1} / {products?.totalPages ?? 1}
        </p>
      </div>
    </div>
  );
};

export default Products;
