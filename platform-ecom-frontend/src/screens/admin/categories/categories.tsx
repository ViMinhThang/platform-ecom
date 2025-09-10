import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useDeleteCategoryByIdMutation,
  useGetCategoriesQuery,
  useUpdateCategoryByIdMutation,
} from "@/slice/categoryApiSlice";
import { categoriesColumns } from "@/components/admin/categories/columns";
import { DataTable } from "@/components/admin/categories/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@/types/Category";

const PAGE_SIZE = 10;

const CategoriesAdmin = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [formData, setFormData] = useState<{
    categoryName: string;
    isAvailable: "yes" | "no";
  }>({ categoryName: "", isAvailable: "yes" });

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
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategoryById] = useDeleteCategoryByIdMutation();

  // Reset page on search change
  useEffect(() => {
    setPageNumber(0);
  }, [search]);

  // Sync form with selected category
  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        categoryName: selectedCategory.categoryName,
        isAvailable: selectedCategory.isAvailable ? "yes" : "no",
      });
    }
  }, [selectedCategory]);

  /** Helper to wrap API calls */
  const safeAction = useCallback(
    async <T,>(action: () => Promise<T>, successMsg: string, failMsg: string) => {
      try {
        await action();
        toast.success(successMsg);
        setOpen(false);
      } catch (err) {
        console.error(err);
        toast.error(failMsg);
      }
    },
    []
  );

  const handleUpdateCategory = () =>
    selectedCategory &&
    safeAction(
      () =>
        updateCategory({
          categoryId: Number(selectedCategory.categoryId),
          categoryName: formData.categoryName,
          isAvailable: formData.isAvailable,
        }).unwrap(),
      "Category updated successfully!",
      "Category update failed!"
    );

  const handleDeleteCategory = () =>
    selectedCategory &&
    safeAction(
      () => deleteCategoryById(Number(selectedCategory.categoryId)).unwrap(),
      "Category deleted successfully!",
      "Delete failed!"
    );

  const handleCreateCategory = () =>
    safeAction(
      () =>
        createCategory({
          categoryName: formData.categoryName,
          isAvailable: formData.isAvailable,
        }).unwrap(),
      "Category created successfully!",
      "Failed to create category"
    );

  // Render content
  let content;
  if (isLoading) {
    content = <div className="text-center py-20">Loading...</div>;
  } else if (error) {
    content = (
      <div className="text-center py-20 text-red-500">
        Error loading categories or no categories
      </div>
    );
  } else {
    const filteredCategories = categories?.content ?? [];
    content = (
      <>
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No categories found.
              <div className="mt-4">
                <Button onClick={handleCreateCategory}>Create Category</Button>
              </div>
            </div>
          ) : (
            <DataTable
              columns={categoriesColumns}
              data={filteredCategories}
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
            disabled={filteredCategories.length < PAGE_SIZE}
          >
            Next
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 mx-5 p-4 w-[1600px] border border-stale-200 rounded-lg">
      {/* Top summary bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Categories</h1>
          <span className="text-sm text-gray-500">
            Total Categories: {categories?.totalElements ?? 0}
          </span>
        </div>
        <Button onClick={handleCreateCategory} className="ml-auto">
          Create Category
        </Button>
      </div>

      {content}

      {/* Dialog */}
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
              value={formData.categoryName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available">Set Available</Label>
            <select
              id="available"
              className="border p-2 rounded-md"
              value={formData.isAvailable}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAvailable: e.target.value as "yes" | "no",
                }))
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-red-300"
              onClick={handleDeleteCategory}
            >
              Delete
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesAdmin;
