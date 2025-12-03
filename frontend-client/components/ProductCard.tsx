import Image from "next/image";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { ProductVariant } from "@/types/product";
import { logger } from "@/lib/logger";
import { imageUrl } from "@/lib/utils/imageUrl";

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
  logger.debug('ProductCard variant:', { firstVariant });
  // Check if sale is active
  const hasSale =
    firstVariant?.salePrice !== undefined && firstVariant?.salePrice !== null;
  const salePrice = firstVariant?.salePrice;
  const totalSold = firstVariant?.totalSold || 0;

  return (
    <Link href={`/products/${id}`}>
      <Card className="p-0 group overflow-hidden border border-border rounded-md hover:border-primary transition-colors">
        <CardContent className="p-0 relative aspect-square bg-secondary overflow-hidden">
          {isNew && (
            <Badge className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-2 py-0.5 text-[10px]">
              New
            </Badge>
          )}
          {hasSale && (
            <Badge className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm px-2 py-0.5 text-[10px]">
              Sale
            </Badge>
          )}
          {!inStock && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 z-10 text-[10px]"
            >
              Out of Stock
            </Badge>
          )}
          <Image
            src={imageUrl.product(displayImage)}
            alt={name}
            fill
            className="object-cover transition-transform duration-300"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-2.5 space-y-1.5">
          <div className="space-y-1 w-full">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {category}
            </p>
            <h3 className="font-medium text-sm leading-tight line-clamp-2 h-9 text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center justify-between w-full pt-1">
              <div className="flex items-center gap-1.5">
                {hasSale ? (
                  <>
                    <p className="text-sm font-bold text-accent">
                      ${salePrice!.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground line-through">
                      ${displayPrice.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-primary">
                    ${displayPrice.toFixed(2)}
                  </p>
                )}
              </div>
              {totalSold > 0 && (
                <p className="text-[10px] text-muted-foreground">
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
