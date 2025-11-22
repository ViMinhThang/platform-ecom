import Image from "next/image";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  isNew,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <Card className="group overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-md hover:shadow-md transition-shadow">
        <CardContent className="p-0 relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          {isNew && (
            <Badge className="absolute top-2 left-2 z-10 bg-blue-600 text-white hover:bg-blue-700 rounded-sm px-2 py-0.5 text-xs">
              New
            </Badge>
          )}
          <Image src={image} alt={name} fill className="object-cover" />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-3 space-y-2">
          <div className="space-y-1 w-full">
            <p className="text-xs text-muted-foreground">{category}</p>
            <h3 className="font-medium text-sm leading-tight line-clamp-2 h-10">
              {name}
            </h3>
            <p className="text-base font-bold text-blue-600">
              ${price.toFixed(2)}
            </p>
          </div>
          <Button
            className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-8 text-xs rounded-sm"
            size="sm"
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
