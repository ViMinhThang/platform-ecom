import { ProductOption } from "@/types/product/product-option";
import axios from "axios";

export const productOptionService = {
  async getOptions(productId: number, token?: string) {
    const res = await axios.get<ProductOption[]>(
      `http://localhost:8080/api/products/seller/${productId}/options`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async createOption(productId: number, option: ProductOption, token?: string) {
    const res = await axios.post<ProductOption>(
      `http://localhost:8080/api/products/seller/product-options/${productId}`,
      { ...option, isRequired: option.isRequired === "true" ? true : false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async updateOption(productId: number, optionId: number, option: ProductOption, token?: string) {
    const res =await axios.put(
      `http://localhost:8080/api/products/seller/product-options/${productId}/${optionId}`,
      { ...option, isRequired: option.isRequired === "true" ? true : false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data
  },

  async deleteOption(productId: number, optionId: number, token?: string) {
    await axios.delete(
      `http://localhost:8080/api/products/seller/product-options/${productId}/${optionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
};
