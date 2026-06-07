"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const getStrength = (pwd: string): { level: number; label: string; color: string } => {
        if (!pwd) return { level: 0, label: "", color: "" };

        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (pwd.length >= 12) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

        const levels = [
            { level: 1, label: "Yếu", color: "bg-destructive" },
            { level: 2, label: "Trung bình", color: "bg-yellow-500" },
            { level: 3, label: "Khá", color: "bg-primary" },
            { level: 4, label: "Mạnh", color: "bg-green-500" },
        ];

        const levelIndex = Math.min(strength, 4) - 1;
        return levels[levelIndex >= 0 ? levelIndex : 0];
    };

    const { level, label, color } = getStrength(password);

    if (!password) return null;

    return (
        <div className="space-y-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={"strength-" + i}
                        className={cn(
                            "h-1 flex-1 rounded-full transition-all duration-300",
                            i <= level ? color : "bg-muted"
                        )}
                    />
                ))}
            </div>
            <p className={cn(
                "text-xs font-medium",
                level === 1 && "text-destructive",
                level === 2 && "text-yellow-600",
                level === 3 && "text-primary",
                level === 4 && "text-green-600"
            )}>
                {label}
            </p>
        </div>
    );
}
