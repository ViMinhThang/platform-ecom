import Image from "next/image"
import Link from "next/link"

const CATEGORIES = [
  {
    name: "Electronics",
    href: "/category/electronics",
    image: "https://images.unsplash.com/photo-1498049381929-c518538d4bc2?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Fashion",
    href: "/category/fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Home & Garden",
    href: "/category/home",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Sports",
    href: "/category/sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Beauty",
    href: "/category/beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Toys & Hobbies",
    href: "/category/toys",
    image: "https://images.unsplash.com/photo-1566576912902-48f532515614?auto=format&fit=crop&q=80&w=800",
  },
]

export function Categories() {
  return (
    <section className="container py-16 bg-zinc-50 dark:bg-zinc-900/50">
      <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg font-bold text-white drop-shadow-md text-center px-2">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
