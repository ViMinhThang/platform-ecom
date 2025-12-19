import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex items-center h-[550px] w-full rounded-md overflow-hidden border border-border">
      <div className="absolute inset-0 bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
        <div className="w-full h-full bg-center">
          <Image src="/hero.jpg" alt="Hero" fill className="object-cover opacity-80" priority />
        </div>
      </div>

      <div className="relative z-20 px-10 md:px-16 flex flex-col items-start max-w-2xl">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary-foreground uppercase bg-primary rounded-sm">
          Bộ sưu tập mới
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 leading-tight">
          Mọi thứ bạn cần, <br />
          <span className="text-primary">
            Giao hàng tận nơi.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-lg leading-relaxed">
          Khám phá bộ sưu tập được tuyển chọn mang lại phong cách và sự tiện nghi cho ngôi nhà của bạn. Mua sắm hàng triệu sản phẩm một cách dễ dàng.
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
          >
            Mua ngay
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10 rounded-sm backdrop-blur-sm"
          >
            Xem ưu đãi
          </Button>
        </div>
      </div>
    </section>
  );
}
