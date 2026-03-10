import Image from "next/image";
import { Star, Zap } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ProductVariant } from "@/types/product";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useAnalytics } from "@/hooks/useAnalytics";
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
  sourceContext?: string;
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
  sourceContext = 'feed',
}: ProductCardProps) {
  const { trackProductClick } = useAnalytics();

  const displayPrice = firstVariant ? (firstVariant.salePrice || firstVariant.price) : price;
  const originalPrice = firstVariant ? firstVariant.price : price;
  const hasSale = firstVariant && !!firstVariant.salePrice;
  const discountPercent = firstVariant?.discountPercent;
  const displayImage = firstVariant?.imageUrl || image;
  const inStock = firstVariant ? firstVariant.stock > 0 : true;
  console.log(displayImage);
  const totalSold = soldCount || firstVariant?.totalSold || 0;

  const handleTrackClick = () => {
    trackProductClick(Number(id), sourceContext);
  };

  const formatSoldCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Link href={`/products/${slug}`} onClick={handleTrackClick}>
      <Card className="p-0 border-2 border-black rounded-none bg-white h-full flex flex-col transition-all group overflow-hidden">
        <CardContent className="p-0 relative aspect-square bg-zinc-100 overflow-hidden border-b-2 border-black transition-all duration-500">
          {isNew && !hasSale && (
            <Badge className="absolute top-0 left-0 z-10 bg-primary text-white rounded-none px-2 py-1 text-[8px] font-black tracking-widest uppercase">
              HÀNG MỚI
            </Badge>
          )}

          {hasSale && (
            <>
              <Badge className="absolute top-0 left-0 z-10 bg-primary text-white rounded-none px-2 py-1 text-[10px] font-black tracking-widest">
                -{discountPercent}%
              </Badge>
              <Badge className="absolute top-0 right-0 z-10 bg-black text-white rounded-none px-2 py-1 text-[8px] font-black tracking-widest flex items-center gap-1">
                <Zap className="h-3 w-3" />
                SALE
              </Badge>
            </>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-white/90 z-20 flex items-center justify-center">
              <span className="text-[10px] font-black px-4 py-2 border-2 border-black text-black uppercase tracking-widest">
                HẾT HÀNG
              </span>
            </div>
          )}
          <Image
            src={imageUrl.product(displayImage)}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 space-y-4 grow bg-white transition-colors">
          <div className="grow w-full">
            <h3 className="font-black text-[10px] uppercase tracking-widest leading-tight line-clamp-2 text-black transition-colors h-8">
              {name}
            </h3>
          </div>

          <div className="w-full pt-4 border-t border-black/10 transition-colors">
            {/* Price */}
            <div className="flex items-baseline gap-2 w-full mb-3 font-mono">
              <span className="text-xl font-black tracking-tighter text-primary">
                {formatCurrency(displayPrice)}
              </span>
              {hasSale && (
                <span className="text-[10px] font-bold text-zinc-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>

            {/* Rating & Sold - Technical Style */}
            <div className="flex items-center justify-between w-full font-mono">
              <div className="flex items-center gap-1 bg-zinc-100 px-1.5 py-0.5 transition-colors">
                <Star className="w-2.5 h-2.5 fill-current text-primary" />
                <span className="text-[8px] font-black text-black uppercase leading-none">
                  {rating > 0 ? rating.toFixed(1) : "N/A"}
                </span>
              </div>
              <div className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
                ĐÃ BÁN {formatSoldCount(totalSold)}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
