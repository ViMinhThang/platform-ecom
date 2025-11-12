"use client";

import { useState, useEffect } from "react";

import {
  getProductImages,
  ProductImage,
} from "@/services/product-image-service"; // backend service
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
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
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: token } = useSession();
  console.log(value,"Image url")
  useEffect(() => {
    if (!open) return;

    const fetchImages = async () => {
      setLoading(true);
      if (!token || !token.accessToken) return;
      const accessToken = token.accessToken;
      try {
        const imgs = await getProductImages(productId, accessToken);
        setImages(imgs);
      } catch (err) {
        console.error("Failed to fetch product images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [open, productId]);


  

  return (
    <>
      <div
        className="relative h-full cursor-pointer border rounded-md overflow-hidden"
        onClick={() => setOpen(true)}
      >
        {value ? (
          <Image
            src={`http://localhost:8080/uploads/${value}`}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Select Variant Image</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div>Loading images...</div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
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
