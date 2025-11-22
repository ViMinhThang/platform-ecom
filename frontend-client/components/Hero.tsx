import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative flex items-center h-[400px] w-full bg-zinc-900 text-white overflow-hidden rounded-lg">
      <div className="absolute inset-0">
         <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
         {/* Placeholder for a real hero image */}
         <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
      </div>

      <div className="relative z-20 px-8 md:px-12 flex flex-col items-start max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
          Everything You Need, <br />
          <span className="text-blue-400">Delivered Fast.</span>
        </h1>
        <p className="text-lg text-zinc-200 mb-8">
          Shop millions of products across tech, home, fashion, and more.
        </p>
        <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 border-none">
          Start Shopping
        </Button>
      </div>
    </section>
  )
}
