"use client";

import { useState, useEffect } from "react";
import { ProductDetail, ProductVariant } from "@/types/product";
import { VariantSelector } from "./VariantSelector";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAddToCartMutation } from "@/lib/store/api/clientApi";
import { logger } from "@/lib/logger";
import { useAnalytics } from "@/hooks/useAnalytics";

import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getSaleCampaignPriceForVariant } from "@/lib/services/sale-campaign-service";
import { SaleCampaignItem } from "@/types/sale-campaign";

export function ProductVariantSection({
  product,
  onVariantChange,
}: {
  product: ProductDetail;
  onVariantChange?: (variant: ProductVariant | null) => void;
}) {
  const { trackAddToCart } = useAnalytics();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [saleInfo, setSaleInfo] = useState<SaleCampaignItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCartMutation] = useAddToCartMutation();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchSalePrice = async () => {
      if (selectedVariant) {
        try {
          const data = await getSaleCampaignPriceForVariant(selectedVariant.id);
          setSaleInfo(data);
        } catch (error) {
          logger.error("Failed to fetch sale price:", error);
          setSaleInfo(null);
        }
      } else {
        setSaleInfo(null);
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
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Vui lòng chọn phân loại hàng");
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
        saleInfo ? saleInfo.salePrice : (selectedVariant ? selectedVariant.price : (product.minPrice || 0))
      );

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
    <div className="space-y-10">
      {/* Price Display */}
      <div className="space-y-8">
        {/* Price Display - Modern Clean */}
        <div className="py-5 px-6 bg-muted/30 rounded-sm border border-border shadow-inner">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-3">
              {selectedVariant ? (
                <>
                  <span className="text-3xl font-bold tracking-tighter text-primary">
                    {formatCurrency(saleInfo ? saleInfo.salePrice : selectedVariant.price)}
                  </span>
                  {saleInfo && (
                    <>
                      <span className="text-xs font-medium text-muted-foreground line-through decoration-muted-foreground/50">
                        {formatCurrency(selectedVariant.price)}
                      </span>
                      <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-widest uppercase">
                        -{saleInfo.discountPercent}%
                      </Badge>
                    </>
                  )}
                </>
              ) : (
                <span className="text-3xl font-bold tracking-tighter text-foreground">
                  {hasVariants ? `${formatCurrency(product.minPrice || 0)} - ...` : formatCurrency(product.minPrice || 0)}
                </span>
              )}
            </div>
            {saleInfo && (
              <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                <Zap className="w-3 h-3 fill-primary" />
                <span>GIÁ ƯU ĐÃI</span>
              </div>
            )}
          </div>
        </div>

        {/* Variant Selector - Standard */}
        {product.options && product.options.length > 0 && (
          <div className="space-y-6">
            <VariantSelector
              options={product.options}
              variants={product.variants}
              onVariantChange={handleVariantChange}
            />
          </div>
        )}

        {/* Quantity Selector - Standard */}
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Số Lượng</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-sm bg-background shadow-sm overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-sm hover:bg-muted/50 border-r border-border transition-colors flex items-center justify-center"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3.5 w-3.5 text-foreground opacity-60" />
              </Button>
              <div className="w-12 text-center text-xs font-bold text-foreground">{quantity}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-sm hover:bg-muted/50 border-l border-border transition-colors flex items-center justify-center"
                onClick={() => setQuantity(Math.min(displayStock || 99, quantity + 1))}
                disabled={selectedVariant ? quantity >= displayStock : false}
              >
                <Plus className="h-3.5 w-3.5 text-foreground opacity-60" />
              </Button>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
              {displayStock} sản phẩm có sẵn
            </span>
          </div>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 h-12 rounded-sm border-primary text-primary bg-background hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all"
          disabled={!canAddToCart}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-2" />
          Thêm Vào Giỏ
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest text-[10px] shadow-md border-none transition-all"
          disabled={!canAddToCart}
        // onClick={handleBuyNow}
        >
          Mua Ngay
        </Button>
      </div>

      {/* SKU Info */}
      {selectedVariant && (
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50 pt-2 font-header">
          {displayStock > 0 && <span className="text-primary font-bold">HÀNG CÓ SẴN</span>}
          <span className="">SKU: {selectedVariant.sku}</span>
        </div>
      )}
    </div>
  );
}
