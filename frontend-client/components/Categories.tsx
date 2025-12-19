import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/services/product-service";
import type { Category } from "@/types/product";
import { logger } from "@/lib/logger"
import { imageUrl } from "@/lib/utils/imageUrl";

export async function Categories() {
  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    logger.error("Failed to fetch categories:", error);
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="container py-16 mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            Danh mục <span className="text-primary italic">nổi bật</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium mt-1 uppercase tracking-tight">Khám phá theo sở thích của bạn</p>
        </div>
        <Link href="/categories" className="text-xs font-black uppercase tracking-[0.2em] text-primary underline underline-offset-4">
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex flex-col items-center gap-5"
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)] bg-white">
              {category.imageUrl ? (
                <>
                  <div className="absolute inset-0 bg-primary/10 z-10" />
                  <Image
                    src={imageUrl.category(category.imageUrl)}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-zinc-50 uppercase font-black text-[10px] tracking-widest text-center px-4">
                  {category.name}
                </div>
              )}
            </div>
            <span className="text-xs font-black text-foreground text-center uppercase tracking-[0.15em]">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
