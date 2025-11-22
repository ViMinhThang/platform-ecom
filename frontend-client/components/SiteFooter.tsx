import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto py-12 md:py-16 px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground">All Products</Link></li>
              <li><Link href="/category/women" className="hover:text-foreground">Women</Link></li>
              <li><Link href="/category/men" className="hover:text-foreground">Men</Link></li>
              <li><Link href="/category/accessories" className="hover:text-foreground">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
              <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
              <li><Link href="/shipping" className="hover:text-foreground">Shipping</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Instagram</a></li>
              <li><a href="#" className="hover:text-foreground">Twitter</a></li>
              <li><a href="#" className="hover:text-foreground">Facebook</a></li>
              <li><a href="#" className="hover:text-foreground">Pinterest</a></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 ACME Store. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
