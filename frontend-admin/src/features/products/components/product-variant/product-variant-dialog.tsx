"use client";

import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { useEffect } from "react";
import { VariantFormValues } from "@/types/product-variant";
import { OptionValuesFieldArray } from "./product-variant-option";

interface ProductVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  initialVariants?: VariantFormValues[];
  onSave: (variants: VariantFormValues[]) => Promise<void>;
}

export const ProductVariantDialog: React.FC<ProductVariantDialogProps> = ({
  open,
  onOpenChange,
  productId,
  initialVariants = [],
  onSave,
}) => {
  const methods = useForm<{ variants: VariantFormValues[] }>({
    defaultValues: { variants: initialVariants },
  });

  const { control, handleSubmit, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    if (open) {
      reset({ variants: initialVariants });
    }
  }, [open]);

  const onSubmit = async (data: { variants: VariantFormValues[] }) => {
    await onSave(data.variants);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Product Variants</DialogTitle>
          <DialogDescription>
            Add, edit, or remove variants for this product.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-3">
                  <div className="flex flex-col gap-3">
                    {/* SKU, Price, Stock, Active */}
                    <div className="grid grid-cols-4 gap-3">
                      <FormInput
                        control={control}
                        name={`variants.${index}.sku`}
                        label="SKU"
                        placeholder="SKU"
                        required
                      />
                      <FormInput
                        control={control}
                        name={`variants.${index}.price`}
                        label="Price"
                        type="number"
                        placeholder="0.00"
                        required
                      />
                      <FormInput
                        control={control}
                        name={`variants.${index}.stock`}
                        label="Stock"
                        type="number"
                        placeholder="0"
                        required
                      />
                      <FormSelect
                        control={control}
                        name={`variants.${index}.isActive`}
                        label="Active"
                        options={[
                          { value: "true", label: "Yes" },
                          { value: "false", label: "No" },
                        ]}
                      />
                    </div>

                    {/* Option Values */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Options</h4>
                      <OptionValuesFieldArray index={index} control={control} />
                    </div>

                    {/* Image (optional) */}
                    {/* You can plug in your ImagePicker here */}
                    {/* <ImagePicker name={`variants.${index}.imageUrl`} control={control} label="Image" /> */}

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Delete Variant
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                append({
                  sku: "",
                  price: 0,
                  stock: 0,
                  isActive: true,
                  optionValues: [],
                  imageUrl: "",
                })
              }
            >
              + Add Variant
            </Button>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
