import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BannerGrid() {
  return (
    <section className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large Banner */}
        <div className="md:col-span-2 relative aspect-[2/1] bg-zinc-100 rounded-lg overflow-hidden group">
          <Image
            src="/banner-grid-1.avif"
            alt="Biểu ngữ khuyến mãi chính"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4 drop-shadow-md">
              Khuyến mãi cuối mùa
            </h3>
            <p className="text-white text-lg mb-6 drop-shadow-md max-w-md">
              Giảm đến 50% cho các sản phẩm được chọn. Đừng bỏ lỡ những ưu đãi này.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-zinc-200 border-none"
            >
              <Link href="/sale-campaigns">Mua hàng khuyến mãi</Link>
            </Button>
          </div>
        </div>

        {/* Side Banners */}
        <div className="flex flex-col gap-4">
          <div className="relative flex-1 bg-zinc-100 rounded-lg overflow-hidden group min-h-[200px]">
            <Image
              src="/banner-2.jpg"
              alt="Sản phẩm mới"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
              <h4 className="text-2xl font-semibold text-white drop-shadow-md mb-2">
                Hàng mới về
              </h4>
              <Button
                asChild
                variant="outline"
                className="text-white border-white hover:bg-white/20"
              >
                <Link href="/products?sortBy=createdAt&sortOrder=desc">Xem ngay</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex-1 bg-zinc-100 rounded-lg overflow-hidden group min-h-[200px]">
            <Image
              src="/banner-3.jpg"
              alt="Đồ công nghệ"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
              <h4 className="text-2xl font-semibold text-white drop-shadow-md mb-2">
                Ưu đãi công nghệ
              </h4>
              <Button
                asChild
                variant="outline"
                className="text-white border-white hover:bg-white/20"
              >
                <Link href="/category/electronics">Mua đồ công nghệ</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
