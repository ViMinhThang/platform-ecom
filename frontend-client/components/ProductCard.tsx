"use client";

import Image from "next/image";
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
  firstVariant?: ProductVariant;
  sourceContext?: string;
  soldCount?: number;
  rating?: number;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  category,
  firstVariant,
  sourceContext = 'feed',
}: ProductCardProps) {
  const { trackProductClick } = useAnalytics();

  const displayPrice = firstVariant ? (firstVariant.salePrice || firstVariant.price) : price;
  const hasSale = firstVariant && !!firstVariant.salePrice;
  const displayImage = firstVariant?.imageUrl || image;
  const inStock = firstVariant ? firstVariant.stock > 0 : true;

  const handleTrackClick = () => {
    trackProductClick(Number(id), sourceContext);
  };

  return (
    <Link 
        href={`/products/${slug}`} 
        onClick={handleTrackClick} 
        className="group block space-y-4 animate-in fade-in duration-700"
    >
      <div className="relative aspect-square overflow-hidden bg-[#1c1917]/5 rounded-[4px] shadow-sm">
        {/* Subtle Labels */}
        {!inStock && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <span className="text-[10px] font-bold px-4 py-2 bg-foreground text-background uppercase tracking-widest">
              TẠM HẾT
            </span>
          </div>
        )}
        
        {hasSale && inStock && (
            <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold px-2 py-1 bg-primary text-white uppercase tracking-widest">
                    GIÁ TỐT
                </span>
            </div>
        )}

        <Image
          src={imageUrl.product(displayImage)}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 font-labels">
          {category}
        </span>
        
        <h3 className="font-labels font-bold text-sm tracking-tight leading-tight text-foreground/90 line-clamp-2 h-10 transition-colors">
          {name}
        </h3>
        
        <div className="pt-1">
            <span className="font-labels font-bold text-lg text-primary tracking-tight">
                {formatCurrency(displayPrice)}
            </span>
        </div>
      </div>
    </Link>
  );
}
