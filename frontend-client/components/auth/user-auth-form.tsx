"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
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
    password: z.string().min(1, { message: "Mật khẩu là bắt buộc" }),
});

type UserFormValue = z.infer<typeof formSchema>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
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
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Email Truy Cập</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
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
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">Mật Khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="current-password"
                                            disabled={loading}
                                            className="rounded-sm border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 shadow-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold text-red-500 uppercase tracking-widest" />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} className="rounded-sm h-12 px-10 shadow-lg shadow-primary/10 text-[11px] font-bold uppercase tracking-[0.2em] transition-all">
                            {loading && (
                                <span className="mr-3 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full" />
                            )}
                            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP HỆ THỐNG"}
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[9px] uppercase">
                    <span className="bg-background px-4 text-muted-foreground font-bold tracking-[0.2em] opacity-60">
                        HOẶC TIẾP TỤC VỚI
                    </span>
                </div>
            </div>

            <Button variant="outline" type="button" disabled={loading} className="rounded-sm border-border shadow-sm font-bold uppercase tracking-widest text-[10px] h-12 hover:bg-primary/5 hover:border-primary/30 transition-all">
                {loading ? (
                    <span className="mr-3 h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
                ) : (
                    <svg role="img" viewBox="0 0 24 24" className="mr-3 h-4 w-4 fill-primary">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                )}
                GOOGLE
            </Button>

            <div className="flex justify-between items-center mt-6">
                <Button variant="link" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary p-0 h-auto rounded-sm transition-colors opacity-70 hover:opacity-100" onClick={() => router.push('/auth/register')}>
                    ĐĂNG KÝ TÀI KHOẢN MỚI
                </Button>
                <Button variant="link" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary p-0 h-auto rounded-sm transition-colors opacity-70 hover:opacity-100" onClick={() => router.push('/auth/forgot-password')}>
                    QUÊN MẬT KHẨU?
                </Button>
            </div>
        </div>
    );
}
