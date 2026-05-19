"use client";

import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthCard } from "@/components/auth/ui/auth-card";
import { ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <AuthBrandPanel
                title="Quên mật khẩu?"
                description="Không sao cả! Nhập email của bạn để khôi phục tài khoản."
            />

            <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-md space-y-6 animate-fade-in-up">
                    <AuthCard>
                        <div className="space-y-2 text-center mb-6">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Khôi phục tài khoản
                            </h1>
                        </div>
                        <Suspense fallback={<div className="text-sm text-muted-foreground">Đang tải...</div>}>
                            <ForgotPasswordForm />
                        </Suspense>
                    </AuthCard>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Thông tin của bạn được bảo mật</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
