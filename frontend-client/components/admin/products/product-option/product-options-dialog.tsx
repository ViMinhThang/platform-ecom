import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ProductOptionCard } from "./product-option";
import { useProductOptions } from "@/providers/product-option-provider";
import { useState } from "react";
import { ProductOption } from "@/types/product/product-option";

interface BulkProductOptionDialogProps {
  productId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function OptionsContent() {
  const { options, createOption, updateOption, deleteOption } = useProductOptions();
  const [tempOptions, setTempOptions] = useState<ProductOption[]>([]);

  const handleAddOption = () => {
    setTempOptions(prev => [
      ...prev,
      {
        name: "",
        displayName: "",
        isRequired: false,
        sortOrder: 0,
        values: [],
      },
    ]);
  };

  const handleSave = async (data: ProductOption, isTemp: boolean, index: number) => {
    if (isTemp) {
      const result = await createOption(data);
      if (result) {
        // Remove from tempOptions on success
        setTempOptions((prev) => prev.filter((_, i) => i !== index));
      }
    } else {
      if (data.id) {
        await updateOption(data.id, data);
      }
    }
  };

  const handleDelete = async (optionId: number | undefined, isTemp: boolean, index: number) => {
    if (isTemp) {
      setTempOptions((prev) => prev.filter((_, i) => i !== index));
    } else if (optionId) {
      await deleteOption(optionId);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <ProductOptionCard
          key={option.id}
          option={option}
          onSave={(data) => handleSave(data, false, 0)}
          onDelete={() => handleDelete(option.id, false, 0)}
        />
      ))}

      {tempOptions.map((option, index) => (
        <ProductOptionCard
          key={"temp-option-" + index}
          option={option}
          onSave={(data) => handleSave(data, true, index)}
          onDelete={() => handleDelete(undefined, true, index)}
        />
      ))}

      <div
        className="flex items-center justify-center size-96 border-2 border-dashed rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        onClick={handleAddOption}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAddOption(); }}
        role="button"
        tabIndex={0}
      >
        <Plus className="size-12 text-zinc-400" />
      </div>
    </div>
  );
}

export function BulkProductOptionDialog({
  productId,
  open,
  onOpenChange,
}: BulkProductOptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80%] h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý tùy chọn sản phẩm</DialogTitle>
          <DialogDescription>
            Thêm nhiều tùy chọn và giá trị của chúng
          </DialogDescription>
        </DialogHeader>
        <OptionsContent />
      </DialogContent>
    </Dialog>
  );
}
