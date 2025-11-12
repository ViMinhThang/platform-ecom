"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VariantImagePicker } from "./product-variant-image-picker";
import { useProductVariants } from "@/providers/product-variant-provider";
import { VariantFormValues } from "@/types/product/product-variant";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { useProductOptions } from "@/providers/product-option-provider";
import { ProductVariantOptions } from "./product-variant-option";
interface VariantCardProps {
  variant: VariantFormValues & { variantId?: number };
  index: number;
}

export const VariantCard: React.FC<VariantCardProps> = ({ variant, index }) => {
  const { saveVariant, removeVariant, productId } = useProductVariants();
  const form = useForm<VariantFormValues>({
    defaultValues: variant,
    mode: "onBlur",
  });

  const { handleSubmit, control, watch, setValue } = form;
  const optionValues = watch("optionValues");
  return (
    <FormProvider {...form}>
      <Card key={variant.variantId ?? index} className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Image Picker */}
          <VariantImagePicker
            productId={productId}
            value={watch("imageUrl")}
            onChange={(url) => setValue("imageUrl", url)}
          />

          {/* Fields */}
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
                label="Price"
                type="number"
                placeholder="Price"
                required
              />
              <FormInput
                control={control}
                name="stock"
                label="Stock"
                type="number"
                placeholder="Stock"
                required
              />
              <FormInput
                control={control}
                name="isActive"
                label="Status"
                type="text"
                placeholder="Active / Inactive"
              />
            </div>

            <ProductVariantOptions
              control={control}
              namePrefix="optionValues"
              value={watch("optionValues")}
            />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => removeVariant(index)}
              >
                Delete Variant
              </Button>
              <Button
                onClick={handleSubmit(async (data) => {
                  await saveVariant(index);
                })}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </FormProvider>
  );
};
