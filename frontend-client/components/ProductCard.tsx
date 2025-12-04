import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ProductVariant } from "@/types/product";
import { imageUrl } from "@/lib/utils/imageUrl";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  rating?: number;
  soldCount?: number;
  firstVariant?: ProductVariant;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  category,
  isNew,
  rating = 0,
  soldCount = 0,
  firstVariant,
}: ProductCardProps) {
  const displayPrice = firstVariant ? firstVariant.price : price;
  const displayImage = firstVariant?.imageUrl || image;
  const inStock = firstVariant ? firstVariant.stock > 0 : true;

  const hasSale = firstVariant?.salePrice !== undefined && firstVariant?.salePrice !== null;
  const salePrice = firstVariant?.salePrice;
  const totalSold = soldCount || firstVariant?.totalSold || 0;

  const formatSoldCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Link href={`/products/${slug}`}>
      <Card className="p-0 group overflow-hidden border border-border rounded-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0 relative aspect-square bg-muted overflow-hidden">
          {isNew && (
            <Badge className="absolute top-1 left-1 z-10 bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5 text-[9px]">
              New
            </Badge>
          )}
          {hasSale && (
            <Badge className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-sm px-1.5 py-0.5 text-[9px]">
              Sale
            </Badge>
          )}
          {!inStock && (
            <Badge variant="secondary" className="absolute top-1 right-1 z-10 text-[9px]">
              Sold out
            </Badge>
          )}
          <Image
            src={imageUrl.product(displayImage)}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-2 space-y-1">
          <h3 className="font-normal text-xs leading-tight line-clamp-2 h-8 text-foreground group-hover:text-primary transition-colors w-full">
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-1.5 w-full">
            {hasSale ? (
              <>
                <span className="text-sm font-semibold text-red-500">
                  ${salePrice!.toFixed(2)}
                </span>
                <span className="text-[10px] text-muted-foreground line-through">
                  ${displayPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-primary">
                ${displayPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating & Sold */}
          <div className="flex items-center justify-between w-full text-[10px] text-muted-foreground">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating > 0 ? rating.toFixed(1) : "0.0"}</span>
            </div>
            {totalSold > 0 && (
              <span>{formatSoldCount(totalSold)} sold</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
