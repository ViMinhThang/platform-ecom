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
      <Card className="p-0 group overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-none bg-white dark:bg-card h-full flex flex-col transition-none">
        <CardContent className="p-0 relative aspect-square bg-muted/20 overflow-hidden">
          {isNew && (
            <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground rounded-none px-2 py-0.5 text-[9px] font-black tracking-widest uppercase">
              MỚI
            </Badge>
          )}
          {hasSale && (
            <Badge className="absolute top-3 right-3 z-10 bg-black text-white rounded-none px-2 py-0.5 text-[9px] font-black tracking-widest uppercase">
              GIẢM
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 z-20 flex items-center justify-center backdrop-blur-[2px]">
              <Badge variant="secondary" className="text-[10px] font-black px-4 py-1.5 rounded-none border-2 border-zinc-900 bg-transparent text-zinc-900 uppercase tracking-widest">
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
        <CardFooter className="flex flex-col items-start p-4 space-y-3 flex-grow bg-white dark:bg-zinc-950">
          <div className="flex-grow w-full">
            <h3 className="font-bold text-xs uppercase tracking-tight leading-tight line-clamp-2 text-foreground w-full">
              {name}
            </h3>
          </div>

          <div className="w-full pt-1 border-t border-zinc-100 dark:border-zinc-900 pt-3">
            {/* Price */}
            <div className="flex items-baseline gap-2 w-full mb-2">
              {hasSale ? (
                <>
                  <span className="text-lg font-black tracking-tighter text-primary">
                    {formatCurrency(salePrice)}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground line-through decoration-muted-foreground/50">
                    {formatCurrency(displayPrice)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-black tracking-tighter text-primary">
                  {formatCurrency(displayPrice)}
                </span>
              )}
            </div>

            {/* Rating & Sold */}
            <div className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-primary/5 text-primary px-2 py-1">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span>{rating > 0 ? rating.toFixed(1) : "New"}</span>
              </div>
              {totalSold > 0 && (
                <span>Sold {formatSoldCount(totalSold)}</span>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
