import { HomeBanner } from "@/components/home/HomeBanner";
import { QuickLinks } from "@/components/home/QuickLinks";
import { FlashSale } from "@/components/home/FlashSale";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductFeed } from "@/components/home/ProductFeed";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-zinc-50">
      {/* SECTION 1: HERO BANNER & CATEGORIES */}
      <HomeBanner />

      <div className="container mx-auto px-4 my-8">
        <div className="h-px bg-black/10 w-full" />
      </div>

      {/* SECTION 2: QUICK LINKS */}
      <QuickLinks />

      {/* SECTION 3: FLASH SALE */}
      <FlashSale />

      <div className="container mx-auto px-4 my-12">
        <div className="h-1 bg-black w-12 mb-2" />
        <div className="h-px bg-black/10 w-full" />
      </div>

      {/* SECTION 4: CATEGORY GRID */}
      <CategoryGrid />

      {/* SECTION 5: PRODUCT FEED */}
      <ProductFeed />
    </div>
  );
}
