import { Control } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { statusOptions } from "../../../../constants/product-form.constants";
import { ProductFormValues } from "../../../../types/product/product-form";
import { Category } from "@/types/category/category";
import { CategoryFormValues } from "@/types/category/category-form";

interface CategoryFormFieldsProps {
  control: Control<CategoryFormValues>;
  loading: boolean;
}

export const CategoryFormFields: React.FC<CategoryFormFieldsProps> = ({
  control,
  loading,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-4">
      <FormInput
        control={control}
        name="name"
        label="Name"
        required
        placeholder="Enter product name"
      />
    </div>
  </div>
);
