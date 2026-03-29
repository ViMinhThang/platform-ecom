'use client';

import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils';
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
        <div className="space-y-3">
            <Label 
                htmlFor={id} 
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels"
            >
                {label}
            </Label>
            <Input
                id={id}
                {...registration}
                {...inputProps}
                className={cn(
                    "rounded-[4px] border-foreground/10 focus:border-primary transition-all font-labels",
                    inputProps.className
                )}
            />
            {error && (
                <p className="text-[9px] font-bold uppercase tracking-widest text-red-500 font-labels">{error.message}</p>
            )}
        </div>
    );
}
