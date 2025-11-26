import { ProductCard } from "@/components/ProductCard";
import { getPublicProducts } from "@/lib/api/products";
import type { ProductRow } from "@/types/product";

export async function FeaturedProducts() {
  let products: ProductRow[] = [];

  try {
    const data = await getPublicProducts({ page: 0, perPage: 10 });
    products = data.content;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <section className="container mx-auto py-16 md:py-24 px-4 md:px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-muted-foreground mt-2">Handpicked for you.</p>
        </div>
        <a
          href="/products"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          View all products
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
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
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">
            No products available
          </p>
        )}
      </div>
    </section>
  );
}
