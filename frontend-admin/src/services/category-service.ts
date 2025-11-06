
import axios from "axios";
import { CategoryResponse } from "@/types/category";

export const getCategories = async (token: string|undefined): Promise<CategoryResponse> => {
  const response = await axios.get<CategoryResponse>(
    "http://localhost:8080/api/categories",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
