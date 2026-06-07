"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconUpload } from "@tabler/icons-react";
import { useProductImages } from "@/hooks/product/use-product-images";
import { ProductImageList } from "./product-image-list";

interface ProductImageDialogProps {
  productId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductImageDialog: React.FC<ProductImageDialogProps> = ({
  productId,
  open,
  onOpenChange,
}) => {
  const { images, uploadImage, uploading, deleteImage } = useProductImages(productId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    uploadImage(files[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Hình ảnh sản phẩm</DialogTitle>
          <DialogDescription>
            Quản lý hình ảnh cho sản phẩm này. Bạn có thể tải lên, xóa hoặc đặt hình ảnh chính.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Button */}
          <div className="flex justify-between items-center">
            <Button asChild disabled={uploading}>
              <label className="flex items-center gap-2 cursor-pointer">
                <IconUpload size={18} /> Tải lên hình ảnh
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </Button>
          </div>

          {/* Image Listing */}
          <ProductImageList
            images={images}
            deleteImage={deleteImage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
