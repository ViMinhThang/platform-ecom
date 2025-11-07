export type VariantOptionValueForm = {
  id?: number; 
  optionName: string; 
  value: string;
};

export type VariantFormValues = {
  id?: number;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  optionValues: VariantOptionValueForm[];
  imageUrl?: string;
};
