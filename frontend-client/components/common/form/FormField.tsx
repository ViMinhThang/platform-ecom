'use client';

import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
    label: string;
    id: string;
    error?: FieldError;
    registration?: UseFormRegisterReturn;
}

/**
 * Reusable form field component that encapsulates Label + Input + Error pattern.
 * Follows DRY principle by eliminating repetitive form field code.
 * 
 * @example
 * <FormField
 *   label="Email"
 *   id="email"
 *   type="email"
 *   registration={form.register('email')}
 *   error={form.formState.errors.email}
 *   disabled={isSubmitting}
 * />
 */
export function FormField({
    label,
    id,
    error,
    registration,
    ...inputProps
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                {...registration}
                {...inputProps}
            />
            {error && (
                <p className="text-sm text-red-500">{error.message}</p>
            )}
        </div>
    );
}
