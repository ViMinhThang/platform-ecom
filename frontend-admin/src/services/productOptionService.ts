import { ProductOption } from "@/types/product/product-option";
import { APIResponse } from "@/types/api-response";
import axios from "axios";

export const productOptionService = {
  async getOptions(productId: number, token?: string) {
    const res = await axios.get<APIResponse<ProductOption[]>>(
      `http://localhost:8080/api/products/seller/${productId}/options`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  },

  async createOption(productId: number, option: ProductOption, token?: string) {
    const res = await axios.post<APIResponse<ProductOption>>(
      `http://localhost:8080/api/products/seller/product-options/${productId}`,
      { ...option, isRequired: option.isRequired === "true" ? true : false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  },

  async updateOption(productId: number, optionId: number, option: ProductOption, token?: string) {
    const res = await axios.put<APIResponse<ProductOption>>(
      `http://localhost:8080/api/products/seller/product-options/${productId}/${optionId}`,
      { ...option, isRequired: option.isRequired === "true" ? true : false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  },

  async deleteOption(productId: number, optionId: number, token?: string) {
    await axios.delete<APIResponse<string>>(
      `http://localhost:8080/api/products/seller/product-options/${productId}/${optionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
};
