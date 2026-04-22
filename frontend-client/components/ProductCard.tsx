"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductVariant } from "@/types/product";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useAnalytics } from "@/hooks/useAnalytics";
import { imageUrl } from "@/lib/utils/imageUrl";

import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  firstVariant?: ProductVariant;
  sourceContext?: string;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  description,
  firstVariant,
  sourceContext,
}: ProductCardProps) {
  const { trackProductClick } = useAnalytics();
  const displayPrice = firstVariant ? (firstVariant.salePrice || firstVariant.price) : price;
  const displayImage = firstVariant?.imageUrl || image;
  const hasSale = firstVariant && !!firstVariant.salePrice;
  const numericProductId = Number(id);

  const handleProductClick = () => {
    if (!Number.isNaN(numericProductId)) {
      trackProductClick(numericProductId, sourceContext || "product_card");
    }
  };

  return (
    <div className="group relative space-y-4 animate-in fade-in duration-700">
      <Link
        href={`/products/${slug}`}
        className="block overflow-hidden rounded-xl aspect-[4/5] bg-surface-container relative"
        onClick={handleProductClick}
      >
        {/* Sale Badge */}
        {hasSale && (
            <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold px-3 py-1 bg-primary text-white rounded-sm">
                    New Arrival
                </span>
            </div>
        )}

        <Image
          src={imageUrl.product(displayImage)}
          alt={name}
          fill
          className="object-contain p-8 transition-transform duration-700"
        />
      </Link>

      <div className="flex items-start justify-between gap-4 px-1">
        <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-bold text-sm text-foreground tracking-tight truncate">
              {name}
            </h3>
            <p className="text-[11px] font-medium text-foreground/40 line-clamp-1">
              {description}
            </p>
            <div className="pt-2">
                <span className="font-bold text-base text-foreground tracking-tight">
                    {formatCurrency(displayPrice)}
                </span>
            </div>
        </div>

        {/* Add to Cart Button */}
        <button className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
            <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
