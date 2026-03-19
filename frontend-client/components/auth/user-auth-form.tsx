"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthInput } from "@/components/auth/ui/auth-input";
import { AuthButton } from "@/components/auth/ui/auth-button";
import { AuthDivider } from "@/components/auth/ui/auth-divider";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: UserFormValue) {
        setLoading(true);

        const signInResult = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
            callbackUrl,
        });

        setLoading(false);

        if (!signInResult?.ok) {
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
            return;
        }

        router.push(callbackUrl);
        router.refresh();
    }

    return (
        <div className={cn("space-y-5", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <AuthInput
                                        label="Mật khẩu"
                                        placeholder="••••••••"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="current-password"
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
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => router.push("/auth/forgot-password")}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                    <AuthButton loading={loading}>
                        Đăng nhập
                    </AuthButton>
                </form>
            </Form>

            <AuthDivider text="hoặc" />

            <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                disabled={loading}
                className="w-full h-12 rounded-sm border border-input bg-background font-semibold text-sm transition-all hover:bg-muted/50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    />
                </svg>
                Đăng nhập với Google
            </button>

            <p className="text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <button
                    type="button"
                    onClick={() => router.push("/auth/register")}
                    className="font-semibold text-primary hover:underline"
                >
                    Đăng ký ngay
                </button>
            </p>
        </div>
    );
}
