import { productColumns } from "@/components/admin/products/columns";
import { DataTable } from "@/components/admin/products/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateProductMutation,
  useGetProductsQuery,
} from "@/slice/productApiSlice";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

const Products = () => {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const [createProduct] = useCreateProductMutation();

  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    sortBy: "price",
    sortOrder: "desc",
  });

  const handleCreateProduct = async () => {
    try {
      await createProduct({}).unwrap();
      toast.success("Create dummy product success!");
    } catch (err) {
      toast.error("Failed");
    }
  };

  useEffect(() => {
    setPageNumber(0);
  }, [search]);

  let content;
  if (isLoading) {
    content = <div className="text-center py-20">Loading...</div>;
  } else if (error) {
    content = (
      <div className="text-center py-20 text-red-500">
        Error loading products
      </div>
    );
  } else {
    const filteredProducts = products?.content ?? [];

    content = (
      <>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No products found.
              <div className="mt-4">
                <Button onClick={handleCreateProduct}>Create Product</Button>
              </div>
            </div>
          ) : (
            <DataTable columns={productColumns} data={filteredProducts} />
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={filteredProducts.length < PAGE_SIZE}
          >
            Next
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 mx-5 p-4 w-[1600px] border border-stale-200 rounded-lg ">
      {/* Top summary bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Products</h1>
          <span className="text-sm text-gray-500">
            Total Products: {products?.totalElements ?? 0}
          </span>
        </div>
        <Button onClick={handleCreateProduct} className="ml-auto">
          Create Product
        </Button>
      </div>

      {content}
    </div>
  );
};
export default Products;
