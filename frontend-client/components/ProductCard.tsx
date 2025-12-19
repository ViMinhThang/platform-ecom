import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ProductVariant } from "@/types/product";
import { imageUrl } from "@/lib/utils/imageUrl";
import { formatCurrency } from "@/lib/utils/formatCurrency";

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
      <Card className="p-0 group overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-card h-full flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
        <CardContent className="p-0 relative aspect-square bg-muted/20 overflow-hidden">
          {isNew && (
            <Badge className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-wider shadow-sm">
              MỚI
            </Badge>
          )}
          {hasSale && (
            <Badge className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-wider shadow-sm">
              GIẢM
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 z-20 flex items-center justify-center">
              <Badge variant="secondary" className="text-xs font-bold px-3 py-1 rounded-sm">
                HẾT HÀNG
              </Badge>
            </div>
          )}
          <Image
            src={imageUrl.product(displayImage)}
            alt={name}
            fill
            className="object-cover"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 space-y-2 flex-grow">
          <div className="flex-grow w-full">
            <h3 className="font-medium text-sm leading-snug line-clamp-2 text-foreground w-full">
              {name}
            </h3>
          </div>

          <div className="w-full pt-1">
            {/* Price */}
            <div className="flex items-baseline gap-2 w-full mb-1">
              {hasSale ? (
                <>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(salePrice)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                    {formatCurrency(displayPrice)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(displayPrice)}
                </span>
              )}
            </div>

            {/* Rating & Sold */}
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-sm">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating > 0 ? rating.toFixed(1) : "Mới"}</span>
              </div>
              {totalSold > 0 && (
                <span className="text-[10px]">Đã bán {formatSoldCount(totalSold)}</span>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
