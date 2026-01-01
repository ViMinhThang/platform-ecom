"use client";

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ShoppingCart, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/UserNav"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchCart } from "@/lib/store/slices/cartSlice"

export const SiteHeader = () => {

  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { cart } = useAppSelector((state) => state.cart);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      dispatch(fetchCart());
    }
  }, [dispatch, session]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex h-20 items-center px-4 md:px-8 gap-8">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-black text-3xl tracking-tighter uppercase text-primary-foreground">
              ACME
            </span>
          </Link>
        </div>

        {/* Big Search Bar Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-2xl group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40 group-focus-within:text-primary transition-colors z-10 cursor-pointer"
              onClick={handleSearch}
            />
            <Input
              placeholder="Bạn đang tìm kiếm sản phẩm nào?"
              className="pl-12 w-full bg-white text-zinc-900 border-none rounded-none h-12 text-sm font-medium transition-all shadow-inner focus-visible:ring-offset-0 focus-visible:ring-white placeholder:text-zinc-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Mobile Menu & Nav Section */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center space-x-4">
            <UserNav />
            <Link href="/cart" className="relative p-2.5 rounded-none group hover:bg-white/10 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-none p-0 flex items-center justify-center text-[10px] font-black bg-white text-primary border-2 border-primary">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Giỏ hàng</span>
            </Link>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-2 text-base md:hidden text-primary-foreground hover:bg-white/10"
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
                <div className="flex flex-col space-y-6 text-sm font-black uppercase tracking-widest text-zinc-900">
                  <Link href="/products">Sản phẩm</Link>
                  <Link href="/categories">Danh mục</Link>
                  <Link href="/about">Giới thiệu</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
