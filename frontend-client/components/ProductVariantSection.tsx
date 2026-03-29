"use client";

import { useState, useEffect } from "react";
import { ProductDetail, ProductVariant } from "@/types/product";
import { VariantSelector } from "./VariantSelector";
import { Button } from "./ui/button";
import { Minus, Plus, ShoppingBag, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/lib/store/api/clientApi";
import { logger } from "@/lib/logger";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getSaleCampaignPriceForVariant } from "@/lib/services/sale-campaign-service";

export function ProductVariantSection({
  product,
  onVariantChange,
}: {
  product: ProductDetail;
  onVariantChange?: (variant: ProductVariant | null) => void;
}) {
  const { trackAddToCart } = useAnalytics();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCartMutation] = useAddToCartMutation();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSalePrice = async () => {
      if (selectedVariant) {
        try {
          await getSaleCampaignPriceForVariant(selectedVariant.id);
        } catch (error) {
          logger.error("Failed to fetch sale price:", error);
        }
      }
    };
    fetchSalePrice();
  }, [selectedVariant]);

  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
    onVariantChange?.(variant);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Vui lòng đăng nhập để thực hiện giao dịch");
      return;
    }

    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Vui lòng lựa chọn đặc tính vật phẩm");
      return;
    }

    try {
      await addToCartMutation({
        productId: product.id,
        quantity,
        variantId: selectedVariant ? selectedVariant.id : undefined,
      }).unwrap();
      
      trackAddToCart(
        product.id, 
        selectedVariant ? selectedVariant.id : 0, 
        quantity, 
        selectedVariant ? selectedVariant.price : (product.minPrice || 0)
      );

      toast.success("Vật phẩm đã được đưa vào bộ sưu tập");
    } catch (error) {
      logger.error("Failed to add to cart:", error);
      toast.error("Giao dịch không thành công");
    }
  };

  const displayStock = selectedVariant ? selectedVariant.stock : 0;
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const isVariantSelected = !!selectedVariant;
  const canAddToCart = !hasVariants || (isVariantSelected && displayStock > 0);

  return (
    <div className="space-y-12">
      {/* Variant Selector */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-6">
          <VariantSelector
            options={product.options}
            variants={product.variants}
            onVariantChange={handleVariantChange}
          />
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Số lượng bản sao</span>
          <div className="flex items-center border border-foreground/10 bg-background overflow-hidden">
            <button
              className="h-10 w-10 flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-20"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <div className="w-12 text-center text-xs font-bold">{quantity}</div>
            <button
              className="h-10 w-10 flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-20"
              onClick={() => setQuantity(Math.min(displayStock || 99, quantity + 1))}
              disabled={selectedVariant ? quantity >= displayStock : false}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button
            size="lg"
            className="w-full h-14 bg-primary text-white hover:bg-primary/95 font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm transition-all flex items-center justify-center gap-3 group"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Đưa vào bộ sưu tập
          </Button>
        </div>

        {selectedVariant && (
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">
            <span>SKU: {selectedVariant.sku}</span>
            <span>{displayStock > 0 ? `${displayStock} BẢN SAO SẴN CÓ` : "HẾT LƯU TRỮ"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
