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
          <h4 className="text-[10px] font-bold mb-3 uppercase tracking-widest text-muted-foreground">
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
                      "px-5 py-2 rounded-sm border text-[11px] font-bold uppercase tracking-widest transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/30 shadow-sm"
                        : "border-border bg-background hover:border-primary/50 hover:text-primary transition-colors",
                      !available &&
                      "opacity-30 cursor-not-allowed grayscale"
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
