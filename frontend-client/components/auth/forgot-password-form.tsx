"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthInput } from "@/components/auth/ui/auth-input";
import { AuthButton } from "@/components/auth/ui/auth-button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
});

type FormValue = z.infer<typeof formSchema>;

export function ForgotPasswordForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { push } = useRouter();
    const [loading, setLoading] = React.useState(false);

    const form = useForm<FormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: FormValue) {
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
                return;
            }

            toast.success("Mã OTP đã được gửi đến email của bạn!");
            push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
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
                    Nhập email đã đăng ký để nhận mã xác thực
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
                                        autoCorrect="off"
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
                    <AuthButton loading={loading}>
                        Gửi mã xác thực
                    </AuthButton>
                </div>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                Nhớ mật khẩu?{" "}
                <button
                    type="button"
                    onClick={() => push("/auth/sign-in")}
                    className="font-semibold text-primary hover:underline"
                >
                    Quay lại đăng nhập
                </button>
            </p>
        </div>
    );
}
