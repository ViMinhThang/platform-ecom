"use client";

import { ProductOption, ProductVariant } from "@/types/product";
import { cn } from "@/lib/utils";
import { useVariantSelection } from "@/hooks/useVariantSelection";

interface VariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | null) => void;
}

export function VariantSelector({
  options,
  variants,
  onVariantChange,
}: VariantSelectorProps) {
  const { sortedOptions, selectedValues, handleOptionSelect, isValueAvailable } =
    useVariantSelection({
      options,
      variants,
      onVariantChange,
    });

  return (
    <div className="space-y-6">
      {sortedOptions.map((option, index) => (
        <div key={`option-${option.id}-${index}`}>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">
            {option.displayName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {[...option.values]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((value) => {
                const isSelected = selectedValues[option.id] === value.id;
                const available = isValueAvailable(option.id, value.id);

                return (
                  <button
                    key={value.id}
                    onClick={() => handleOptionSelect(option.id, value.id)}
                    disabled={!available}
                    className={cn(
                      "px-4 py-2 rounded-md border text-sm font-medium transition-all",
                      isSelected
                        ? "border-black bg-black text-white ring-1 ring-[#FF4F00]"
                        : "border-input hover:border-[#FF4F00] hover:text-[#FF4F00] hover:bg-zinc-50",
                      !available &&
                      "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                    )}
                  >
                    {value.displayValue}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
