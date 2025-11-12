"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

import { VariantImagePicker } from "./product-variant-image-picker";
import {
  getProductVariants,
  updateVariant,
} from "@/services/product-variant-service";
import { VariantFormValues } from "@/types/product/product-variant";
import { ProductVariantProvider } from "@/providers/product-variant-provider";
import { VariantsList } from "./variant-list";
import { ProductOptionProvider } from "@/providers/product-option-provider";

interface ProductVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  onSave: (variants: VariantFormValues[]) => Promise<void>;
}

export const ProductVariantDialog: React.FC<ProductVariantDialogProps> = ({
  open,
  onOpenChange,
  productId,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ProductOptionProvider productId={productId}>
        <ProductVariantProvider productId={productId}>
          <DialogContent className="min-w-4xl">
            <DialogHeader>
              <DialogTitle>Manage Product Variants</DialogTitle>
              <DialogDescription>
                Add, edit, or remove variants for this product.
              </DialogDescription>
            </DialogHeader>
            <VariantsList />
          </DialogContent>
        </ProductVariantProvider>
      </ProductOptionProvider>
    </Dialog>
  );
};
