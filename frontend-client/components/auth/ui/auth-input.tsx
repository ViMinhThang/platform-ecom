"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === "password";
        const inputType = isPassword && showPassword ? "text" : type;

        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-foreground/80">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                            {icon}
                        </div>
                    )}
                    <input
                        type={inputType}
                        data-slot="input"
                        className={cn(
                            "flex h-12 w-full rounded-sm border border-input bg-background px-4 py-2 text-sm transition-all duration-200",
                            "placeholder:text-muted-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
                            icon && "pl-10",
                            isPassword && "pr-10",
                            error && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-destructive font-medium">{error}</p>
                )}
            </div>
        );
    }
);

AuthInput.displayName = "AuthInput";
