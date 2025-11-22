import axios from "axios";
import { Category, CategoryResponse } from "@/types/category/category";

const API_BASE_URL = "http://localhost:8080/api/categories";
export const getCategories = async (
  token: string | undefined,
  params: any
): Promise<CategoryResponse> => {
  const response = await axios.get<CategoryResponse>(API_BASE_URL + "/public", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};
export const createCategory = async (
  data: Category,
  token: string
): Promise<Category> => {
  const response = await axios.post<Category>(API_BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const updateCategory = async (
  categoryId: number,
  data: Category,
  token: string
): Promise<Category> => {
  const response = await axios.put<Category>(
    `${API_BASE_URL}/${categoryId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
export const deleteCategory = async (
  categoryId: number,
  token: string
): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const updateCategoryImage = async (
  categoryId: number,
  imageFile: File,
  token: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await axios.put<string>(
    `${API_BASE_URL}/${categoryId}/image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const fetchCategory = async (
  categoryId: number,
  token: string
): Promise<Category> => {
  const response = await axios.get<Category>(
    `${API_BASE_URL}/${categoryId}/public`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
