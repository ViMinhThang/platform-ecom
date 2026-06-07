"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VariantImagePicker } from "./product-variant-image-picker";
import { useProductVariants } from "@/providers/product-variant-provider";
import { VariantFormValues } from "@/types/product/product-variant";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "@/components/admin/form-input";
import { ProductVariantOptions } from "./product-variant-option";
import { useState } from "react";
import { AlertModal } from "@/components/admin/alert-modal";
import { useToggleVariantVisibilityMutation } from "@/lib/store/admin";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface VariantCardProps {
  variant: VariantFormValues;
}

export const VariantCard: React.FC<VariantCardProps> = ({ variant }) => {
  const { saveVariant, removeVariant, productId } = useProductVariants();
  const [toggleVariantVisibility, { isLoading: isToggling }] = useToggleVariantVisibilityMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<VariantFormValues>({
    defaultValues: variant,
    mode: "onBlur",
  });

  const handleConfirm = async () => {
    setLoading(true);
    removeVariant(variant.id ?? variant.tempId);
    setIsOpen(false);
    setLoading(false);
  };

  const handleToggleVisibility = async () => {
    if (!variant.id || !productId) return;

    try {
      await toggleVariantVisibility({ productId, variantId: variant.id }).unwrap();
      toast.success(variant.hidden ? "Biến thể đã được hiển thị" : "Biến thể đã được ẩn");
    } catch (error) {
      toast.error("Không thể thay đổi hiển thị");
    }
  };

  const { handleSubmit, control, watch, setValue } = form;

  const isHidden = variant.hidden ?? false;
  const isNewVariant = !variant.id;

  return (
    <FormProvider {...form}>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
      />
      <Card className={`p-4 space-y-3 transition-all duration-300 ${isToggling ? 'opacity-40 scale-[0.99]' : ''} ${isHidden && !isToggling ? 'opacity-60 border-dashed' : ''}`}>
        {!isNewVariant && (
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              {isHidden ? (
                <EyeOff className="size-4 text-muted-foreground" />
              ) : (
                <Eye className="size-4 text-green-500" />
              )}
              <Label className="text-sm font-medium">
                {isHidden ? "Ẩn khỏi khách hàng" : "Hiển thị với khách hàng"}
              </Label>
            </div>
            <Switch
              checked={!isHidden}
              onCheckedChange={handleToggleVisibility}
              disabled={isToggling}
            />
          </div>
        )}

<div className="grid grid-cols-2 gap-3">
              <VariantImagePicker
                productId={productId}
                value={watch("imageUrl")}
                onSelect={(imageUrl) => setValue("imageUrl", imageUrl)}
              />

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    control={control}
                    name="sku"
                    label="SKU"
                    placeholder="SKU"
                    required
                  />
                  <FormInput
                    control={control}
                    name="price"
                    label="Giá"
                    type="number"
                    placeholder="Giá"
                    required
                  />
                  <FormInput
                    control={control}
                    name="stock"
                    label="Tồn kho"
                    type="number"
                    placeholder="Tồn kho"
                    required
                  />
                  <FormInput
                    control={control}
                    name="isActive"
                    label="Trạng thái"
                    type="text"
                    placeholder="Hoạt động / Bị khóa"
                  />
                </div>

                <ProductVariantOptions
                  control={control}
                  namePrefix="optionValues"
                />

                <div className="flex gap-2">
                  <Button variant="destructive" onClick={() => setIsOpen(true)}>
                    Xóa biến thể
                  </Button>
                  <Button
                    onClick={handleSubmit(async (data) => {
                      await saveVariant(data);
                    })}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </div>
      </Card>
    </FormProvider>
  );
};
