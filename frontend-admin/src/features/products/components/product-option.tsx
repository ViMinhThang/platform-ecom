import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Key, useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

interface ProductOptionCardProps {
  index: number;
  optionIndex: number;
  control: Control<any>;
  removeOption: (index: number) => void;
  onSave: (index: number) => void;
  onDelete: (index: number) => void;
  loading: boolean;
}

export function ProductOptionCard({
  index,
  optionIndex,
  control,
  removeOption,
  onDelete,
  onSave,
  loading,
}: ProductOptionCardProps) {
  const [alert, setAlert] = useState(false);

  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: `options.${optionIndex}.values`,
  });

  return (
    <div className="border rounded-lg p-4 space-y-2 shadow w-[30%]">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Option {optionIndex + 1}</h4>
        <Button
          variant="destructive"
          size="sm"
          type="button"
          onClick={() => setAlert(true)}
        >
          Remove Option
        </Button>
        <AlertModal
          isOpen={alert}
          onClose={() => setAlert(false)}
          loading={loading}
          onConfirm={() => {
            onDelete(optionIndex);
            removeOption(optionIndex);
            setAlert(false);
          }}
        />
      </div>

      <FormInput
        control={control}
        name={`options.${optionIndex}.name`}
        label="Name"
        placeholder="e.g., size"
        required
      />
      <FormInput
        control={control}
        name={`options.${optionIndex}.displayName`}
        label="Display Name"
        placeholder="e.g., Size"
        required
      />
      <FormSelect
        control={control}
        name={`options.${optionIndex}.isRequired`}
        label="Required"
        required
        options={[
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]}
      />
      <FormInput
        control={control}
        name={`options.${optionIndex}.sortOrder`}
        label="Sort Order"
        type="number"
        placeholder="0"
      />

      {/* Option Values */}
      <div className="space-y-2 mt-2">
        <h5 className="font-medium">Values</h5>
        {valueFields.map((valueField, valueIndex) => (
          <div
            key={valueField.id as Key}
            className="flex gap-2 items-center justify-center"
          >
            <FormInput
              control={control}
              name={`options.${optionIndex}.values.${valueIndex}.value`}
              label="Value"
              placeholder="e.g., S"
              required
            />
            <FormInput
              control={control}
              name={`options.${optionIndex}.values.${valueIndex}.displayValue`}
              label="Display Value"
              placeholder="e.g., Small"
              required
            />
            <FormInput
              control={control}
              name={`options.${optionIndex}.values.${valueIndex}.sortOrder`}
              label="Sort Order"
              type="number"
              placeholder="0"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeValue(valueIndex)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={() =>
            appendValue({ value: "", displayValue: "", sortOrder: 0 })
          }
        >
          Add Value
        </Button>
      </div>

      <div className="flex justify-end mt-2">
        <Button
          type="button"
          onClick={() => onSave(optionIndex)}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Option"}
        </Button>
      </div>
    </div>
  );
}
