import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Categories } from "@/components/Categories";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-slate-50">
      {/* SECTION 1: HERO & IMAGES CAROUSEL */}
      <Hero />

      <div className="container mx-auto px-4 md:px-6 space-y-24 mt-12">
        {/* SECTION 2: CATEGORIES */}
        <section>
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase mb-2">
              Danh mục nổi bật
            </h2>
            <div className="h-1.5 w-20 bg-primary rounded-none" />
          </div>
          <Categories />
        </section>

        {/* SECTION 3: PRODUCTS */}
        <section>
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase mb-2">
              Sản phẩm thịnh hành
            </h2>
            <div className="h-1.5 w-20 bg-primary rounded-none" />
            <p className="mt-4 text-slate-500 max-w-lg">
              Khám phá những sản phẩm được yêu thích nhất trong tuần qua với ưu đãi hấp dẫn.
            </p>
          </div>
          <FeaturedProducts />
        </section>
      </div>
    </div>
  );
}
