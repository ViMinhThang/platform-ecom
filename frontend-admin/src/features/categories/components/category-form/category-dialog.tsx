"use client";

import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProductForm } from "@/hooks/product/use-product-form";
import { CategoryFormFields } from "./category-form-field";
import {
  CategoryDialogProps,
  CategoryFormSchema,
  CategoryFormValues,
} from "@/types/category/category-form";
import { useCategoryContext } from "@/providers/category-provider";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  categoryId,
  open,
  onOpenChange,
}) => {
  const title = categoryId ? "Update Product" : "Create Product";
  const { getCategory, category, loading } = useCategoryContext();
  const { data: session } = useSession();
  const accessToken = session?.accessToken || "";

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: category ? category.name : "",
      imageUrl: category ? category.imageUrl : "",
    },
  });
  useEffect(() => {
    if (categoryId) {
      getCategory(categoryId, accessToken);
    }
  }, [categoryId, getCategory, open, accessToken]);

  const onSubmit = methods.handleSubmit(async (data: CategoryFormValues) => {
    console.log("Form submitted with data:", data);

    onOpenChange && onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{title} details below</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <CategoryFormFields control={methods.control} loading={loading} />
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
