import {VariantOptionValue } from "./product-option";

export type VariantFormValues = {
  id?: number;
  tempId?: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  optionValues: VariantOptionValue[];
  imageUrl: string;
};
 