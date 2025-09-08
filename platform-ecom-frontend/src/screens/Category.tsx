import { useParams } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "@/slice/productApiSlice";
import Products from "@/components/Products";

const Category = () => {
  const { name } = useParams<{ name: string }>();

  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsByCategoryQuery({
    category: name ?? "electronics",
    pageNumber: 0,
    pageSize: 12,
    sortBy: "price",
    sortOrder: "desc",
  });

  return (
    <div className="w-[95%] mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {name} Products
      </h1>

      <Products
        products={products?.content ?? []}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Category;
