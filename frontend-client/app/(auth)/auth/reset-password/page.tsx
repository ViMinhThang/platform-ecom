"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthCard } from "@/components/auth/ui/auth-card";
import { ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <AuthBrandPanel
                title="Đặt lại mật khẩu"
                description="Nhập mã xác thực và tạo mật khẩu mới cho tài khoản của bạn."
            />

            <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-md space-y-6 animate-fade-in-up">
                    <AuthCard>
                        <div className="space-y-2 text-center mb-6">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Tạo mật khẩu mới
                            </h1>
                        </div>
                        <Suspense fallback={<div className="text-sm text-muted-foreground">Đang tải…</div>}>
                            <ResetPasswordForm />
                        </Suspense>
                    </AuthCard>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="size-4" />
                        <span>Thông tin của bạn được bảo mật</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
