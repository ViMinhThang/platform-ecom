"use client";
import { useState } from "react";
import { AlertModal } from "@/components/modal/alert-modal";
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
  IconPhoto,
  IconTools,
  IconTrash,
} from "@tabler/icons-react";
import { ProductRow } from "@/types/product";
import { ProductDialog } from "../product-form";
import { BulkProductOptionDialog } from "../product-options-dialog";
import { ProductOptionProvider } from "@/provider/ProductOptionProvider";

interface CellActionProps {
  data: ProductRow;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateProductOpen, setUpdateProductOpen] = useState(false);
  const [updateOptionsOpen, setUpdateOptionsOpen] = useState(false);
  const [updateVariantsOpen, setUpdateVariantsOpen] = useState(false);
  const [updateImagesOpen, setUpdateImagesOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      // await axios.delete(`/api/products/${data.id}`);
      console.log(`Product ${data.id} deleted`);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🧩 Delete confirmation modal */}
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <ProductDialog
        open={updateProductOpen}
        onOpenChange={setUpdateProductOpen}
        productId={data.id} 
      />

      <BulkProductOptionDialog
        productId={data.id} 
        open={updateOptionsOpen}
        onOpenChange={setUpdateOptionsOpen} 
      />

      {/* <ProductVariantsDialog
        open={updateVariantsOpen}
        onOpenChange={setUpdateVariantsOpen}
        productId={data.id}
        variants={data.variants}
        options={data.options}
      /> */}

      <Dialog open={updateImagesOpen} onOpenChange={setUpdateImagesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Images</DialogTitle>
            <DialogDescription>
              Here you can update the product images.
            </DialogDescription>
          </DialogHeader>
          <div>Images for {data.name}</div>
        </DialogContent>
      </Dialog>

      {/* 🧩 Dropdown Actions */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setUpdateProductOpen(true)}>
            <IconEdit className="mr-2 h-4 w-4" /> Update Product
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setUpdateOptionsOpen(true)}>
            <IconTools className="mr-2 h-4 w-4" /> Update Options
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setUpdateVariantsOpen(true)}>
            <IconTools className="mr-2 h-4 w-4" /> Update Variants
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setUpdateImagesOpen(true)}>
            <IconPhoto className="mr-2 h-4 w-4" /> Update Images
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
