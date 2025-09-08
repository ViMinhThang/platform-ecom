import React from "react";
import type { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";

interface ProductInfoCardProps {
  product: Product;
}

const ProductInfoCard = ({ product }:ProductInfoCardProps) => {
  return (
    <div className="bg-white shadow-md border rounded-md p-6 flex flex-col gap-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            className="border border-slate-300 rounded-md p-3 w-full"
            value={product.productName}
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1">Price</label>
          <input
            type="text"
            className="border border-slate-300 rounded-md p-3 w-full"
            value={product.price}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col mt-4">
          <label className="text-gray-700 mb-1">Discount</label>
          <input
            type="text"
            className="border border-slate-300 rounded-md p-2 w-full"
            value={product.discount}
            readOnly
          />
        </div>

        <div className="flex flex-col mt-4">
          <label className="text-gray-700 mb-1">Special Price</label>
          <input
            type="text"
            className="border border-slate-300 rounded-md p-2 w-full"
            value={product.specialPrice}
            readOnly
          />
        </div>
      </div>
      <Button className="bg-black text-white px-10 py-2 rounded-md w-[12%] mt-2">
        Save Changes
      </Button>
    </div>
  );
};

export default ProductInfoCard;
