import Image from "next/image"
import { Button } from "@/components/ui/button"

export function BannerGrid() {
  return (
    <section className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large Banner */}
        <div className="md:col-span-2 relative aspect-[2/1] bg-zinc-100 rounded-lg overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200"
            alt="Big Sale"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
              Season End Sale
            </h3>
            <p className="text-white text-lg mb-6 drop-shadow-md max-w-md">
              Up to 50% off on selected items. Don't miss out on these deals.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 border-none">
              Shop Sale
            </Button>
          </div>
        </div>

        {/* Side Banners */}
        <div className="flex flex-col gap-4">
          <div className="relative flex-1 bg-zinc-100 rounded-lg overflow-hidden group min-h-[200px]">
            <Image
              src="https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&q=80&w=600"
              alt="New Arrivals"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
              <h4 className="text-2xl font-bold text-white drop-shadow-md mb-2">
                New Arrivals
              </h4>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                Check It Out
              </Button>
            </div>
          </div>
          <div className="relative flex-1 bg-zinc-100 rounded-lg overflow-hidden group min-h-[200px]">
            <Image
              src="https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=600"
              alt="Electronics"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
              <h4 className="text-2xl font-bold text-white drop-shadow-md mb-2">
                Tech Deals
              </h4>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                Shop Gadgets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
