"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { VariantFormValues } from "@/types/product/product-variant";
import { VariantsList } from "./variant-list";

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
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Quản lý biến thể sản phẩm</DialogTitle>
          <DialogDescription>
            Thêm, chỉnh sửa hoặc xóa biến thể cho sản phẩm này.
          </DialogDescription>
        </DialogHeader>
        <VariantsList />
      </DialogContent>
    </Dialog>
  );
};
