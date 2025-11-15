"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VariantImagePicker } from "./product-variant-image-picker";
import { useProductVariants } from "@/providers/product-variant-provider";
import { VariantFormValues } from "@/types/product/product-variant";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { ProductVariantOptions } from "./product-variant-option";
import { useState } from "react";
import { AlertModal } from "@/components/modal/alert-modal";

interface VariantCardProps {
  variant: VariantFormValues;
}

export const VariantCard: React.FC<VariantCardProps> = ({ variant }) => {
  const { saveVariant, removeVariant, productId } = useProductVariants();
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

  const { handleSubmit, control, watch, setValue } = form;


  return (
    <FormProvider {...form}>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
      />
      <Card className="p-4 space-y-3">
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
            />

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="destructive" onClick={() => setIsOpen(true)}>
                Delete Variant
              </Button>
              <Button
                onClick={handleSubmit(async (data) => {
                  console.log("Saving variant", data);
                  await saveVariant(data);
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
