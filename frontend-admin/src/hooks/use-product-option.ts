

import { useState, useEffect } from "react";
import { productOptionService } from "@/services/productOptionService";
import { ProductOptionDTO } from "@/types/product-option";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export function useProductOptionManager(
  productId: number,
  token?: string,
  methods?: UseFormReturn<any>
) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  // fetch
  useEffect(() => {
    if (!productId || !token || !methods) return;
    const fetchOptions = async () => {
      try {
        const data = await productOptionService.getOptions(productId, token);
        methods.reset({ options: data });
      } catch (err) {
        console.error("Failed to fetch product options", err);
      }
    };
    fetchOptions();
  }, [productId, token, methods]);

  // save
  const saveOption = async (index: number) => {
    const option = methods?.getValues(`options.${index}`);
    if (!option) return;

    setLoadingIndex(index);
    try {
      if (option.id) {
        await productOptionService.updateOption(productId, option.id, option, token);
        toast.success(`Option "${option.displayName}" updated`);
      } else {
        const created = await productOptionService.createOption(productId, option, token);
        methods?.setValue(`options.${index}.id`, created.id);
        toast.success(`Option "${option.displayName}" created`);
      }
    } finally {
      setLoadingIndex(null);
    }
  };

  // delete
  const deleteOption = async (index: number) => {
    const option = methods?.getValues(`options.${index}`);
    if (option?.id) {
      await productOptionService.deleteOption(productId, option.id, token);
      toast.success(`Option "${option.displayName}" deleted`);
    }
    methods?.unregister(`options.${index}`);
  };

  return {
    loadingIndex,
    saveOption,
    deleteOption,
    setLoadingIndex
  };
}
