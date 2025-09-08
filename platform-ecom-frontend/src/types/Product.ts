export type Product = {
  id: string;
  image: string;
  productName: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  specialPrice: number;
};
export interface ProductResponse {
  content: Product[];
  pageNumber: number;
  pageSize: number;
  lastPage:boolean;
  totalPages: number;
  totalElements: number;
}