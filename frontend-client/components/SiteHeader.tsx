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
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <span className="hidden font-black sm:inline-block text-2xl tracking-tighter uppercase text-primary-foreground">
              ACME
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.2em]">
            {[
              { label: "Sản phẩm", href: "/products" },
              { label: "Khuyến mãi", href: "/deals" },
              { label: "Danh mục", href: "/categories" }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-white/80 text-primary-foreground/90 py-1"
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
              className="mr-2 px-0 text-base md:hidden text-primary-foreground hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 border-r-4 border-primary">
            <Link href="/" className="flex items-center mb-10">
              <span className="font-black text-2xl tracking-tighter uppercase text-primary">ACME</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-2">
              <div className="flex flex-col space-y-6 text-sm font-black uppercase tracking-widest">
                <Link href="/products">Sản phẩm</Link>
                <Link href="/categories">Danh mục</Link>
                <Link href="/about">Giới thiệu</Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
              <Input
                placeholder="Tìm sản phẩm..."
                className="pl-10 md:w-[250px] lg:w-[350px] bg-white/10 focus:bg-white/20 border-white/20 focus:border-white/40 text-primary-foreground placeholder:text-primary-foreground/50 rounded-none h-10 text-xs font-medium transition-all"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-3">
            <UserNav />
            <Link href="/cart" className="relative p-2.5 rounded-none group hover:bg-white/10 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-0 -top-0 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-white text-primary border-2 border-primary">
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
