import { Control } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { JsonKeyValueEditor } from "./key-value-editor";
import { statusOptions } from "../../../../constants/product-form.constants";
import { ProductFormValues } from "../../../../types/product/product-form";
import { Category } from "@/types/category/category";

interface ProductFormFieldsProps {
  control: Control<ProductFormValues>;
  categories: Category[];
  loading: boolean;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ control, categories, loading }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-4">
      <FormInput
        control={control}
        name="name"
        label="Tên sản phẩm"
        required
        placeholder="Nhập tên sản phẩm"
      />
      <FormInput
        control={control}
        name="slug"
        label="Đường dẫn (Slug)"
        required
        placeholder="Nhập đường dẫn"
      />
      <FormSelect
        control={control}
        name="status"
        label="Trạng thái"
        required
        options={[
          { label: "Hoạt động", value: "ACTIVE" },
          { label: "Bản nháp", value: "DRAFT" },
          { label: "Hết hàng", value: "OUT_OF_STOCK" },
        ]}
      />
      <FormSelect
        control={control}
        name="cate"
        label="Danh mục"
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
        label="Mô tả"
        placeholder="Nhập mô tả sản phẩm"
        config={{ rows: 6, showCharCount: true, maxLength: 500 }}
      />
      <JsonKeyValueEditor
        control={control}
        name="specifications"
        label="Thông số kỹ thuật"
      />
      <JsonKeyValueEditor
        control={control}
        name="metadata"
        label="Dữ liệu Meta"
      />
    </div>
  </div>
);
