"use client";

import { useEffect, useState } from "react";
import { getPublicProductWithVariants } from "@/lib/api/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewStats } from "@/components/ReviewStats";
import { ReviewList } from "@/components/ReviewList";
import { ProductVariantSection } from "@/components/ProductVariantSection";
import { ProductDetail, ProductVariant } from "@/types/product";

interface ProductDetailPageProps {
  params: any;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { id } = await params;
        const data = await getPublicProductWithVariants(id);
        console.log(data);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Use variant image if available, otherwise fall back to product image
  const displayImage =
    selectedVariant?.imageUrl ||
    product.metadata?.imageUrl ||
    "https://placehold.co/600x600";

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section - Will be replaced with Client carousel component */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
            <Image
              width={900}
              height={900}
              key={displayImage}
              src={`http://localhost:8080/uploads/products/${displayImage}`}
              alt={product.name}
              unoptimized
              className="object-cover"
            />
          </div>
          {/* Placeholder for thumbnail carousel */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, idx) => (
              <Image
                key={idx}
                width={300}
                height={300}
                src={`http://localhost:8080/uploads/products/${image.imageUrl}`}
                alt={product.name}
                className="object-cover"
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

          {/* Variant Section (Client Component) */}
          <ProductVariantSection
            product={product}
            onVariantChange={setSelectedVariant}
          />
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
