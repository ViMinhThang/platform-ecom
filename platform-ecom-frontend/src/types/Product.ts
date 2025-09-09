export type Product = {
  id: string;
  image: string;
  productName: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  category: string;
  slug: string;
  specialPrice: number;
  isAvailable: string;
  type: string;
  assets: Asset[];
};
export interface ProductResponse {
  content: Product[];
  pageNumber: number;
  pageSize: number;
  lastPage: boolean;
  totalPages: number;
  totalElements: number;
}
export interface Asset {
  assetId: string;
  url: string;
}

export interface ProductFormValues {
  productName: string;
  description: string;
  price: number;
  isAvailable: string;
  type: string;
  discount: number;
  category: string;
  slug: string;
  specialPrice: number;
  quantity: number;
  inStock: boolean;
  assets: (Asset | null)[];
}
