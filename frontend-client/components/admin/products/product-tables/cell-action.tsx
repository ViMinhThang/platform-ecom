"use client";
import { useState, useReducer } from "react";
import { AlertModal } from "@/components/admin/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconEdit,
  IconFileDescription,
  IconPhoto,
  IconTools,
  IconTrash,
} from "@tabler/icons-react";
import { ProductRow } from "@/types/product/product";
import { BulkProductOptionDialog } from "../product-option/product-options-dialog";
import { ProductVariantDialog } from "../product-variant/product-variant-dialog";
import { ProductImageDialog } from "../product-image/product-image-dialog";
import { ProductDialog } from "../product-form/product-form";
import { VariantFormValues } from "@/types/product/product-variant";
import { ProductOptionProvider } from "@/providers/product-option-provider";
import { ProductVariantProvider } from "@/providers/product-variant-provider";
import { useRouter } from "next/navigation";
import { useDeleteProductMutation } from "@/lib/store/admin";
import { toast } from "sonner";

interface CellActionProps {
  data: ProductRow;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { push } = useRouter();
  const [deleteProduct] = useDeleteProductMutation();
  const [dialogs, setDialogs] = useReducer(
    (prev: any, next: any) => ({ ...prev, ...next }),
    { loading: false, deleteOpen: false, updateProductOpen: false, updateOptionsOpen: false, updateVariantsOpen: false, updateImagesOpen: false }
  );

  const onConfirm = async () => {
    try {
      setDialogs({ loading: true });
      await deleteProduct(data.id).unwrap();
      setDialogs({ deleteOpen: false });
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
    } finally {
      setDialogs({ loading: false });
    }
  };

  return (
    <ProductVariantProvider productId={data.id}>
      <ProductOptionProvider productId={data.id}>
        <AlertModal
          isOpen={dialogs.deleteOpen}
          onClose={() => setDialogs({ deleteOpen: false })}
          onConfirm={onConfirm}
          loading={dialogs.loading}
        />

        <ProductDialog
          open={dialogs.updateProductOpen}
          onOpenChange={(v) => setDialogs({ updateProductOpen: v })}
          productId={data.id}
        />

        <BulkProductOptionDialog
          productId={data.id}
          open={dialogs.updateOptionsOpen}
          onOpenChange={(v) => setDialogs({ updateOptionsOpen: v })}
        />
        <ProductImageDialog
          productId={data.id}
          open={dialogs.updateImagesOpen}
          onOpenChange={(v) => setDialogs({ updateImagesOpen: v })}
        ></ProductImageDialog>
        <ProductVariantDialog
          open={dialogs.updateVariantsOpen}
          onOpenChange={(v) => setDialogs({ updateVariantsOpen: v })}
          productId={data.id}
          onSave={function (variants: VariantFormValues[]): Promise<void> {
            throw new Error("Chức năng chưa được triển khai.");
          }}
        />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Mở menu</span>
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>

            <DropdownMenuItem onClick={() => setDialogs({ updateProductOpen: true })}>
              <IconEdit className="mr-2 size-4" /> Cập nhật sản phẩm
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => push(`/admin/dashboard/product/${data.id}/description`)}>
              <IconFileDescription className="mr-2 size-4" /> Chỉnh sửa mô tả
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setDialogs({ updateOptionsOpen: true })}>
              <IconTools className="mr-2 size-4" /> Cập nhật tùy chọn
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setDialogs({ updateVariantsOpen: true })}>
              <IconTools className="mr-2 size-4" /> Cập nhật biến thể
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setDialogs({ updateImagesOpen: true })}>
              <IconPhoto className="mr-2 size-4" /> Cập nhật hình ảnh
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setDialogs({ deleteOpen: true })}>
              <IconTrash className="mr-2 size-4" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ProductOptionProvider>
    </ProductVariantProvider>
  );
};
