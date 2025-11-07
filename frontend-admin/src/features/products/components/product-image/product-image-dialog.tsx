"use client";

import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconUpload } from "@tabler/icons-react";
import { useProductImages } from "@/hooks/use-product-images";
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
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { images, uploadImage, uploading, deleteImage } = useProductImages(productId, token);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    uploadImage(files[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Images</DialogTitle>
          <DialogDescription>
            Manage images for this product. You can upload, delete, or set a main image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Button */}
          <div className="flex justify-between items-center">
            <label htmlFor="file-upload">
              <Button asChild disabled={uploading}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <IconUpload size={18} /> Upload Images
                </div>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
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
