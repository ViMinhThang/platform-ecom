import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex items-center h-[600px] w-full rounded-md overflow-hidden border border-border">
      <div className="absolute inset-0 bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent z-10 opacity-60" />
        <div className="w-full h-full bg-center">
          <Image src="/hero.jpg" alt="Hero" fill className="object-cover opacity-80" priority />
        </div>
      </div>

      <div className="relative z-20 px-10 md:px-16 flex flex-col items-start max-w-2xl">
        <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-primary-foreground uppercase bg-primary rounded-none">
          Bộ sưu tập mới
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl mb-6 leading-[0.9] uppercase">
          Mọi thứ <br />
          <span className="text-primary italic">
            bạn cần
          </span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-sm leading-relaxed font-medium">
          Khám phá bộ sưu tập được tuyển chọn mang lại phong cách và sự tiện nghi cho ngôi nhà của bạn.
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="h-14 px-10 text-xs font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary rounded-none transition-none"
          >
            Mua ngay
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-10 text-xs font-black uppercase tracking-[0.2em] border-white/40 text-white rounded-none backdrop-blur-sm transition-none"
          >
            Xem ưu đãi
          </Button>
        </div>
      </div>
    </section>
  );
}
