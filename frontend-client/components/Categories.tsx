import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/services/product-service";
import type { Category } from "@/types/product";
import { logger } from "@/lib/logger";
import { imageUrl } from "@/lib/utils/imageUrl";
import { ArrowUpRight } from "lucide-react";

interface CategoryItemProps {
  category: Category;
}

function CategoryItem({ category }: CategoryItemProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex flex-col items-center p-6 bg-white rounded-none border border-zinc-100"
    >
      <div className="relative size-28 mb-6 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100">
        {category.imageUrl ? (
          <Image
            src={imageUrl.category(category.imageUrl)}
            alt={category.name}
            width={85}
            height={85}
            className="object-contain p-2"
          />
        ) : (
          <div className="text-zinc-300 font-bold uppercase tracking-widest text-xs">
            {category.name.substring(0, 2)}
          </div>
        )}
      </div>

      <span className="text-[14px] font-bold text-zinc-800 text-center leading-tight uppercase tracking-tight">
        {category.name}
      </span>
    </Link>
  );
}

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {categories.slice(0, 10).map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}
