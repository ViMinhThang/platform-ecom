"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerUser } from "@/lib/services/user-service";
import { logger } from "@/lib/logger";
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
    username: z.string().min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" }).max(20),
    email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
    password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type RegisterFormValue = z.infer<typeof formSchema>;

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function RegisterForm({ className, ...props }: RegisterFormProps) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const form = useForm<RegisterFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

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
        } catch (error: any) {
            logger.error("Registration failed:", error);
            toast.error(error.message || "Có lỗi xảy ra trong quá trình đăng ký");
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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest">Tên Định Danh</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            autoCapitalize="none"
                                            autoCorrect="off"
                                            disabled={loading}
                                            className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black font-mono text-sm h-12"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="font-mono text-xs text-red-600" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest">Email Liên Hệ</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={loading}
                                            className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black font-mono text-sm h-12"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="font-mono text-xs text-red-600" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest">Mật Khẩu Bảo Mật</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black font-mono text-sm h-12"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="font-mono text-xs text-red-600" />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} className="rounded-none h-12 bg-black text-white hover:bg-black/80 font-black uppercase tracking-widest transition-all">
                            {loading && (
                                <span className="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                            )}
                            {loading ? "ĐANG KHỞI TẠO..." : "XÁC NHẬN ĐĂNG KÝ"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
