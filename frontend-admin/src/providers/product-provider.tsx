"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { Product, ProductRow } from "@/types/product/product";
import {
  getProductById,
  createProduct,
  updateProduct,
  getProducts,
} from "@/services/product-service";
import { useSession } from "next-auth/react";

interface ProductContextValue {
  loading: boolean;
  product: Product | null;
  fetchProduct: (productId: number) => Promise<void>;
  createProductHandler: (
    data: any,
  ) => Promise<ProductRow | null>;
  updateProductHandler: (
    productId: number,
    data: any,
  ) => Promise<Product | null>;
  fetchProducts: ( params?: any) => Promise<void>;
  products: ProductRow[];
  totalItems: number;
}

const ProductContext = createContext<ProductContextValue | undefined>(
  undefined
);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const fetchProduct = useCallback(async (productId: number) => {
    setLoading(true);
    try {
      const res = await getProductById(productId, token);
      setProduct(res);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createProductHandler = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const created = await createProduct(data, token);
      setProducts((prevProducts) => [...prevProducts, created]);
      return created;
    } catch (error) {
      console.error("Failed to create product:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateProductHandler = useCallback(
    async (productId: number, data: any) => {
      setLoading(true);
      try {
        const updated = await updateProduct(productId, data, token);
        setProduct(updated);
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod.id === updated.id ? { ...prod, ...updated } : prod
          )
        );
        return updated;
      } catch (error) {
        console.error("Failed to update product:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );
  const fetchProducts = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const data = await getProducts(token, params);
      setProducts(data.content);
      setTotalItems(data.totalElements);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, [token]);
  return (
    <ProductContext.Provider
      value={{
        loading,
        product,
        fetchProduct,
        createProductHandler,
        updateProductHandler,
        fetchProducts,
        products,
        totalItems,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextValue => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProductContext must be used within a ProductProvider");
  return context;
};
