'use client';

import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FormCheckboxProps<T extends FieldValues> {
    label: string;
    id: string;
    name: Path<T>;
    control: Control<T>;
    error?: FieldError;
}

/**
 * Reusable checkbox field component integrated with react-hook-form.
 * 
 * @example
 * <FormCheckbox
 *   label="Set as default"
 *   id="isDefault"
 *   name="isDefault"
 *   control={form.control}
 *   error={form.formState.errors.isDefault}
 * />
 */
export function FormCheckbox<T extends FieldValues>({
    label,
    id,
    name,
    control,
    error,
}: FormCheckboxProps<T>) {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <Checkbox
                            id={id}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor={id}>{label}</Label>
            </div>
            {error && (
                <p className="text-sm text-red-500">{error.message}</p>
            )}
        </div>
    );
}
