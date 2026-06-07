"use client";

import { useState } from "react";
import { useGetProductImagesQuery } from "@/lib/store/admin";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductImageCard } from "../product-image/product-image-cart";

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
  const { data: images = [], isLoading } = useGetProductImagesQuery(productId);

  return (
    <>
      <div
        className="relative h-full cursor-pointer border rounded-md overflow-hidden"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true); }}
        role="button"
        tabIndex={0}
      >
        {value ? (
          <Image
            src={`http://localhost:8080/uploads/${value}`}
            alt="Hình ảnh biến thể"
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-zinc-400">
            Chọn hình ảnh
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[800px] h-[800px]">
          <DialogHeader>
            <DialogTitle>Chọn hình ảnh biến thể</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div>Đang tải hình ảnh…</div>
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
