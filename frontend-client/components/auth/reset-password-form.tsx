"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthInput } from "@/components/auth/ui/auth-input";
import { AuthButton } from "@/components/auth/ui/auth-button";
import { OtpInput } from "@/components/auth/ui/otp-input";
import { PasswordStrength } from "@/components/auth/ui/password-strength";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    newPassword: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

type FormValue = z.infer<typeof formSchema>;

function ResetPasswordFormContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const get = searchParams.get.bind(searchParams);
    const emailParam = get("email") || "";
    const [loading, setLoading] = React.useState(false);
    const [otp, setOtp] = React.useState("");
    const [otpError, setOtpError] = React.useState("");

    const form = useForm<FormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: emailParam,
            newPassword: "",
            confirmPassword: "",
        },
    });

    const newPassword = form.watch("newPassword");

    async function onSubmit(data: FormValue) {
        if (otp.length !== 6) {
            setOtpError("Vui lòng nhập đủ 6 số");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/auth/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: data.email,
                        otpCode: otp,
                        newPassword: data.newPassword,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Xác thực thất bại. Vui lòng thử lại.");
                return;
            }

            toast.success("Mật khẩu đã được đặt lại thành công!");
            push("/auth/sign-in");
        } catch {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("space-y-5", className)} {...props}>
            <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    Nhập mã xác thực đã gửi đến email và tạo mật khẩu mới
                </p>
            </div>
            <Form form={form} onSubmit={onSubmit}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <AuthInput
                                        label="Email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        disabled={loading}
                                        icon={<Mail className="size-4" />}
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <p className="block text-sm font-medium text-foreground/80">
                            Mã xác thực
                        </p>
                        <OtpInput
                            value={otp}
                            onChange={(value) => {
                                setOtp(value);
                                setOtpError("");
                            }}
                            error={otpError}
                            disabled={loading}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="space-y-2">
                                        <AuthInput
                                            label="Mật khẩu mới"
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            icon={<Lock className="size-4" />}
                                            {...field}
                                        />
                                        <PasswordStrength password={newPassword} />
                                        {fieldState.error?.message && (
                                            <p className="text-xs text-destructive font-medium">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <AuthInput
                                        label="Xác nhận mật khẩu"
                                        placeholder="••••••••"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        icon={<Lock className="size-4" />}
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <AuthButton loading={loading}>
                        Đặt lại mật khẩu
                    </AuthButton>
                </div>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                Chưa nhận được mã?{" "}
                <button
                    type="button"
                    onClick={() => push("/auth/forgot-password")}
                    className="font-semibold text-primary hover:underline"
                >
                    Gửi lại mã xác thực
                </button>
            </p>
        </div>
    );
}

export function ResetPasswordForm(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <React.Suspense fallback={<div className="h-64 animate-pulse bg-secondary/10 rounded-sm" />}>
            <ResetPasswordFormContent {...props} />
        </React.Suspense>
    );
}
