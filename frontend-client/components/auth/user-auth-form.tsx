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
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest">Email Truy Cập</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
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
                                    <FormLabel className="text-xs font-black uppercase tracking-widest">Mật Khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="current-password"
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
                            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP HỆ THỐNG"}
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t-2 border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-bold tracking-widest">
                        HOẶC TIẾP TỤC VỚI
                    </span>
                </div>
            </div>

            <Button variant="outline" type="button" disabled={loading} className="rounded-none border-2 border-black font-bold uppercase tracking-widest h-12 hover:bg-black hover:text-white transition-all">
                {loading ? (
                    <span className="mr-2 h-4 w-4 animate-spin border-2 border-black border-t-transparent rounded-full" />
                ) : (
                    <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                )}
                GOOGLE
            </Button>

            <div className="flex justify-between items-center mt-4">
                <Button variant="link" className="text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-black p-0 h-auto rounded-none" onClick={() => router.push('/auth/register')}>
                    ĐĂNG KÝ TÀI KHOẢN MỚI
                </Button>
                <Button variant="link" className="text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-black p-0 h-auto rounded-none">
                    QUÊN MẬT KHẨU?
                </Button>
            </div>
        </div>
    );
}
