import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { BannerGrid } from "@/components/BannerGrid";
import { CategorySidebar } from "@/components/CategorySidebar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-10">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block w-1/4">
            <CategorySidebar />
          </div>
          <div className="flex-1">
            <Hero />
          </div>
        </div>
      </div>
      
      <BannerGrid />
      <FeaturedProducts />
    </div>
  );
}
