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
    <div className="space-y-10">
      {/* Price Display */}
      <div className="bg-black text-white p-6 md:p-8">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-zinc-400">ĐƠN GIÁ // UNIT_PRICE</div>
        <div className="text-4xl md:text-5xl font-mono font-black tracking-tighter">
          {selectedVariant && selectedVariant.salePrice !== undefined ? (
            <div className="space-y-2">
              <p className="text-[#FF4400]">
                {selectedVariant.salePrice !== null &&
                  formatCurrency(selectedVariant.salePrice)}
              </p>
              <p className="text-xs text-zinc-500 line-through">
                {formatCurrency(selectedVariant.price)}
              </p>
            </div>
          ) : (
            <p>
              {selectedVariant
                ? formatCurrency(selectedVariant.price)
                : (hasVariants ? "0.000" : formatCurrency(product.minPrice || 0))}
            </p>
          )}
        </div>
        {selectedVariant && (
          <div className="mt-6">
            {displayStock > 0 ? (
              <span className="text-[10px] font-black tracking-widest uppercase border border-white/20 px-2 py-1">
                SẴN SÀNG: {displayStock} ĐƠN VỊ
              </span>
            ) : (
              <span className="text-[10px] font-black tracking-widest uppercase bg-[#FF4400] px-2 py-1">
                HẾT HÀNG // OUT_OF_STOCK
              </span>
            )}
          </div>
        )}
      </div>

      {/* Variant Selector */}
      {product.options && product.options.length > 0 && (
        <div className="pt-8 border-t-2 border-black">
          <h3 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-zinc-400">CẤU HÌNH // CONFIGURATION</h3>
          <VariantSelector
            options={product.options}
            variants={product.variants}
            onVariantChange={handleVariantChange}
          />
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex flex-col gap-4 pt-4 border-t-2 border-dashed border-black/10">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SỐ LƯỢNG // QUANTITY</span>
        <div className="flex items-center gap-px bg-black border-2 border-black w-fit">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none bg-white hover:bg-zinc-100"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-16 h-10 flex items-center justify-center bg-white font-mono font-bold">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none bg-white hover:bg-zinc-100 border-l-2 border-black"
            onClick={() => setQuantity(Math.min(displayStock || 99, quantity + 1))}
            disabled={selectedVariant ? quantity >= displayStock : false}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex flex-col gap-4 pt-6">
        <Button
          size="lg"
          className="w-full h-16 rounded-none bg-black text-white hover:bg-[#FF4400] font-black uppercase tracking-widest text-sm transition-all"
          disabled={!canAddToCart}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          {getButtonText().toUpperCase()} // INITIATE_TRANSFER
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 rounded-none border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-zinc-100">
            LƯU VÀO DANH SÁCH
          </Button>
          <Button variant="outline" className="h-12 rounded-none border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-zinc-100">
            CHIA SẺ DỮ LIỆU
          </Button>
        </div>
      </div>

      {/* SKU Info */}
      {selectedVariant && (
        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 pt-8 border-t-2 border-black">
          <span className="uppercase tracking-widest">PRODUCT_IDENTIFIER:</span>
          <span className="font-mono text-black">{selectedVariant.sku}</span>
        </div>
      )}
    </div>
  );
}
