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
      <h3 className="font-semibold mb-4 px-2">Categories</h3>
      <nav className="flex flex-col space-y-1">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex items-center justify-between px-2 py-2 text-sm text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground rounded-md transition-colors"
            >
              {category.name}
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground px-2">No categories available</p>
        )}
      </nav>
    </aside>
  )
}
