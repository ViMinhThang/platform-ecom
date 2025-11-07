import { Control } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { JsonKeyValueEditor } from "../key-value-editor";
import { CategoryDTO } from "@/types/category";
import { statusOptions } from "../../../../constants/product-form.constants";
import { ProductFormValues } from "../../../../types/product-form";

interface ProductFormFieldsProps {
  control: Control<ProductFormValues>;
  categories: CategoryDTO[];
  loading: boolean;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ control, categories, loading }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-4">
      <FormInput
        control={control}
        name="name"
        label="Name"
        required
        placeholder="Enter product name"
      />
      <FormInput
        control={control}
        name="slug"
        label="Slug"
        required
        placeholder="Enter slug"
      />
      <FormSelect
        control={control}
        name="status"
        label="Status"
        required
        options={statusOptions}
      />
      <FormSelect
        control={control}
        name="cate"
        label="Category"
        required
        disabled={categories.length === 0 || loading}
        options={categories.map((c) => ({
          label: c.name,
          value: JSON.stringify(c),
        }))}
      />
    </div>
    <div className="space-y-4">
      <FormTextarea
        control={control}
        name="description"
        label="Description"
        placeholder="Enter product description"
        config={{ rows: 6, showCharCount: true, maxLength: 500 }}
      />
      <JsonKeyValueEditor
        control={control}
        name="specifications"
        label="Specifications"
      />
      <JsonKeyValueEditor
        control={control}
        name="metadata"
        label="Metadata"
      />
    </div>
  </div>
);
