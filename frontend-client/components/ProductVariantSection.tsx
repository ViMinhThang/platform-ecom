"use client";

import { useState } from "react";
import { ProductDetail, ProductVariant } from "@/types/product";
import { VariantSelector } from "./VariantSelector";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItemToCart } from "@/lib/store/slices/cartSlice";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
      toast.error("Please sign in to add items to cart");
      // router.push("/login"); 
      return;
    }

    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    try {
      await dispatch(addItemToCart({
        productId: product.id,
        quantity,
        variantId: selectedVariant ? selectedVariant.id : null,
        token: session.accessToken as string
      })).unwrap();
      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  // Fallback to product price if no variant selected (or range)
  const displayPrice = selectedVariant ? selectedVariant.price : 0;
  const displayStock = selectedVariant ? selectedVariant.stock : 0;
  const canAddToCart = (selectedVariant && displayStock > 0) || (!product.variants?.length); // If no variants, assume available? Or check product status?
  // Actually, if variants exist, must select one. If no variants, check product status?
  // ProductDetail interface has status.
  // But for now, let's assume if variants exist, selection is required.

  return (
    <div className="space-y-8">
      {/* Price Display */}
      <div>
        <div className="text-3xl font-bold text-blue-600">
          {selectedVariant && selectedVariant.salePrice !== undefined ? (
            <>
              <p className="text-base font-bold text-red-600">
                $
                {selectedVariant.salePrice !== null &&
                  selectedVariant.salePrice!.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                ${selectedVariant.price.toFixed(2)}
              </p>
            </>
          ) : (
            <p>
              {selectedVariant
                ? `$${selectedVariant.price.toFixed(2)}`
                : (product.variants && product.variants.length > 0 ? "Select an option" : `$${product.minPrice || 0}`)}
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
                {displayStock} in stock
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
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
        <span className="text-sm font-medium">Quantity</span>
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
          disabled={!canAddToCart && (product.variants?.length ?? 0) > 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {canAddToCart || !(product.variants?.length) ? "Add to Cart" : "Out of Stock"}
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
