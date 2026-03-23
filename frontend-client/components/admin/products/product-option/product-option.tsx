// product-option.tsx
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/admin/form-input";
import { FormSelect } from "@/components/admin/form-select";
import { AlertModal } from "@/components/admin/alert-modal";

import { ProductOption } from "@/types/product/product-option";

const OptionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  displayName: z.string().min(1),
  isRequired: z.string(),
  sortOrder: z.number().optional(),
  values: z.array(
    z.object({
      id: z.number().optional(),
      value: z.string().min(1),
      displayValue: z.string().min(1),
      sortOrder: z.number().optional(),
    })
  ),
});

export function ProductOptionCard({
  option,
  onSave,
  onDelete,
}: {
  option: ProductOption;
  onSave: (data: ProductOption) => void;
  onDelete: () => void;
}) {
  const [alert, setAlert] = useState(false);

  const methods = useForm({
    resolver: zodResolver(OptionSchema),
    defaultValues: {
      ...option,
      isRequired: String(option.isRequired),
    },
  });

  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control: methods.control,
    name: "values",
  });

  const onSubmit = (data: z.infer<typeof OptionSchema>) => {
    onSave({
      ...data,
      isRequired: data.isRequired === "true",
    });
  };

  const handleSave = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <div className="border rounded-lg p-4 space-y-2 shadow w-[35%]">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">{option.name || "Tùy chọn mới"}</h4>
          <Button variant="destructive" onClick={() => setAlert(true)}>
            Xóa tùy chọn
          </Button>
          <AlertModal
            isOpen={alert}
            onClose={() => setAlert(false)}
            onConfirm={onDelete}
            loading={false}
          />
        </div>

        <FormInput
          control={methods.control}
          name="name"
          label="Tên"
          required
        />
        <FormInput
          control={methods.control}
          name="displayName"
          label="Tên hiển thị"
          required
        />
        <FormSelect
          control={methods.control}
          name="isRequired"
          label="Bắt buộc"
          options={[
            { label: "Có", value: "true" },
            { label: "Không", value: "false" },
          ]}
        />
        <FormInput
          control={methods.control}
          name="sortOrder"
          label="Thứ tự"
          type="number"
        />

        <div className="space-y-2 mt-2">
          <h5 className="font-medium">Giá trị</h5>
          {valueFields.map((v, i) => (
            <div key={v.id} className="flex gap-2 items-center">
              <FormInput
                control={methods.control}
                name={`values.${i}.value`}
                label="Giá trị"
                placeholder="ví dụ: S"
                required
              />
              <FormInput
                control={methods.control}
                name={`values.${i}.displayValue`}
                label="Giá trị hiển thị"
                placeholder="ví dụ: Nhỏ"
                required
              />
              <FormInput
                control={methods.control}
                name={`values.${i}.sortOrder`}
                label="Thứ tự"
                type="number"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeValue(i)}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              appendValue({ value: "", displayValue: "", sortOrder: 0 })
            }
          >
            Thêm giá trị
          </Button>
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={handleSave}>Lưu tùy chọn</Button>
        </div>
      </div>
    </FormProvider>
  );
}
