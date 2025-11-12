"use client";

import { useProductOptions } from "@/providers/product-option-provider";
import { Controller, Control } from "react-hook-form";
import { FormSelect } from "@/components/forms/form-select";
import {
  ProductOptionValue,
  VariantOptionValue,
} from "@/types/product/product-option";
import { FormOption } from "@/types/base-form";
import { useEffect } from "react";

interface ProductVariantOptionsProps {
  control: Control<any>;
  namePrefix: string;
  value: VariantOptionValue[];
}

export const ProductVariantOptions: React.FC<ProductVariantOptionsProps> = ({
  control,
  namePrefix,
  value,
}) => {
  const { options } = useProductOptions();
  console.log(options, "options")
  return (
    <div className="space-y-4">
      {options.map((option) => {
        const selected = value?.find((v) =>
          option.values.some((optVal) => optVal.id === v.productOptionValue?.id)
        );


        const formOptions: FormOption[] = option.values.map((v) => ({
          value: v.id!.toString(),
          label: v.displayValue || v.value,
          disabled: false,
        }));

        return (
          <Controller
            key={option.id}
            control={control}
            name={`${namePrefix}.option_${option.id}`}
            defaultValue={selected?.productOptionValue?.id?.toString() || ""}
            render={({ field }) => (
              <FormSelect
                key={field.value}
                control={control}
                label={option.name}
                placeholder={`Select ${option.name}`}
                options={formOptions}
                required
                name={field.name}
              />
            )}
          />
        );
      })}
    </div>
  );
};
