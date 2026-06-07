import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getCategories } from "@/lib/services/product-service"
import type { Category } from "@/types/product"
import { logger } from "@/lib/logger"

export async function CategorySidebar() {
  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    logger.error('Failed to fetch categories:', error);
  }

  return (
    <aside className="w-full h-full bg-background border rounded-lg p-4">
      <h3 className="font-semibold mb-4 px-2">Danh mục</h3>
      <nav className="flex flex-col gap-y-1">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex items-center justify-between p-2 text-sm text-muted-foreground hover:bg-zinc-100 hover:text-foreground rounded-md transition-colors"
            >
              {category.name}
              <ChevronRight className="size-4 opacity-50" />
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground px-2">Chưa có danh mục nào</p>
        )}
      </nav>
    </aside>
  )
}
