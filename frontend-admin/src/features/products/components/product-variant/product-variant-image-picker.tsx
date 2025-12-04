"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProductImages, ProductImage } from "@/lib/store/slices/productImageSlice";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductImageCard } from "../product-image-cart";

interface VariantImagePickerProps {
  productId: number;
  value: string;
  onSelect: (newUrl: string) => void;
}

export const VariantImagePicker: React.FC<VariantImagePickerProps> = ({
  productId,
  value,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { imagesByProductId, loading } = useAppSelector(
    (state) => state.productImages
  );

  const images = imagesByProductId[productId] || [];

  useEffect(() => {
    if (open && !images.length) {
      dispatch(fetchProductImages(productId));
    }
  }, [open, productId, dispatch, images.length]);




  return (
    <>
      <div
        className="relative h-full cursor-pointer border rounded-md overflow-hidden"
        onClick={() => setOpen(true)}
      >
        {value ? (
          <Image
            src={`http://localhost:8080/uploads/products/${value}`}
            alt="Variant Image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            Select Image
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[800px] h-[800px]">
          <DialogHeader>
            <DialogTitle>Select Variant Image</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div>Loading images...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img) => (
                <ProductImageCard
                  key={img.id}
                  setOpen={setOpen}
                  image={img}
                  type="Select"
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
