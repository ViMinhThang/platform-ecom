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
  const visibleVariants = variants.filter(v => !v.hidden);

  const [selectedValues, setSelectedValues] = useState<Record<number, number>>(
    {}
  );

  // Deduplicate options by id (in case API returns duplicates)
  const uniqueOptions = options.filter(
    (option, index, self) => self.findIndex(o => o.id === option.id) === index
  );

  const sortedOptions = [...uniqueOptions].sort((a, b) => a.sortOrder - b.sortOrder);

  const valueIdToOptionId = new Map<number, number>();
  options.forEach((option) => {
    option.values.forEach((value) => {
      valueIdToOptionId.set(value.id, option.id);
    });
  });

  const findMatchingVariant = (
    selections: Record<number, number>
  ): ProductVariant | null => {
    return (
      visibleVariants.find((v) => {
        if (v.optionValues.length !== Object.keys(selections).length)
          return false;

        return v.optionValues.every((ov) => {
          const realOptionId = valueIdToOptionId.get(ov.productOptionValue.id);
          return (
            realOptionId !== undefined &&
            selections[realOptionId] === ov.productOptionValue.id
          );
        });
      }) || null
    );
  };

  const isValueAvailable = (optionId: number, valueId: number): boolean => {
    const optionIndex = sortedOptions.findIndex((opt) => opt.id === optionId);

    const upstreamSelections: Record<number, number> = {};
    for (let i = 0; i < optionIndex; i++) {
      const upstreamOptionId = sortedOptions[i].id;
      if (selectedValues[upstreamOptionId] !== undefined) {
        upstreamSelections[upstreamOptionId] = selectedValues[upstreamOptionId];
      }
    }


    return visibleVariants.some((v) => {
      const hasTargetValue = v.optionValues.some((ov) => {
        const realOptionId = valueIdToOptionId.get(ov.productOptionValue.id);
        return (
          realOptionId === optionId && ov.productOptionValue.id === valueId
        );
      });
      if (!hasTargetValue) return false;

      return Object.entries(upstreamSelections).every(
        ([upstreamOptId, upstreamValId]) => {
          return v.optionValues.some((ov) => {
            const realOptionId = valueIdToOptionId.get(
              ov.productOptionValue.id
            );
            return (
              realOptionId === Number(upstreamOptId) &&
              ov.productOptionValue.id === upstreamValId
            );
          });
        }
      );
    });
  };

  const getFirstAvailableValue = (optionId: number): number | null => {
    const option = sortedOptions.find((opt) => opt.id === optionId);
    if (!option) return null;

    const sortedValues = [...option.values].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

    for (const value of sortedValues) {
      if (isValueAvailable(optionId, value.id)) {
        return value.id;
      }
    }
    return null;
  };

  useEffect(() => {
    if (
      Object.keys(selectedValues).length === 0 &&
      sortedOptions.length > 0 &&
      visibleVariants.length > 0
    ) {
      const initialSelections: Record<number, number> = {};

      for (const option of sortedOptions) {
        const firstAvailable = getFirstAvailableValue(option.id);
        if (firstAvailable !== null) {
          initialSelections[option.id] = firstAvailable;
          setSelectedValues((prev) => ({
            ...prev,
            [option.id]: firstAvailable,
          }));
        }
      }

      setSelectedValues(initialSelections);
      const variant = findMatchingVariant(initialSelections);
      onVariantChange(variant);
    }
  }, [visibleVariants.length, options.length]); // Reinitialize if data changes

  // Handle option selection with cascading
  const handleOptionSelect = (optionId: number, valueId: number) => {
    const optionIndex = sortedOptions.findIndex((opt) => opt.id === optionId);
    const newSelections = { ...selectedValues, [optionId]: valueId };

    // Re-evaluate all downstream options (options after the changed one)
    for (let i = optionIndex + 1; i < sortedOptions.length; i++) {
      const downstreamOption = sortedOptions[i];
      const currentDownstreamValue = newSelections[downstreamOption.id];

      // Temporarily set upstream selections for availability check
      const tempSelections = { ...newSelections };
      for (let j = 0; j <= i - 1; j++) {
        tempSelections[sortedOptions[j].id] =
          newSelections[sortedOptions[j].id];
      }

      // Check if current downstream value is still valid
      const isCurrentValid =
        currentDownstreamValue !== undefined &&
        isValueAvailableWithSelections(
          downstreamOption.id,
          currentDownstreamValue,
          tempSelections
        );

      if (!isCurrentValid) {
        // Auto-select first available value
        const firstAvailable = getFirstAvailableValueWithSelections(
          downstreamOption.id,
          tempSelections
        );
        if (firstAvailable !== null) {
          newSelections[downstreamOption.id] = firstAvailable;
        } else {
          // No available values, remove selection
          delete newSelections[downstreamOption.id];
        }
      }
    }

    setSelectedValues(newSelections);
    const variant = findMatchingVariant(newSelections);
    onVariantChange(variant);
  };

  // Helper with explicit selections parameter for cascading logic
  const isValueAvailableWithSelections = (
    optionId: number,
    valueId: number,
    currentSelections: Record<number, number>
  ): boolean => {
    const optionIndex = sortedOptions.findIndex((opt) => opt.id === optionId);

    const upstreamSelections: Record<number, number> = {};
    for (let i = 0; i < optionIndex; i++) {
      const upstreamOptionId = sortedOptions[i].id;
      if (currentSelections[upstreamOptionId] !== undefined) {
        upstreamSelections[upstreamOptionId] =
          currentSelections[upstreamOptionId];
      }
    }

    return visibleVariants.some((v) => {
      const hasTargetValue = v.optionValues.some((ov) => {
        const realOptionId = valueIdToOptionId.get(ov.productOptionValue.id);
        return (
          realOptionId === optionId && ov.productOptionValue.id === valueId
        );
      });
      if (!hasTargetValue) return false;

      return Object.entries(upstreamSelections).every(
        ([upstreamOptId, upstreamValId]) => {
          return v.optionValues.some((ov) => {
            const realOptionId = valueIdToOptionId.get(
              ov.productOptionValue.id
            );
            return (
              realOptionId === Number(upstreamOptId) &&
              ov.productOptionValue.id === upstreamValId
            );
          });
        }
      );
    });
  };

  // Helper with explicit selections parameter
  const getFirstAvailableValueWithSelections = (
    optionId: number,
    currentSelections: Record<number, number>
  ): number | null => {
    const option = sortedOptions.find((opt) => opt.id === optionId);
    if (!option) return null;

    const sortedValues = [...option.values].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

    for (const value of sortedValues) {
      if (
        isValueAvailableWithSelections(optionId, value.id, currentSelections)
      ) {
        return value.id;
      }
    }
    return null;
  };

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
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600"
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
