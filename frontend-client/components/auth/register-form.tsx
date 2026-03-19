"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerUser } from "@/lib/services/user-service";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { User, Mail, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthInput } from "@/components/auth/ui/auth-input";
import { AuthButton } from "@/components/auth/ui/auth-button";
import { PasswordStrength } from "@/components/auth/ui/password-strength";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    username: z.string().min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

type RegisterFormValue = z.infer<typeof formSchema>;

export function RegisterForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const form = useForm<RegisterFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = form.watch("password");

    async function onSubmit(data: RegisterFormValue) {
        setLoading(true);

        try {
            await registerUser({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            router.push("/auth/sign-in");
        } catch (error: unknown) {
            logger.error("Registration failed:", error);
            toast.error(error.message || "Có lỗi xảy ra trong quá trình đăng ký");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("space-y-5", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <AuthInput
                                        label="Tên đăng nhập"
                                        placeholder="NguyenVanA"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                        disabled={loading}
                                        icon={<User className="h-4 w-4" />}
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        icon={<Mail className="h-4 w-4" />}
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="space-y-2">
                                        <AuthInput
                                            label="Mật khẩu"
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            icon={<Lock className="h-4 w-4" />}
                                            {...field}
                                        />
                                        <PasswordStrength password={password} />
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
                                        icon={<Lock className="h-4 w-4" />}
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <AuthButton loading={loading}>
                        Tạo tài khoản
                    </AuthButton>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <button
                    type="button"
                    onClick={() => router.push("/auth/sign-in")}
                    className="font-semibold text-primary hover:underline"
                >
                    Đăng nhập
                </button>
            </p>
        </div>
    );
}
