"use client";
import {
  createCategory,
  deleteCategory,
  fetchCategory,
  getCategories,
  updateCategory,
  updateCategoryImage,
} from "@/services/category-service";
import { Category } from "@/types/category/category";
import { get } from "http";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface CategoryContextValue {
  categories: Category[];
  totalItems: number;
  loading: boolean;
  category: Category | null;
  fetchCategories: (token: string, params?: any) => Promise<void>;
  getCategory: (categoryId: number, token: string) => Promise<void | null>;
  createCategoryHandler: (data: any, token: string) => Promise<Category | null>;
  updateCategoryHandler: (
    categoryId: number,
    data: any,
    token: string
  ) => Promise<Category | null>;
  deleteCategoryHandler: (categoryId: number, token: string) => Promise<void>;
  uploadCategoryImage: (
    categoryId: number,
    imageFile: File,
    token: string
  ) => Promise<string>;
}
const CategoryContext = createContext<CategoryContextValue | undefined>(
  undefined
);
interface CategoryProviderProps {
  children: ReactNode;
}
export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const getCategory = useCallback(async (categoryId: number, token: string) => {
    setLoading(true);
    try {
      const res = await fetchCategory(categoryId, token);
      setCategory(res);
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const createCategoryHandler = useCallback(
    async (data: any, token: string) => {
      setLoading(true);
      try {
        const created = await createCategory(data, token);
        setCategories((prevCategories) => [...prevCategories, created]);
        return created;
      } catch (error) {
        console.error("Failed to create category:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const updateCategoryHandler = useCallback(
    async (categoryId: number, data: any, token: string) => {
      setLoading(true);
      try {
        const updated = await updateCategory(categoryId, data, token);
        setCategory(updated);
        setCategories((prevCategories) =>
          prevCategories.map((cat) => (cat.id === categoryId ? updated : cat))
        );
        return updated;
      } catch (error) {
        console.error("Failed to update category:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const fetchCategories = useCallback(async (token: string, params?: any) => {
    setLoading(true);
    try {
      const data = await getCategories(token, params);
      setCategories(data.content);
      setTotalItems(data.totalElements);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteCategoryHandler = useCallback(
    async (categoryId: number, token: string) => {
      setLoading(true);
      try {
        await deleteCategory(categoryId, token);
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat.id !== categoryId)
        );
      } catch (error) {
        console.error("Failed to delete category:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const uploadCategoryImage = useCallback(
    async (categoryId: number, imageFile: File, token: string) => {
      setLoading(true);
      try {
        const res = await updateCategoryImage(categoryId, imageFile, token);
        setCategory((prev) => (prev ? { ...prev, imageUrl: res } : null));
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === categoryId ? { ...cat, imageUrl: res } : cat
          )
        );
        return res;
      } catch (error) {
        console.error("Failed to upload category image:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <CategoryContext.Provider
      value={{
        categories,
        totalItems,
        loading,
        category,
        fetchCategories,
        getCategory,
        createCategoryHandler,
        uploadCategoryImage,
        updateCategoryHandler,
        deleteCategoryHandler,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
export const useCategoryContext = (): CategoryContextValue => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};
