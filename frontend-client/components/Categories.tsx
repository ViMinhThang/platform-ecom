import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/services/product-service";
import type { Category } from "@/types/product";

export async function Categories() {
  let categories: Category[] = [];

  try {
    categories = await getCategories();
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="flex flex-col items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors group"
          >
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-border shadow-sm bg-secondary group-hover:border-primary transition-colors">
              {category.imageUrl ? (
                <Image
                  src={`http://localhost:8080/uploads/categories/${category.imageUrl}`}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-foreground text-center group-hover:text-primary transition-colors">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
