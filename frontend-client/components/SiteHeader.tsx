'use client';

import Link from "next/link"
import { Search, ShoppingCart, Menu } from "lucide-react"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/UserNav"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchCart } from "@/lib/store/slices/cartSlice"

export function SiteHeader() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { cart } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (session?.accessToken) {
      dispatch(fetchCart());
    }
  }, [dispatch, session]);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight group-hover:text-primary transition-colors">
              ACME Store
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {[
              { label: "Sản phẩm", href: "/products" },
              { label: "Khuyến mãi", href: "/deals" },
              { label: "Danh mục", href: "/categories" }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative transition-colors hover:text-primary text-foreground/80 py-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold">ACME Store</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <Link href="/products">Sản phẩm</Link>
                <Link href="/categories">Danh mục</Link>
                <Link href="/about">Giới thiệu</Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative group">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-8 md:w-[300px] lg:w-[300px] bg-muted/50 focus:bg-background transition-all duration-300 border-transparent focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <UserNav />
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-full transition-colors group">
              <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground animate-in zoom-in spin-in-180 duration-300">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Giỏ hàng</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
