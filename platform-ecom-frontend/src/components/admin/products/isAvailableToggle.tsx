import { Badge } from "@/components/ui/badge";
import type { ProductFormValues } from "@/types/Product";
import { Controller, type Control } from "react-hook-form";


interface IsAvailableToggleProps {
  control: Control<ProductFormValues>;
}
export const IsAvailableToggle = ({ control }: IsAvailableToggleProps) => {
  return (
    <Controller
      name="isAvailable"
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-3 cursor-pointer mt-5">
          <label className="text-gray-700">Available</label>
          <Badge
            variant={field.value ? "secondary" : "destructive"}
            onClick={() => field.onChange(!field.value)}
            className="cursor-pointer select-none"
          >
            {field.value ? "Yes" : "No"}
          </Badge>
        </div>
      )}
    />
  );
};