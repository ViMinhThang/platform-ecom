import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { ProductOptionCard } from "./product-option";
import { productOptionService } from "@/services/productOptionService";
import { ProductOptionDTO } from "@/types/product-option";
import { useProductOptionManager } from "@/hooks/use-product-option";

interface BulkProductOptionDialogProps {
  productId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductOptionFormSchema = z.object({
  options: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, "Name required"),
      displayName: z.string().min(1, "Display name required"),
      isRequired: z.string(),
      sortOrder: z.number().optional(),
      values: z.array(
        z.object({
          z: z.number().optional(),
          value: z.string().min(1, "Value required"),
          displayValue: z.string().min(1, "Display value required"),
          sortOrder: z.number().optional(),
        })
      ),
    })
  ),
});

type ProductOptionFormValues = z.infer<typeof ProductOptionFormSchema>;

export function BulkProductOptionDialog({
  productId,
  open,
  onOpenChange,
}: BulkProductOptionDialogProps) {
  const { data: session, status } = useSession();

  const methods = useForm<ProductOptionFormValues>({
    resolver: zodResolver(ProductOptionFormSchema),
    defaultValues: {
      options: [
        {
          name: "",
          displayName: "",
          isRequired: "false",
          sortOrder: 0,
          values: [{ value: "", displayValue: "", sortOrder: 0 }],
        },
      ],
    },
  });
  const { loadingIndex, saveOption, deleteOption} = useProductOptionManager(
    productId,
    session?.accessToken,
    methods
  );
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: methods.control,
    name: "options",
  });

  if (status === "loading") return <div>Loading session...</div>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80%] h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Product Options</DialogTitle>
          <DialogDescription>
            Add multiple options and their values
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <div className="flex flex-wrap gap-4">
            {optionFields.map((optionField, optionIndex) => (
              <ProductOptionCard
                key={optionField.id}
                control={methods.control}
                onDelete={deleteOption}
                optionIndex={optionIndex}
                removeOption={removeOption}
                onSave={saveOption}
                loading={loadingIndex === optionIndex}
                index={0}
              />
            ))}

            {/* Add Option Button */}
            <div
              className="flex items-center justify-center w-96 h-96 border-2 border-dashed rounded-lg cursor-pointer hover:bg-neutral-500"
              onClick={() =>
                appendOption({
                  name: "",
                  displayName: "",
                  isRequired: "false",
                  sortOrder: 0,
                  values: [{ value: "", displayValue: "", sortOrder: 0 }],
                })
              }
            >
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
