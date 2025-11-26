import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api/products";
import type { Category } from "@/types/product";

export async function Categories() {
  let categories: Category[] = [];

  try {
    const data = await getCategories({ pageSize: 20 });
    categories = data.content;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="container py-10 mx-auto">
      <h2 className="text-2xl font-bold tracking-tight mb-6">
        Shop by Category
      </h2>
      <div className="flex gap-8 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] snap-x">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="flex flex-col items-center gap-3 min-w-[100px] snap-start"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-800">
              {category.imageUrl ? (
                <Image
                  src={`http://localhost:8080/uploads/categories/${category.imageUrl}`}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center whitespace-nowrap">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
