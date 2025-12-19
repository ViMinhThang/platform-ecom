"use client";

import { useState } from "react";
import { ProductDetail, ProductVariant } from "@/types/product";
import { VariantSelector } from "./VariantSelector";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { logger } from "@/lib/logger";

import { formatCurrency } from "@/lib/utils/formatCurrency";

export function ProductVariantSection({
  product,
  onVariantChange,
}: {
  product: ProductDetail;
  onVariantChange?: (variant: ProductVariant | null) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();

  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
    onVariantChange?.(variant);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      // router.push("/login"); 
      return;
    }

    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Vui lòng chọn phân loại hàng");
      return;
    }

    try {
      await dispatch(addToCart({
        productId: product.id,
        quantity,
        variantId: selectedVariant ? selectedVariant.id : undefined,
      })).unwrap();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      logger.error("Failed to add to cart:", error);
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };

  // Fallback to product price if no variant selected (or range)
  const displayPrice = selectedVariant ? selectedVariant.price : 0;
  const displayStock = selectedVariant ? selectedVariant.stock : 0;
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const isVariantSelected = !!selectedVariant;
  const canAddToCart = !hasVariants || (isVariantSelected && displayStock > 0);

  const getButtonText = () => {
    if (hasVariants && !isVariantSelected) return "Chọn phân loại";
    if (displayStock === 0) return "Hết hàng";
    return "Thêm vào giỏ hàng";
  };

  return (
    <div className="space-y-8">
      {/* Price Display */}
      <div>
        <div className="text-3xl font-bold text-primary">
          {selectedVariant && selectedVariant.salePrice !== undefined ? (
            <>
              <p className="text-base font-bold text-red-600">
                {selectedVariant.salePrice !== null &&
                  formatCurrency(selectedVariant.salePrice)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                {formatCurrency(selectedVariant.price)}
              </p>
            </>
          ) : (
            <p>
              {selectedVariant
                ? formatCurrency(selectedVariant.price)
                : (hasVariants ? "Chọn tùy chọn" : formatCurrency(product.minPrice || 0))}
            </p>
          )}
        </div>
        {selectedVariant && (
          <div className="mt-2">
            {displayStock > 0 ? (
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-700 border-green-500/20"
              >
                Còn {displayStock} sản phẩm
              </Badge>
            ) : (
              <Badge variant="destructive">Hết hàng</Badge>
            )}
          </div>
        )}
      </div>

      {/* Variant Selector */}
      {product.options && product.options.length > 0 && (
        <div className="border-t pt-6">
          <VariantSelector
            options={product.options}
            variants={product.variants}
            onVariantChange={handleVariantChange}
          />
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 pt-4">
        <span className="text-sm font-medium">Số lượng</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.min(displayStock || 99, quantity + 1))}
            disabled={selectedVariant ? quantity >= displayStock : false}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex gap-4 pt-2">
        <Button
          size="lg"
          className="flex-1 h-12 text-base"
          disabled={!canAddToCart}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {getButtonText()}
        </Button>
        <Button size="lg" variant="outline" className="h-12 w-12 p-0">
          ♡
        </Button>
      </div>

      {/* SKU Info */}
      {selectedVariant && (
        <div className="text-xs text-muted-foreground pt-4 border-t">
          SKU: {selectedVariant.sku}
        </div>
      )}
    </div>
  );
}
