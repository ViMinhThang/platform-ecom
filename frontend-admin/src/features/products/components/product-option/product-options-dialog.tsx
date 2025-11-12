import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ProductOptionCard } from "./product-option";
import { ProductOptionProvider, useProductOptions } from "@/providers/product-option-provider";

interface BulkProductOptionDialogProps {
  productId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function OptionsContent() {
  const { options, addOption, deleteOption, saveOption } = useProductOptions();

  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option, index) => (
        <ProductOptionCard
          key={option.id ?? index}
          option={option}
          onSave={(data) => saveOption(data, index)}
          onDelete={() => deleteOption(option.id, index)}
        />
      ))}

      <div
        className="flex items-center justify-center w-96 h-96 border-2 border-dashed rounded-lg cursor-pointer hover:bg-neutral-500"
        onClick={addOption}
      >
        <Plus className="w-12 h-12 text-gray-400" />
      </div>
    </div>
  );
}

export function BulkProductOptionDialog({ productId, open, onOpenChange }: BulkProductOptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80%] h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Product Options</DialogTitle>
          <DialogDescription>Add multiple options and their values</DialogDescription>
        </DialogHeader>

        <ProductOptionProvider productId={productId}>
          <OptionsContent />
        </ProductOptionProvider>
      </DialogContent>
    </Dialog>
  );
}
