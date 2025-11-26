import Image from "next/image";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { ProductVariant } from "@/types/product";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  firstVariant?: ProductVariant;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  isNew,
  firstVariant,
}: ProductCardProps) {
  const displayPrice = firstVariant ? firstVariant.price : price;
  const displayImage = firstVariant?.imageUrl || image;
  const inStock = firstVariant ? firstVariant.stock > 0 : true;
  console.log(firstVariant);
  // Check if sale is active
  const hasSale =
    firstVariant?.salePrice !== undefined && firstVariant?.salePrice !== null;
  const salePrice = firstVariant?.salePrice;
  const totalSold = firstVariant?.totalSold || 0;

  return (
    <Link href={`/products/${id}`}>
      <Card className="p-0 group overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-md hover:shadow-md transition-shadow">
        <CardContent className="p-0 relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          {isNew && (
            <Badge className="absolute top-2 left-2 z-10 bg-blue-600 text-white hover:bg-blue-700 rounded-sm px-2 py-0.5 text-xs">
              New
            </Badge>
          )}
          {hasSale && (
            <Badge className="absolute top-2 right-2 z-10 bg-red-600 text-white hover:bg-red-700 rounded-sm px-2 py-0.5 text-xs">
              Sale
            </Badge>
          )}
          {!inStock && (
            <Badge variant="secondary" className="absolute top-2 right-2 z-10">
              Out of Stock
            </Badge>
          )}
          <Image
            src={`http://localhost:8080/uploads/products/${displayImage}`}
            alt={name}
            fill
            className="object-cover"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-3 space-y-2">
          <div className="space-y-1 w-full">
            <p className="text-xs text-muted-foreground">{category}</p>
            <h3 className="font-medium text-sm leading-tight line-clamp-2 h-10">
              {name}
            </h3>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {hasSale ? (
                  <>
                    <p className="text-base font-bold text-red-600">
                      ${salePrice!.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                      ${displayPrice.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-base font-bold text-blue-600">
                    ${displayPrice.toFixed(2)}
                  </p>
                )}
              </div>
              {totalSold > 0 && (
                <p className="text-xs text-muted-foreground">
                  {totalSold} sold
                </p>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
