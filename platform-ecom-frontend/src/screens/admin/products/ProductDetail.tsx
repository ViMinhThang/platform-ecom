import { useGetProductByNameEquallyQuery } from "@/slice/productApiSlice";
import type { Product } from "@/types/Product";
import { capitalizeWords, getProductNameFromPath } from "@/util/util";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductInfoCard from "../../../components/admin/products/productInfo";
import { DragDropInput } from "../../../components/admin/products/ImageDragDrop";
import { InventoryCard } from "../../../components/admin/products/InventoryCard";

const ProductDetailAdmin = () => {
  const location = useLocation();
  const productName = capitalizeWords(
    getProductNameFromPath(location.pathname) ?? ""
  );
  const { data, isLoading, error } =
    useGetProductByNameEquallyQuery(productName);

  const [inStock, setInStock] = useState<boolean | null>(null);

  useEffect(() => {
    if (data) {
      setInStock(data.quantity > 0);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!data) return <div>No product found</div>;

  const product: Product = data;

  return (
    <div className="p-6 flex flex-col gap-6 bg-slate-100 h-full w-screen">
      <h1 className="text-3xl font-bold">Editing Product</h1>

      <div className="flex gap-6 w-[85%]">
        {/* Product Info Card */}
        <div className="flex gap-6 w-[70%]">
          <ProductInfoCard product={product} />
        </div>
        <InventoryCard
          quantity={product.quantity}
          inStock={inStock}
          onStockChange={setInStock}
          onSave={() => console.log("Save product inventory changes")}
        />
      </div>
      <div className="bg-white flex flex-col border w-[85%]">
        <h1 className="font-bold text-xl p-4">Images</h1>
        <div className="flex gap-4 p-4">
          {/* Render existing images if available */}
          {[0, 1, 2, 3].map((i) =>
            product.assets[i] ? (
              <DragDropInput key={i} url={product.assets[i].url} />
            ) : (
              <DragDropInput key={i} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAdmin;
