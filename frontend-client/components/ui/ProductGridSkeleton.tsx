import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({ count = 10, className = "" }: ProductGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-0 border border-border rounded-sm h-full flex flex-col animate-pulse bg-background shadow-sm">
          <CardContent className="p-0 aspect-square bg-muted/30 border-b border-border" />
          <CardFooter className="flex flex-col items-start p-4 space-y-4 grow">
            <div className="h-4 bg-muted/40 w-full rounded-sm" />
            <div className="h-6 bg-muted/40 w-2/3 mt-auto rounded-sm" />
            <div className="flex justify-between w-full pt-4 border-t">
              <div className="h-3 bg-zinc-100 w-1/4" />
              <div className="h-3 bg-zinc-100 w-1/4" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
