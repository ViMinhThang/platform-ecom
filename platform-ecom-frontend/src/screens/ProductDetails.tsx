import { Button } from "@/components/ui/button";
import { useGetProductByNameQuery } from "@/slice/productApiSlice";
import type { Product } from "@/types/Product";
import { capitalizeWords, getProductNameFromPath } from "@/util/util";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function ProductDetail() {
  const location = useLocation();


  const productName = getProductNameFromPath(location.pathname)

  const { data, isLoading, error } = useGetProductByNameQuery(productName);
  useEffect(() => {
    console.log("isLoading:", isLoading);
    console.log("error:", error);
    console.log("data:", data);
  }, [isLoading, error, data]);

  if (isLoading) return <p>Loading...</p>;

  const product: Product = data?.content?.[0];

  if (!product) return <p>No product found</p>;

  return (
    <>
    <div className="w-[1200px] mx-auto mb-1 px-4 flex gap-2">
      <Link to="/" className="text-blue-600 hover:underline">Home</Link>
      <p>/ {capitalizeWords(productName ?? "")}</p>
    </div>
      <div className="flex justify-between items-start flex-col md:flex-row p-4 w-[1200px] mx-auto">
      <img src={product.image} alt={product.productName} />
      <div className="flex flex-col justify-start items-start gap-4 p-4 w-full h-full py-0">
        <h1 className="font-medium p-0 m-0 text-2xl">{product.productName}</h1>
        <div>
          {product.specialPrice ? (
            <div className="flex flex-col items-start gap-2">
              <span className="text-slate-800 font-bold text-xl">
                ${product.specialPrice.toFixed(2)}
              </span>
              <span className="text-slate-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-black font-bold text-xl">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        {product.quantity! > 0 ? (
          <span className="text-slate-800 font-medium">In Stock</span>
        ) : (
          <span className="text-slate-500 font-medium">Out of Stock</span>
        )}
        <input
          type="number"
          min={1}
          max={product.quantity!}
          defaultValue={1}
          className="border border-slate-300 rounded px-2 py-3 w-20"
        />
        <Button
          disabled={product.quantity! <= 0}
          className="bg-white px-3 py-5 rounded-none w-full text-slate-800 border border-black hover:bg-white cursor-pointer"
        >
          Add to Cart
        </Button>
        <div className="bg-black w-full border-[0.5px] border-black"></div>
        <p>{product.description}</p>
      </div>
    </div>
    </>
  
  );
}
