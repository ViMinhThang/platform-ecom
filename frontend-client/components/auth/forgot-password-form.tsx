"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
});

type FormValue = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
    const router = useRouter();
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/v1/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
                return;
            }

            toast.success("Mã OTP đã được gửi đến email của bạn!");
            router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
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
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Email Khôi Phục</FormLabel>
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
                        <Button disabled={loading} type="submit" className="rounded-sm h-12 px-10 shadow-lg shadow-primary/10 text-[11px] font-bold uppercase tracking-[0.2em] transition-all">
                            {loading && (
                                <span className="mr-3 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full" />
                            )}
                            {loading ? "ĐANG XỬ LÝ..." : "GỬI MÃ OTP"}
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="flex justify-center mt-6">
                <Button variant="link" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary p-0 h-auto rounded-sm transition-colors opacity-70 hover:opacity-100" onClick={() => router.push('/auth/sign-in')}>
                    QUAY LẠI ĐĂNG NHẬP
                </Button>
            </div>
        </div>
    );
}
