"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthCard } from "@/components/auth/ui/auth-card";
import { ShieldCheck } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <AuthBrandPanel
                title="Tạo tài khoản mới"
                description="Tham gia cộng đồng mua sắm và nhận nhiều ưu đãi hấp dẫn."
            />

            <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-md space-y-6 animate-fade-in-up">
                    <AuthCard>
                        <div className="space-y-2 text-center mb-6">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Đăng ký
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Tạo tài khoản để bắt đầu mua sắm
                            </p>
                        </div>
                        <RegisterForm />
                    </AuthCard>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Thông tin của bạn được bảo mật</span>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Bằng cách tiếp tục, bạn đồng ý với{" "}
                        <a href="/terms" className="underline hover:text-foreground">
                            Điều khoản
                        </a>{" "}
                        và{" "}
                        <a href="/privacy" className="underline hover:text-foreground">
                            Chính sách bảo mật
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
