import { getPublicProducts } from "@/lib/services/product-service";
import { ProductCard } from "@/components/ProductCard";
import type { ProductRow } from "@/types/product";
import { logger } from "@/lib/logger";

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const page = Number(searchParams.page) || 0;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  let products: ProductRow[] = [];
  let totalPages = 0;
  let error = null;

  try {
    const data = await getPublicProducts({
      page,
      perPage: 12,
      category,
      search,
    });
    products = data.content;
    totalPages = data.totalPages;
  } catch (err) {
    logger.error("Failed to fetch products:", err);
    error = "Failed to load products. Please try again later.";
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {category ? `${category} Products` : "All Products"}
        </h1>
        <p className="text-muted-foreground mt-2">Discover our collection</p>
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                price={0}
                image={product.imageUrl || "https://placehold.co/600x400"}
                category={product.category.name}
                isNew={false}
                firstVariant={product.firstVariant}
              />
            ))}
          </div>

          {/* Pagination will go here - Client Component */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  );
}
