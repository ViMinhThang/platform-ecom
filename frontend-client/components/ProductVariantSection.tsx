"use client";

import { useState } from "react";
import { ProductDetail, ProductVariant } from "@/types/product";
import { VariantSelector } from "./VariantSelector";
import { Button } from "./ui/button";
import { Minus, Plus, ShoppingBag, CheckCircle2, Truck, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/lib/store/api/clientApi";
import { useAnalytics } from "@/hooks/useAnalytics";

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
      toast.error("Vui lòng chọn phân loại sản phẩm");
      return;
    }

    try {
      await addToCartMutation({
        productId: product.id,
        quantity,
        variantId: selectedVariant ? selectedVariant.id : undefined,
      }).unwrap();
      
      trackAddToCart(product.id, selectedVariant ? selectedVariant.id : 0, quantity, selectedVariant ? selectedVariant.price : (product.minPrice || 0));
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      toast.error("Lỗi khi thêm vào giỏ hàng");
    }
  };

  const displayStock = selectedVariant ? selectedVariant.stock : 0;
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const isVariantSelected = !!selectedVariant;
  const canAddToCart = !hasVariants || (isVariantSelected && displayStock > 0);

  return (
    <div className="space-y-10">
      {/* Variant Selector */}
      {product.options && product.options.length > 0 && (
        <VariantSelector
          options={product.options}
          variants={product.variants}
          onVariantChange={handleVariantChange}
        />
      )}

      {/* Highlights List */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Chi tiết & Tiện ích</h4>
        <ul className="space-y-3">
          {[
            "Dung tích 1.5L, phù hợp cho gia đình",
            "Có thể sử dụng với máy rửa bát",
            "Nguồn gốc bền vững từ Oaxaca",
            "Kiểu dáng thủ công độc bản"
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm font-medium text-foreground/70">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Số lượng</span>
            <div className="flex items-center bg-surface-container rounded-full overflow-hidden">
                <button
                    className="h-9 w-9 flex items-center justify-center hover:bg-surface-container-high transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                >
                    <Minus className="h-3 w-3" />
                </button>
                <div className="w-8 text-center text-xs font-bold">{quantity}</div>
                <button
                    className="h-9 w-9 flex items-center justify-center hover:bg-surface-container-high transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                >
                    <Plus className="h-3 w-3" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
            <Button
                size="xl"
                className="w-full rounded-full bg-primary text-white hover:brightness-110 h-14 font-bold text-sm tracking-tight"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
            >
                Thêm vào giỏ hàng
            </Button>
            <Button
                size="xl"
                variant="secondary"
                className="w-full rounded-full bg-[#d4e3ff] text-[#001c38] hover:bg-[#c2d6ff] h-14 font-bold text-sm tracking-tight"
                disabled={!canAddToCart}
            >
                Mua ngay
            </Button>
        </div>

        {/* Shipping Trust Signal */}
        <div className="mt-8 p-6 bg-surface-container rounded-2xl flex items-start gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">Giao hàng toàn cầu miễn phí</p>
                <p className="text-[11px] font-medium text-foreground/40">Giao hàng dự kiến trong 5-7 ngày làm việc</p>
            </div>
            <Info className="h-4 w-4 text-foreground/20 ml-auto" />
        </div>
      </div>
    </div>
  );
}
