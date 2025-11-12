import { OptionData, ProductOptionValue, VariantOptionValue } from "./product-option";

export type VariantFormValues = {
  id?: number;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  optionValues: VariantOptionValue[];
  imageUrl: string;
};
 