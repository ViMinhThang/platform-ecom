"use client";

import { useState } from "react";
import { ProductDetail, ProductVariant } from "@/types/product";
import { VariantSelector } from "./VariantSelector";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { logger } from "@/lib/logger";
import { useAnalytics } from "@/hooks/useAnalytics";

import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getSaleCampaignPriceForVariant } from "@/lib/services/sale-campaign-service";
import { SaleCampaignItem } from "@/types/sale-campaign";
import { useEffect } from "react";

export function ProductVariantSection({
  product,
  onVariantChange,
}: {
  product: ProductDetail;
  onVariantChange?: (variant: ProductVariant | null) => void;
}) {
  const { trackAddToCart } = useAnalytics();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [saleInfo, setSaleInfo] = useState<SaleCampaignItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
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
      
      // Track add to cart
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
        <div className="py-4 px-5 bg-slate-50 rounded-lg border border-slate-100/50">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-3">
              {selectedVariant ? (
                <>
                  <span className="text-3xl font-bold text-[#FF4F00]">
                    {formatCurrency(saleInfo ? saleInfo.salePrice : selectedVariant.price)}
                  </span>
                  {saleInfo && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        {formatCurrency(selectedVariant.price)}
                      </span>
                      <Badge className="bg-[#FF4F00] hover:bg-[#FF4F00] text-white border-none text-[10px] font-bold px-1.5 py-0">
                        -{saleInfo.discountPercent}%
                      </Badge>
                    </>
                  )}
                </>
              ) : (
                <span className="text-3xl font-bold text-slate-900">
                  {hasVariants ? `${formatCurrency(product.minPrice || 0)} - ...` : formatCurrency(product.minPrice || 0)}
                </span>
              )}
            </div>
            {saleInfo && (
              <div className="flex items-center gap-1.5 text-[#FF4F00] text-[10px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 fill-current" />
                <span>Đang giảm</span>
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
          <span className="text-sm font-medium text-slate-600">Số Lượng</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-200 rounded-md bg-white">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-md rounded-r-none hover:bg-slate-50 border-r border-slate-200"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3.5 w-3.5 text-slate-600" />
              </Button>
              <div className="w-12 text-center text-sm font-semibold text-slate-900">{quantity}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-md rounded-l-none hover:bg-slate-50 border-l border-slate-200"
                onClick={() => setQuantity(Math.min(displayStock || 99, quantity + 1))}
                disabled={selectedVariant ? quantity >= displayStock : false}
              >
                <Plus className="h-3.5 w-3.5 text-slate-600" />
              </Button>
            </div>
            <span className="text-xs text-slate-500">
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
          className="flex-1 h-12 rounded-lg border-black text-black bg-white hover:bg-zinc-50 hover:border-[#FF4F00] hover:text-[#FF4F00] font-semibold text-sm shadow-sm transition-all"
          disabled={!canAddToCart}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm Vào Giỏ
        </Button>
        <Button
          size="lg"
          className="flex-1 h-12 rounded-lg bg-black text-white hover:bg-[#FF4F00] font-semibold text-sm shadow-sm border-none transition-all"
          disabled={!canAddToCart}
        // onClick={handleBuyNow}
        >
          Mua Ngay
        </Button>
      </div>

      {/* SKU Info */}
      {selectedVariant && (
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-4">
          {displayStock > 0 && <span className="text-green-600 font-medium">Còn hàng</span>}
          <span className="font-mono">{selectedVariant.sku}</span>
        </div>
      )}
    </div>
  );
}
