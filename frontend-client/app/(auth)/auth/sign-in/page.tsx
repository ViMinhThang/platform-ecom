import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { UserAuthForm } from "@/components/auth/user-auth-form";

export const metadata: Metadata = {
    title: "Đăng nhập",
    description: "Đăng nhập vào hệ thống.",
};

export default function AuthenticationPage() {
    return (
        <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-zinc-900 border-r-2 border-black p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-black" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

                <div className="relative z-20 flex items-center text-lg font-black tracking-widest uppercase">
                    <div className="h-6 w-6 bg-white mr-2" />
                    ACME_CORP v2.0
                </div>
                <div className="relative z-20 mt-auto">
                    <div className="border-l-2 border-white/20 pl-6 py-2">
                        <p className="text-lg font-mono text-zinc-300">
                            "HỆ THỐNG MUA SẮM TRỰC TUYẾN THẾ HỆ MỚI.
                            TỐI ƯU HÓA TRẢI NGHIỆM - BẢO MẬT TUYỆT ĐỐI."
                        </p>
                        <footer className="text-xs font-bold mt-4 text-white/50 tracking-[0.2em] uppercase">
                            SYS_ADMIN // SECURITY_LEVEL_1
                        </footer>
                    </div>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-black uppercase tracking-tight">
                            Truy cập hệ thống
                        </h1>
                        <p className="text-sm text-muted-foreground font-mono">
                            Nhập thông tin xác thực của bạn bên dưới
                        </p>
                    </div>
                    <Suspense fallback={<div className="font-mono text-xs">ĐANG TẢI...</div>}>
                        <UserAuthForm />
                    </Suspense>
                    <p className="px-8 text-center text-[10px] text-muted-foreground uppercase tracking-wider">
                        Bằng cách tiếp tục, bạn đồng ý với{" "}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-black font-bold"
                        >
                            Điều khoản
                        </Link>{" "}
                        và{" "}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-black font-bold"
                        >
                            Chính sách bảo mật
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
