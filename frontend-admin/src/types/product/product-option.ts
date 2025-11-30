export interface VariantOptionValue {
  productOptionValue: ProductOptionValue;
  id?: number;
  variantId: number;
  optionId: number;
  priceModifier: number;
}
export interface ProductOptionValue {
  id?: number;
  value: string;
  displayValue: string;
  sortOrder?: number;
}

export interface ProductOption {
  id?: number;
  name: string;
  displayName: string;
  isRequired: boolean;
  sortOrder?: number;
  values: ProductOptionValue[];
}

export type OptionType = "SELECT" | "TEXT" | "NUMBER";
