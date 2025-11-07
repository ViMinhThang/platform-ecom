import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { useFieldArray, Control } from "react-hook-form";

interface OptionValuesFieldArrayProps {
  index: number;
  control: Control<any>;
}

export const OptionValuesFieldArray: React.FC<OptionValuesFieldArrayProps> = ({ index, control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${index}.optionValues`,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div key={field.id} className="flex gap-2 items-center">
          <FormInput
            control={control}
            name={`variants.${index}.optionValues.${i}.optionName`}
            label="Option Name"
            placeholder="e.g., Size"
            required
          />
          <FormInput
            control={control}
            name={`variants.${index}.optionValues.${i}.value`}
            label="Value"
            placeholder="e.g., M"
            required
          />
          <Button type="button" variant="destructive" onClick={() => remove(i)}>
            Delete
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ optionName: "", value: "" })}>
        + Add Option
      </Button>
    </div>
  );
};
