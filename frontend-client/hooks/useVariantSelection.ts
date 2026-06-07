import { useState, useEffect, useMemo, useCallback } from "react";
import { ProductOption, ProductVariant } from "@/types/product";

interface UseVariantSelectionProps {
    options: ProductOption[];
    variants: ProductVariant[];
    onVariantChange: (variant: ProductVariant | null) => void;
}

export function useVariantSelection({
    options,
    variants,
    onVariantChange,
}: UseVariantSelectionProps) {
    const visibleVariants = useMemo(
        () => variants.filter((v) => !v.hidden),
        [variants]
    );

    const [selectedValues, setSelectedValues] = useState<Record<number, number>>(
        {}
    );

    // Deduplicate options by id (in case API returns duplicates)
    const uniqueOptions = useMemo(() => {
        return options.filter(
            (option, index, self) => self.findIndex((o) => o.id === option.id) === index
        );
    }, [options]);

    const sortedOptions = useMemo(
        () => uniqueOptions.toSorted((a, b) => a.sortOrder - b.sortOrder),
        [uniqueOptions]
    );

    const valueIdToOptionId = useMemo(() => {
        const map = new Map<number, number>();
        options.forEach((option) => {
            option.values.forEach((value) => {
                map.set(value.id, option.id);
            });
        });
        return map;
    }, [options]);

    const findMatchingVariant = useCallback(
        (selections: Record<number, number>): ProductVariant | null => {
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
        },
        [visibleVariants, valueIdToOptionId]
    );

    // Helper with explicit selections parameter for cascading logic
    const isValueAvailableWithSelections = useCallback(
        (
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
        },
        [sortedOptions, visibleVariants, valueIdToOptionId]
    );

    const isValueAvailable = useCallback(
        (optionId: number, valueId: number): boolean => {
            return isValueAvailableWithSelections(optionId, valueId, selectedValues);
        },
        [isValueAvailableWithSelections, selectedValues]
    );

    const getFirstAvailableValueWithSelections = useCallback(
        (
            optionId: number,
            currentSelections: Record<number, number>
        ): number | null => {
            const option = sortedOptions.find((opt) => opt.id === optionId);
            if (!option) return null;

            const sortedValues = option.values.toSorted(
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
        },
        [sortedOptions, isValueAvailableWithSelections]
    );

    const getFirstAvailableValue = useCallback(
        (optionId: number): number | null => {
            return getFirstAvailableValueWithSelections(optionId, selectedValues);
        },
        [getFirstAvailableValueWithSelections, selectedValues]
    );


    // Handle option selection with cascading
    const handleOptionSelect = useCallback(
        (optionId: number, valueId: number) => {
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
        },
        [
            sortedOptions,
            selectedValues,
            isValueAvailableWithSelections,
            getFirstAvailableValueWithSelections,
            findMatchingVariant,
            onVariantChange,
        ]
    );

    // Initialize default selections
    useEffect(() => {
        if (
            Object.keys(selectedValues).length === 0 &&
            sortedOptions.length > 0 &&
            visibleVariants.length > 0
        ) {
            const initialSelections: Record<number, number> = {};

            // We need a temporary state to build up selections for validity checks
            // We can't use selectedValues from state here as we are building it

            let tempSelectionsForInit: Record<number, number> = {};

            for (const option of sortedOptions) {
                // Use the specialized helper directly or logic similar to getFirstAvailableValue
                // but we need to pass the accumulating selections
                const optionId = option.id;
                const sortedValues = option.values.toSorted((a, b) => a.sortOrder - b.sortOrder);

                let foundValueId: number | null = null;

                for (const value of sortedValues) {
                    // Check using base helper
                    if (isValueAvailableWithSelections(optionId, value.id, tempSelectionsForInit)) {
                        foundValueId = value.id;
                        break;
                    }
                }

                if (foundValueId !== null) {
                    tempSelectionsForInit[optionId] = foundValueId;
                    initialSelections[optionId] = foundValueId;
                }
            }

            setSelectedValues(initialSelections);
            const variant = findMatchingVariant(initialSelections);
            onVariantChange(variant);
        }
    }, [visibleVariants.length, options.length, sortedOptions, visibleVariants, findMatchingVariant, onVariantChange, isValueAvailableWithSelections]);


    return {
        sortedOptions,
        selectedValues,
        isValueAvailable,
        handleOptionSelect,
    };
}
