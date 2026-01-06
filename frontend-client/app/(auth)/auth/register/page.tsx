import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
    title: "Đăng ký tài khoản",
    description: "Tạo tài khoản mới để bắt đầu mua sắm.",
};

export default function RegisterPage() {
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
                            "THAM GIA MẠNG LƯỚI NGAY HÔM NAY.
                            TRẢI NGHIỆM MUA SẮM SIÊU TỐC ĐỘ."
                        </p>
                        <footer className="text-xs font-bold mt-4 text-white/50 tracking-[0.2em] uppercase">
                            SYS_ADMIN // NEW_USER_PROTOCOL
                        </footer>
                    </div>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-black uppercase tracking-tight">
                            Đăng ký thành viên
                        </h1>
                        <p className="text-sm text-muted-foreground font-mono">
                            Nhập thông tin cá nhân để khởi tạo tài khoản
                        </p>
                    </div>
                    <RegisterForm />
                    <p className="px-8 text-center text-[10px] text-muted-foreground uppercase tracking-wider">
                        Đã có tài khoản?{" "}
                        <Link
                            href="/auth/sign-in"
                            className="underline underline-offset-4 hover:text-black font-bold"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
