"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types/product/product";

interface ProductImageCardProps {
  image: ProductImage;
  onDelete?: (id: number) => void;
  onSelect?: (url: string) => void;

  type: "Select" | "Delete";
  setOpen?: (open: boolean) => void;
}
export const ProductImageCard: React.FC<ProductImageCardProps> = ({
  image,
  onDelete,
  type,
  onSelect,
  setOpen,
}) => {
  const handleSelect = () => {
    if (!setOpen) return;
    if (onSelect) onSelect(image.imageUrl);
    setOpen(false);
  };

  return (
    <Card
      key={image.id}
      className={cn(
        "relative group overflow-hidden shadow-sm rounded-lg w-[350px] h-[200px] p-0"
      )}
    >
      <CardContent className="p-0 relative w-full h-full">
        <Image
          src={`http://localhost:8080/uploads/${image.imageUrl}`}
          alt="Product image"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
          {type && type === "Delete" && (
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete && onDelete(image.id)}
            >
              <IconTrash className="h-5 w-5" />
            </Button>
          )}
          {type && type === "Select" && (
            <Button size="icon" onClick={handleSelect}>
              <IconCheck className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
