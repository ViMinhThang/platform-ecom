"use client";

import { ProductImage } from "@/types/product/product";
import { ProductImageCard } from "../product-image-cart";

interface ProductImageListProps {
  images: ProductImage[];
  deleteImage: (id: number) => void;
}

export const ProductImageList: React.FC<ProductImageListProps> = ({
  images,
  deleteImage,
}) => {
  if (!images.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6">
        No images uploaded yet.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start items-start">
      {images.map((img) => (
        <ProductImageCard key={img.id} image={img} onDelete={deleteImage} type="Delete" />
      ))}
    </div>
  );
};
