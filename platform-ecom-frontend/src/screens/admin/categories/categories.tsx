import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryByIdMutation,
} from "@/slice/categoryApiSlice";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { categoriesColumns } from "@/components/admin/categories/columns";
import { DataTable } from "@/components/admin/categories/data-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types/Category";

interface CategoryFormValues {
  categoryName: string;
  categoryId: string;
}
const PAGE_SIZE = 10;

const CategoryDetailAdmin = () => {
  const location = useLocation();
  const [category, setCategory] = useState<Category>({} as Category);
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFormValues | null>(null);

  const {
    data: categories,
    isLoading,
    error,
  } = useGetCategoriesQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    sortBy: "price",
    sortOrder: "desc",
  });
  const [updateCategory] = useUpdateCategoryByIdMutation();
  const [createCategoty] = useCreateCategoryMutation();
  useEffect(() => {
    setPageNumber(0);
  }, [search]);

  const handleUpdateCategory = async () => {
    if (!category || !selectedCategory) {
      toast.error("No category selected!");
      return;
    }
    try {
      await updateCategory({
        categoryId: Number(selectedCategory.categoryId),
        categoryName: category.categoryName,
      }).unwrap();
      toast.success("Category updated successfully!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Category update failed!");
    }
  };

  const handleCreateCategory = async () => {
    try {
      await createCategoty({}).unwrap();
      toast.success("Create category success!");
    } catch (error) {
      toast.error("Failed");
    }
  };

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
    const filteredcategories = categories?.content ?? [];
    console.log(filteredcategories);
    content = (
      <>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          {filteredcategories.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No products found.
              <div className="mt-4">
                <Button onClick={handleCreateCategory}>Create Product</Button>
              </div>
            </div>
          ) : (
            <DataTable
              columns={categoriesColumns}
              data={filteredcategories}
              onRowClick={(row) => {
                setSelectedCategory(row.original);
                setOpen(true);
              }}
            />
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
            disabled={filteredcategories.length < PAGE_SIZE}
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
            Total Categories: {categories?.totalElements ?? 0}
          </span>
        </div>
        <Button onClick={handleCreateCategory} className="ml-auto">
          Create Category
        </Button>
      </div>
      {content}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="categoryName"
              value={category.categoryName || ""}
              onChange={(e) =>
                setCategory((prev) => ({
                  ...prev,
                  categoryName: e.target.value,
                }))
              }
              defaultValue={selectedCategory?.categoryName}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryDetailAdmin;
