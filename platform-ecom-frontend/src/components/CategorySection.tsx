import Products from "@/components/Products";
import type { Product, ProductResponse } from "@/types/Product";
import { Link } from "react-router-dom";

interface CategorySectionProps {
  title: string;
  banner: string;
  products?: ProductResponse;
  isLoading: boolean;
  error: any;
}

const CategorySection = ({
  title,
  banner,
  products,
  isLoading,
  error,
}: CategorySectionProps) => {
  return (
    <div className="mb-12">
      {/* Banner */}
      <div className="w-full h-[60%] bg-gray-200 flex justify-center items-center">
        <img
          src={banner}
          alt={`${title} Banner`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <div className="flex justify-between items-center mt-6">
        <div className="border border-black p-2 mx-12 me-4 mt-10">
          <h1 className="font-medium text-2xl">{title}</h1>
        </div>
        <p className="mt-12 mx-13 text-2xl font-bold underline cursor-pointer">
          <Link to={`/category/${title.toLowerCase()}`}>See All</Link>
        </p>
      </div>

      {/* Products */}
      <Products data={products} isLoading={isLoading} error={error} type={"HomePage"} />
    </div>
  );
};

export default CategorySection;
