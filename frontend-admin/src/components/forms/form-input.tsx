"use client";

import { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BaseFormFieldProps } from "@/types/base-form";

interface FormInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
}

export function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  type = "text",
  placeholder,
  step,
  min,
  max,
  disabled,
  className,
}: FormInputProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
            className="rounded-sm"
              type={type}
              placeholder={placeholder}
              step={step}
              min={min}
              max={max}
              disabled={disabled}
              {...field}
              value={
                type === "number"
                  ? (field.value?.toString() ?? "")
                  : (field.value ?? "")
              }
              onChange={(e) => {
                const val = e.target.value;
                if (type === "number") {
                  field.onChange(val === "" ? "" : parseFloat(val));
                } else {
                  field.onChange(val);
                }
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
