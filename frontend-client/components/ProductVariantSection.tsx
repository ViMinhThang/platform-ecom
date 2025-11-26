"use client";

import { useState } from "react";
import { ProductDetail, ProductVariant } from "@/types/product";
import { VariantSelector } from "./VariantSelector";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";

export function ProductVariantSection({ product }: { product: ProductDetail }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  // Fallback to product price if no variant selected (or range)
  const displayPrice = selectedVariant ? selectedVariant.price : 0;
  const displayStock = selectedVariant ? selectedVariant.stock : 0;
  const canAddToCart = selectedVariant && displayStock > 0;

  return (
    <div className="space-y-8">
      {/* Price Display */}
      <div>
        <div className="text-3xl font-bold text-blue-600">
          {selectedVariant ? (
            `$${displayPrice.toFixed(2)}`
          ) : (
            <span className="text-xl text-muted-foreground">
              Select options to see price
            </span>
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
            onVariantChange={setSelectedVariant}
          />
        </div>
      )}

      {/* Add to Cart */}
      <div className="flex gap-4 pt-2">
        <Button
          size="lg"
          className="flex-1 h-12 text-base"
          disabled={!canAddToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {canAddToCart ? "Add to Cart" : "Out of Stock"}
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
