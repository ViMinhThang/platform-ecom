import { getPublicProductById } from "@/lib/api/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewStats } from "@/components/ReviewStats";
import { ReviewList } from "@/components/ReviewList";

interface ProductDetailPageProps {
  params: any;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  let product = null;
  const { id } = await params;
  try {
    product = await getPublicProductById(id);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section - Will be replaced with Client carousel component */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
            <Image
              src={product.metadata?.imageUrl || "https://placehold.co/600x600"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {/* Placeholder for thumbnail carousel */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square relative bg-zinc-100 dark:bg-zinc-800 rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.cate.name}</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            {product.status === "ACTIVE" && (
              <Badge
                variant="outline"
                className="ml-2 bg-green-500/10 text-green-700 border-green-500/20"
              >
                In Stock
              </Badge>
            )}
          </div>

          {/* Price - Placeholder, will show from variants */}
          <div className="text-3xl font-bold text-blue-600">
            Price varies by variant
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Specifications</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="border-b pb-2">
                        <dt className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </dt>
                        <dd className="font-medium">{String(value)}</dd>
                      </div>
                    )
                  )}
                </dl>
              </div>
            )}

          {/* Placeholder for variant selector (Client Component) */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Select Options</h3>
            <p className="text-sm text-muted-foreground">
              Variant selector will be added here (Client Component)
            </p>
          </div>

          {/* Add to Cart Button (Client Component wrapper) */}
          <div className="flex gap-4 pt-6">
            <Button size="lg" className="flex-1">
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              ♡
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* Review Summary - Server Component */}
        <ReviewStats productId={product.id} />

        {/* Review List - Client Component */}
        <ReviewList productId={product.id} />
      </div>

      {/* Related Products - Can be Server Component */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <p className="text-muted-foreground">
          Related products will be shown here
        </p>
      </div>
    </div>
  );
}
