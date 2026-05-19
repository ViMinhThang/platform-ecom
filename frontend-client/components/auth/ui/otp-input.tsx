"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export function OtpInput({
    length = 6,
    value,
    onChange,
    error,
    disabled,
}: OtpInputProps) {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, char: string) => {
        if (!/^\d*$/.test(char)) return;

        const newValue = value.split("");
        newValue[index] = char;
        onChange(newValue.join(""));

        if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (e.key === "Paste") {
            e.preventDefault();
            const clipboardData = (e as unknown as { clipboardData: DataTransfer }).clipboardData;
            const pastedData = clipboardData?.getData("text").replace(/\D/g, "").slice(0, length);
            onChange(pastedData.padEnd(length, ""));
            inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
        }
    };

    const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
        e.currentTarget.select();
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between gap-2">
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        disabled={disabled}
                        value={value[index] || ""}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onFocus={handleFocus}
                        className={cn(
                            "h-12 w-10 rounded-sm border text-center text-lg font-semibold transition-all duration-200",
                            "bg-background",
                            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error
                                ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                                : "border-input",
                            value[index] && "border-primary bg-primary/5"
                        )}
                    />
                ))}
            </div>
            {error && (
                <p className="text-xs text-destructive font-medium text-center">{error}</p>
            )}
        </div>
    );
}
