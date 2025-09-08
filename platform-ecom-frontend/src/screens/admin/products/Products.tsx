"use client";

import { useState } from "react";
import { useGetProductsQuery } from "@/slice/productApiSlice";
import { productColumns } from "../../../components/admin/products/columns";
import { DataTable } from "../../../components/admin/products/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Products = () => {
  const { data: products, isLoading, error } = useGetProductsQuery({
    pageNumber: 0,
    pageSize: 10,
    sortBy: "price",
    sortOrder: "desc",
  });

  const [search, setSearch] = useState("");

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading products</div>;

  const filteredProducts = products?.content.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="flex flex-col gap-6 mx-5 p-4 w-[1600px] border border-stale-200 rounded-lg">
      {/* Top summary bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Products</h1>
          <span className="text-sm text-gray-500">
            Total Products: {products?.content.length ?? 0}
          </span>
        </div>
        <Button
          onClick={() => console.log("Open create product modal")}
          className="ml-auto"
        >
          Create Product
        </Button>
      </div>

      {/* Search / filter */}
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No products found.
            <div className="mt-4">
              <Button onClick={() => console.log("Open create product modal")}>
                Create Product
              </Button>
            </div>
          </div>
        ) : (
          <DataTable columns={productColumns} data={filteredProducts} />
        )}
      </div>
    </div>
  );
};

export default Products;
