import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/services/product-service";
import type { Category } from "@/types/product";
import { logger } from "@/lib/logger"
import { imageUrl } from "@/lib/utils/imageUrl";
import { IconChevronRight } from "@tabler/icons-react";

interface CategoryItemProps {
  category: Category;
}

function CategoryItem({ category }: CategoryItemProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="flex flex-col items-center justify-center p-4 bg-white transition-all duration-300 border-transparent border"
    >
      <div className="relative w-20 h-20 mb-3">
        <div className="absolute inset-0 bg-gray-50 rounded-full scale-95" />

        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center border border-gray-100 bg-white">
          {category.imageUrl ? (
            <Image
              src={imageUrl.category(category.imageUrl)}
              alt={category.name}
              width={80}
              height={80}
              className="object-contain p-2 rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 p-4 text-[10px] text-center font-medium leading-tight rounded-full">
              {category.name}
            </div>
          )}
        </div>
      </div>

      <span className="text-[13px] text-gray-700 text-center leading-tight line-clamp-2 px-1 min-h-[2.5rem] flex items-center justify-center">
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
    <section className="container mx-auto px-4 md:px-6 py-8">
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 flex justify-between items-center bg-white">
          <h2 className="text-gray-400 font-medium uppercase tracking-wider text-sm">
            Danh mục
          </h2>
          <Link href="/categories" className="text-primary text-xs flex items-center gap-1 hover:underline">
            Xem tất cả <IconChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-[1px] bg-gray-100">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
