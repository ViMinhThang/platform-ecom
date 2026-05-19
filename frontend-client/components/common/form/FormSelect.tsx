'use client';

import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SelectOption {
    value: string;
    label: string;
}

interface FormSelectProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    control: Control<T>;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    error?: FieldError;
    onValueChange?: (value: string) => void;
}

/**
 * Reusable select field component integrated with react-hook-form.
 * Handles loading states, errors, and provides a consistent UI.
 * 
 * @example
 * <FormSelect
 *   label="Province"
 *   name="provinceId"
 *   control={form.control}
 *   options={provinces.map(p => ({ value: p.id, label: p.name }))}
 *   placeholder="Select province"
 *   error={form.formState.errors.provinceId}
 *   disabled={isLoading}
 * />
 */
export function FormSelect<T extends FieldValues>({
    label,
    name,
    control,
    options,
    placeholder = 'Select an option',
    disabled = false,
    error,
    onValueChange,
}: FormSelectProps<T>) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select
                        disabled={disabled}
                        onValueChange={(value) => {
                            field.onChange(value);
                            onValueChange?.(value);
                        }}
                        value={field.value?.toString() || ''}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {error && (
                <p className="text-sm text-red-500">{error.message}</p>
            )}
        </div>
    );
}
