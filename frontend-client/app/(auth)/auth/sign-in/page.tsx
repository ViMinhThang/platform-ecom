"use client";

import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthCard } from "@/components/auth/ui/auth-card";
import { ShieldCheck } from "lucide-react";

export default function AuthenticationPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <AuthBrandPanel
                title="Chào mừng trở lại"
                description="Đăng nhập để tiếp tục mua sắm và theo dõi đơn hàng của bạn."
            />

            <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-md space-y-6 animate-fade-in-up">
                    <AuthCard>
                        <div className="space-y-2 text-center mb-6">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Đăng nhập
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Nhập thông tin tài khoản của bạn
                            </p>
                        </div>
                        <Suspense fallback={<div className="text-sm text-muted-foreground">Đang tải…</div>}>
                            <UserAuthForm />
                        </Suspense>
                    </AuthCard>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="size-4" />
                        <span>Thông tin của bạn được bảo mật</span>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Bằng cách tiếp tục, bạn đồng ý với{" "}
                        <Link href="/terms" className="underline hover:text-foreground">
                            Điều khoản
                        </Link>{" "}
                        và{" "}
                        <Link href="/privacy" className="underline hover:text-foreground">
                            Chính sách bảo mật
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
