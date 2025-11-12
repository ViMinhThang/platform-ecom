export interface VariantOptionValue {
  productOptionValue: ProductOptionValue;
  id?:number;
  value: string;
  displayValue: string;
  sortOrder?: number;
}
export interface ProductOptionValue {
  productOption: OptionData;
  id?:number;
  value: string;
  displayValue: string;
  sortOrder?: number;
}

export interface OptionData {
  id?:number;
  name: string;
  displayName: string;
  isRequired: string;
  sortOrder?: number;
  values: ProductOptionValue[];
}


export type OptionType = "SELECT" | "TEXT" | "NUMBER";
