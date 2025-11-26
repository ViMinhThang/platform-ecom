"use client";

import { useState, useEffect } from "react";
import { ProductOption, ProductVariant } from "@/types/product";
import { cn } from "@/lib/utils";

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
  const [selectedValues, setSelectedValues] = useState<Record<number, number>>(
    {}
  );
  // Initialize selections with first available variant or defaults
  useEffect(() => {
    if (Object.keys(selectedValues).length === 0 && variants.length > 0) {
      // Try to find first in-stock variant
      const defaultVariant = variants.find((v) => v.stock > 0) || variants[0];

      if (defaultVariant) {
        const initialSelections: Record<number, number> = {};
        defaultVariant.optionValues.forEach((ov) => {
          // Find which option this value belongs to
          // We need to map optionValueId back to optionId
          // The variant.optionValues has optionId directly
          initialSelections[ov.optionId] = ov.productOptionValue.id;
        });
        setSelectedValues(initialSelections);
        onVariantChange(defaultVariant);
      }
    }
  }, [variants, options]); // Run once when data loads

  const handleOptionSelect = (optionId: number, valueId: number) => {
    const newSelections = { ...selectedValues, [optionId]: valueId };
    setSelectedValues(newSelections);

    // Find matching variant
    const variant = variants.find((v) => {
      return (
        v.optionValues.every((ov) => {
          // Check if this variant's option value matches the selected value for this option
          const selectedValueId = newSelections[ov.optionId];
          return (
            selectedValueId === undefined ||
            selectedValueId === ov.productOptionValue.id
          );
        }) && v.optionValues.length === Object.keys(newSelections).length
      );
    });

    onVariantChange(variant || null);
  };

  // Helper to check if a value is available given OTHER current selections
  const isValueAvailable = (optionId: number, valueId: number) => {
    // Check if any variant matches this combination (partial match is okay for other unselected options)
    return variants.some((v) => {
      // 1. Check if variant has this specific option value we are testing
      const hasTargetValue = v.optionValues.some(
        (ov) => ov.optionId === optionId && ov.productOptionValue.id === valueId
      );
      console.log("hasTargetValue", hasTargetValue);
      if (!hasTargetValue) return false;

      // 2. Check if variant matches other currently selected options
      // We only care about options that are ALREADY selected, excluding the one we are currently testing
      return Object.entries(selectedValues).every(
        ([selectedOptIdStr, selectedValId]) => {
          const selectedOptId = Number(selectedOptIdStr);

          // Skip the option we are currently testing (since we want to see if it's compatible with OTHERS)
          if (selectedOptId === optionId) return true;

          // Check if this variant has the selected value for this other option
          return v.optionValues.some(
            (ov) =>
              ov.optionId === selectedOptId &&
              ov.productOptionValue.id === selectedValId
          );
        }
      );
    });
  };

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id}>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">
            {option.displayName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedValues[option.id] === value.id;
              const available = isValueAvailable(option.id, value.id);

              return (
                <button
                  key={value.id}
                  onClick={() => handleOptionSelect(option.id, value.id)}
                  disabled={!available} // Optional: disable invalid combinations
                  className={cn(
                    "px-4 py-2 rounded-md border text-sm font-medium transition-all",
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                      : "border-input hover:border-zinc-400 hover:bg-accent",
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
