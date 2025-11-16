"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  CategoryDialogProps,
  CategoryFormSchema,
  CategoryFormValues,
} from "@/types/category/category-form";
import { CategoryFormFields } from "./category-form-field";
import { useCategoryContext } from "@/providers/category-provider";

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  categoryId,
  open,
  onOpenChange,
}) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken || "";

  const { getCategory, category, loading, updateCategoryHandler } =
    useCategoryContext();

  // Title changes automatically
  const isEditing = Boolean(categoryId);
  const title = isEditing ? "Update Category" : "Create Category";

  // Form Setup
  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      id: categoryId || undefined,
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (open && categoryId) {
      getCategory(categoryId, accessToken);
    }
  }, [open, categoryId, accessToken]);

  // Reset form when category data arrives
  useEffect(() => {
    if (category && open) {
      methods.reset({
        name: category.name,
        imageUrl: category.imageUrl ?? "",
      });
    }
  }, [category, open, methods]);

  const onSubmit = methods.handleSubmit(async (data) => {
    console.log("Save category:", data);
    await updateCategoryHandler(categoryId, data, accessToken);

    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update category details" : "Create a new category"}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <CategoryFormFields
              control={methods.control}
              loading={loading}
              categoryId={categoryId}
            />
            <div className="col-span-full flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
