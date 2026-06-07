import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-x-2 text-sm text-muted-foreground", className)}>
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="size-4" />
        <span className="sr-only">Trang chủ</span>
      </Link>
      {items.map((item, index) => (
        <div key={"breadcrumb-" + index} className="flex items-center gap-x-2">
          <ChevronRight className="size-4" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium capitalize">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
