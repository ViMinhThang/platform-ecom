"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/services/product-image-service";

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
        <Card
          key={img.id}
          className={cn(
            "relative group overflow-hidden border shadow-sm rounded-lg w-[350px] h-[200px] p-0"
          )}
        >
          <CardContent className="p-0 relative w-full h-full">
            <Image
              src={`http://localhost:8080/uploads/${img.imageUrl}`}
              alt="Product image"
              fill
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
              <Button
                size="icon"
                variant="destructive"
                onClick={() => deleteImage(img.id)}
              >
                <IconTrash className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
