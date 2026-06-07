"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { ProductDialog } from "./product-form";

interface ProductDialogWrapperProps {
  productId?: number;
}

export const ProductDialogWrapper: React.FC<ProductDialogWrapperProps> = ({ productId }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)} className="text-xs md:text-sm bg-gray-950 flex items-center gap-2">
        <IconPlus className="size-4" /> {productId ? "Chỉnh sửa" : "Thêm mới"}
      </Button>

      <ProductDialog
        productId={productId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};
