import axios from "axios";
import { ProductOptionDTO } from "@/types/product-option";

export const productOptionService = {
  async getOptions(productId: number, token?: string) {
    const res = await axios.get<ProductOptionDTO[]>(
      `http://localhost:8080/api/products/seller/${productId}/options`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async createOption(productId: number, option: ProductOptionDTO, token?: string) {
    const res = await axios.post<ProductOptionDTO>(
      `http://localhost:8080/api/products/seller/product-options/${productId}`,
      { ...option, isRequired: option.isRequired === "true" ? true : false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async updateOption(productId: number, optionId: number, option: ProductOptionDTO, token?: string) {
    await axios.put(
      `http://localhost:8080/api/products/seller/product-options/${productId}/${optionId}`,
      { ...option, isRequired: option.isRequired === "true" ? true : false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  async deleteOption(productId: number, optionId: number, token?: string) {
    await axios.delete(
      `http://localhost:8080/api/products/seller/product-options/${productId}/${optionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
};
