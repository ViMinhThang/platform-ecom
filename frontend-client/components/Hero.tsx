import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex items-center h-[550px] w-full bg-zinc-900 text-white overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-gradient-to-r from-black/80 to-transparent z-10" />
        {/* Placeholder for a real hero image */}
        <div className="w-full h-full bg-center">
          <Image src="/hero.jpg" alt="Hero" fill className="object-cover" />
        </div>
      </div>

      <div className="relative z-20 px-8 md:px-12 flex flex-col items-start max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
          Everything You Need, <br />
          <span className="text-blue-400">Delivered Fast.</span>
        </h1>
        <p className="text-lg text-zinc-200 mb-8">
          Shop millions of products across tech, home, fashion, and more.
        </p>
        <Button
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 border-none"
        >
          Start Shopping
        </Button>
      </div>
    </section>
  );
}
