import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { OptionData } from "@/types/product/product-option";
import { productOptionService } from "@/services/productOptionService";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProductOptionContextValue {
  options: OptionData[]
  loading: boolean;
  addOption: () => void;
  deleteOption: (id?: number, index?: number) => void;
  saveOption: (data: OptionData, index: number) => Promise<void>;
  refreshOptions: () => void;
}

const ProductOptionContext = createContext<ProductOptionContextValue | undefined>(undefined);

export function ProductOptionProvider({ productId, children }: { productId: number; children: ReactNode }) {
  const { data: session } = useSession();
  const [options, setOptions] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshOptions = async () => {
    if (!productId || !session?.accessToken) return;
    setLoading(true);
    try {
      const data = await productOptionService.getOptions(productId, session.accessToken);
      setOptions(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch options");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOptions();
  }, [productId, session?.accessToken]);

  const addOption = () => {
    setOptions(prev => [
      ...prev,
      { name: "", displayName: "", isRequired: "false", sortOrder: 0, values: [{ value: "", displayValue: "", sortOrder: 0 }] },
    ]);
  };

  const deleteOption = (id?: number, index?: number) => {
    if (id) {
      productOptionService.deleteOption(productId, id, session?.accessToken).then(() => {
        toast.success("Option deleted");
        setOptions(prev => prev.filter((_, i) => i !== index));
      });
    } else if (index !== undefined) {
      setOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const saveOption = async (data: OptionData, index: number) => {
    try {
      if (data.id) {
        await productOptionService.updateOption(productId, data.id, data, session?.accessToken);
        toast.success(`Option "${data.displayName}" updated`);
        setOptions(prev => prev.map((o, i) => (i === index ? data : o)));
      } else {
        const created = await productOptionService.createOption(productId, data, session?.accessToken);
        setOptions(prev => prev.map((o, i) => (i === index ? created : o)));
        toast.success(`Option "${data.displayName}" created`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save option");
    }
  };

  return (
    <ProductOptionContext.Provider value={{ options, loading, addOption, deleteOption, saveOption, refreshOptions }}>
      {children}
    </ProductOptionContext.Provider>
  );
}

export function useProductOptions() {
  const context = useContext(ProductOptionContext);
  if (!context) throw new Error("useProductOptions must be used within ProductOptionProvider");
  return context;
}
