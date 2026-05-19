import { Control, FieldPath, FieldValues } from 'react-hook-form';

// Base props that all form components will share
export interface BaseFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Common option type for selects, radio groups, etc.
export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Date picker specific types
export interface DatePickerConfig {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  placeholder?: string;
}

// Slider specific types
export interface SliderConfig {
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
}

// Checkbox group specific types
export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Radio group specific types
export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Textarea specific types
export interface TextareaConfig {
  maxLength?: number;
  showCharCount?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

// File upload specific types
export interface FileUploadConfig {
  maxSize?: number;
  acceptedTypes?: string[];
  multiple?: boolean;
  maxFiles?: number;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
}
