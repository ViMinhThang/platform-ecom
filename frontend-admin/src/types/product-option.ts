export interface ProductOptionValueDTO {
  value: string;
  displayValue: string;
  sortOrder?: number;
}

export interface ProductOptionDTO {
  id?:number;
  name: string;
  displayName: string;
  isRequired: string;
  sortOrder?: number;
  values: ProductOptionValueDTO[];
}


export type OptionType = "SELECT" | "TEXT" | "NUMBER";
