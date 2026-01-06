"use client";

import { CategorySidebar } from "@/components/CategorySidebar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React from "react";

const BANNERS = [
    { id: 1, image: "/hero.jpg", alt: "Big Sale" },
    { id: 2, image: "/banner-2.jpg", alt: "New Tech" },
    { id: 3, image: "/banner-3.jpg", alt: "Home Decor" },
];

export const HomeBanner = () => {
    const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

    return (
        <div className="container mx-auto px-4 mt-6">
            <div className="flex gap-2 h-[200px] md:h-[400px]">
                {/* Center: Main Carousel */}
                <div className="flex-[2] min-w-0 h-full relative group border-2 border-black">
                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full h-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                        opts={{ loop: true }}
                    >
                        <CarouselContent className="h-full ml-0">
                            {BANNERS.map((banner) => (
                                <CarouselItem key={banner.id} className="pl-0 h-full">
                                    <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-700">
                                        <Image
                                            src={banner.image}
                                            alt={banner.alt}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 bg-black text-white border-white/20 opacity-0 group-hover:opacity-100 transition-all" />
                        <CarouselNext className="right-4 bg-black text-white border-white/20 opacity-0 group-hover:opacity-100 transition-all" />
                    </Carousel>
                </div>

                {/* Right: Stacked Banners (Hidden on tablet/mobile) */}
                <div className="hidden xl:flex flex-1 flex-col gap-2 h-full">
                    <div className="relative flex-1 w-full bg-black border-2 border-black group overflow-hidden">
                        <Image src="/banner-2.jpg" alt="Promo 1" fill className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="relative flex-1 w-full bg-black border-2 border-black group overflow-hidden">
                        <Image src="/banner-3.jpg" alt="Promo 2" fill className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        </div>
    );
};
