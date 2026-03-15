"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
    otpCode: z.string().length(6, { message: "Mã OTP phải có 6 chữ số" }),
    newPassword: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

type FormValue = z.infer<typeof formSchema>;

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";
    const [loading, setLoading] = React.useState(false);

    const form = useForm<FormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: emailParam,
            otpCode: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: FormValue) {
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    otpCode: data.otpCode,
                    newPassword: data.newPassword,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Xác thực thất bại. Vui lòng thử lại.");
                return;
            }

            toast.success("Mật khẩu đã được đặt lại thành công!");
            router.push("/auth/sign-in");
        } catch (error) {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={loading}
                                            className="rounded-sm border-border focus-visible:ring-primary/20 focus-visible:border-primary text-[11px] font-bold uppercase tracking-widest h-12 shadow-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase tracking-widest" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="otpCode"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Mã OTP</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123456"
                                            type="text"
                                            maxLength={6}
                                            autoCapitalize="none"
                                            autoComplete="one-time-code"
                                            disabled={loading}
                                            className="rounded-sm border-border focus-visible:ring-primary/20 focus-visible:border-primary text-[11px] font-bold uppercase tracking-[0.5em] h-12 shadow-sm text-center"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase tracking-widest" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">Mật Khẩu Mới</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            className="rounded-sm border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 shadow-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase tracking-widest" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">Xác Nhận Mật Khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            className="rounded-sm border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 shadow-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase tracking-widest" />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} type="submit" className="rounded-sm h-12 px-10 shadow-lg shadow-primary/10 text-[11px] font-bold uppercase tracking-[0.2em] transition-all">
                            {loading && (
                                <span className="mr-3 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full" />
                            )}
                            {loading ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="flex justify-center mt-6">
                <Button variant="link" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary p-0 h-auto rounded-sm transition-colors opacity-70 hover:opacity-100" onClick={() => router.push('/auth/forgot-password')}>
                    GỬI LẠI MÃ OTP
                </Button>
            </div>
        </div>
    );
}
