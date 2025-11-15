"use client";

import { useProductOptions } from "@/providers/product-option-provider";
import { Controller, Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  VariantOptionValue,
  ProductOptionValue,
} from "@/types/product/product-option";
import { FormOption } from "@/types/base-form";

interface ProductVariantOptionsProps {
  control: Control<any>;
  namePrefix: string; // This should be "optionValues"
}

export const ProductVariantOptions: React.FC<ProductVariantOptionsProps> = ({
  control,
  namePrefix,
}) => {
  const { options } = useProductOptions();

  return (
    <Controller
      name={namePrefix}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        // The raw array from the form state (might have null optionId and duplicates)
        const rawOptionValues: VariantOptionValue[] = field.value || [];
        console.log("Raw option values from form state:", rawOptionValues);
        // --- NORMALIZATION & DE-DUPLICATION STEP ---
        // Use a Map to automatically handle de-duplication.
        // The key is the optionId. If the key already exists, the value is replaced.
        const optionMap = new Map<number, VariantOptionValue>();

        rawOptionValues.forEach((vov) => {
          // Find the parent option to get the correct optionId
          const parentOption = options.find((opt) =>
            opt.values.some((val) => val.id === vov.productOptionValue.id)
          );

          // If we found the parent option, add/update it in our map.
          if (parentOption && parentOption.id) {
            optionMap.set(parentOption.id, {
              ...vov,
              optionId: parentOption.id, // Ensure the optionId is set correctly
            });
          }
        });

        // Convert the map back to a clean, de-duplicated array.
        const cleanOptionValues = Array.from(optionMap.values());
        // --- END NORMALIZATION & DE-DUPLICATION ---

        return (
          <div className="space-y-4">
            {options.map((option) => {
              // Find the current selected value for this specific option using the clean data.
              const currentVariantOptionValue = cleanOptionValues.find(
                (v) => v.optionId === option.id
              );
              const currentSelectedId =
                currentVariantOptionValue?.productOptionValue?.id?.toString() ||
                "";

              const formOptions: FormOption[] = option.values.map((v) => ({
                value: v.id!.toString(),
                label: v.displayValue || v.value,
                disabled: false,
              }));

              const handleValueChange = (newSelectedId: string) => {
                const selectedProductOptionValue = option.values.find(
                  (v) => v.id?.toString() === newSelectedId
                );

                if (!selectedProductOptionValue) return;

                const newVariantOptionValue: VariantOptionValue = {
                  // Keep existing IDs if they exist, otherwise use defaults for new items.
                  id: currentVariantOptionValue?.id,
                  variantId: currentVariantOptionValue?.variantId || 0,
                  optionId: option.id!,
                  productOptionValue: selectedProductOptionValue,
                  priceModifier: currentVariantOptionValue?.priceModifier || 0,
                };

                // Update the clean array
                const updatedOptionValues = [...cleanOptionValues];
                const existingIndex = updatedOptionValues.findIndex(
                  (v) => v.optionId === option.id
                );

                if (existingIndex > -1) {
                  updatedOptionValues[existingIndex] = newVariantOptionValue;
                } else {
                  updatedOptionValues.push(newVariantOptionValue);
                }

                // Update the form state with the new, correct array
                field.onChange(updatedOptionValues);
              };

              return (
                <FormItem key={option.id}>
                  <FormLabel>{option.name}</FormLabel>
                  <Select
                    value={currentSelectedId}
                    onValueChange={handleValueChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${option.name}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            })}
          </div>
        );
      }}
    />
  );
};