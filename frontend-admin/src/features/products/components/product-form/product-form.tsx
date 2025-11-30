"use client";

import { FormProvider } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProductForm } from "@/hooks/product/use-product-form";
import { ProductDialogProps } from "@/types/product/product-form";
import { ProductFormFields } from "./product-form-fields";

export const ProductDialog: React.FC<ProductDialogProps> = ({ productId, open, onOpenChange }) => {
  const { methods, onSubmit, categories, loading } = useProductForm({ productId, open, onOpenChange });
  const title = productId ? "Update Product" : "Create Product";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{title} details below</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <ProductFormFields control={methods.control} categories={categories} loading={loading} />
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
