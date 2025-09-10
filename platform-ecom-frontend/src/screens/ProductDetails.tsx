import { Button } from "@/components/ui/button";
import { useGetProductByNameEquallyQuery } from "@/slice/productApiSlice";
import type { Product } from "@/types/Product";
import { capitalizeWords, getProductNameFromPath } from "@/util/util";
import { Badge } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

type FormValues = {
  quantity: number;
};

export default function ProductDetail() {
  const location = useLocation();
  const productName = getProductNameFromPath(location.pathname);
  const { data, isLoading, error } =
    useGetProductByNameEquallyQuery(productName);

  // Hook luôn nằm ở top-level
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: { quantity: 1 },
  });
  const quantity = watch("quantity");

  useEffect(() => {
    console.log("isLoading:", isLoading);
    console.log("error:", error);
    console.log("data:", data);
  }, [isLoading, error, data]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No product found</p>;

  const product = data;

  const onSubmit = (values: FormValues) => {
    console.log(product)
    console.log("Add to Cart:", {
      productId: product.productId,
      ...values,
    });
  };

  return (
    <>
      <div className="w-[1200px] mx-auto mb-1 px-4 flex gap-2 mt-5">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <p>/ {capitalizeWords(productName ?? "")}</p>
      </div>
      <div className="flex justify-between items-start flex-col md:flex-row p-4 w-[1200px] mx-auto">
        <img src={product.image} alt={product.productName} />
        <div className="flex flex-col justify-start items-start gap-4 p-4 w-full h-full py-0">
          <h1 className="font-medium p-0 m-0 text-2xl">
            {product.productName}
          </h1>
          <Badge>{product.type}</Badge>

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

          {/* Form Add to Cart */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-3"
          >
            <Controller
              name="quantity"
              control={control}
              rules={{ min: 1, max: product.quantity }}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none py-6"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setValue("quantity", Math.max(1, quantity - 1))
                    }
                  >
                    -
                  </Button>
                  <input
                    {...field}
                    type="text"
                    min={1}
                    max={product.quantity!}
                    className="border border-slate-300 rounded-none px-2 py-3 w-20 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none py-6"
                    disabled={quantity >= product.quantity!}
                    onClick={() =>
                      setValue(
                        "quantity",
                        Math.min(product.quantity!, quantity + 1)
                      )
                    }
                  >
                    +
                  </Button>
                </div>
              )}
            />

            <Button
              type="submit"
              disabled={product.quantity! <= 0}
              className="bg-white px-3 py-5 rounded-none w-full text-slate-800 border border-black hover:bg-white cursor-pointer"
            >
              Add to Cart
            </Button>
          </form>

          <div className="bg-black w-full border-[0.5px] border-black"></div>
          <p>{product.description}</p>
        </div>
      </div>
    </>
  );
}
