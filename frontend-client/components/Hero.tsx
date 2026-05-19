"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

const HERO_SLIDES = [
  {
    image: "/hero.jpg",
    title: "Nâng tầm phong cách",
    subtitle: "Bộ sưu tập mới nhất đã sẵn sàng để cùng bạn tỏa sáng.",
    badge: "New Arrival",
    buttonText: "Khám phá ngay",
  },
  {
    image: "/banner-2.jpg",
    title: "Công nghệ đỉnh cao",
    subtitle: "Trải nghiệm những thiết bị hiện đại nhất cho cuộc sống thông minh.",
    badge: "Tech Trend",
    buttonText: "Xem chi tiết",
  },
  {
    image: "/banner-3.jpg",
    title: "Không gian sống lý tưởng",
    subtitle: "Mang lại sự tiện nghi và sang trọng cho ngôi nhà của bạn.",
    badge: "Home Style",
    buttonText: "Mua sắm ngay",
  },
];

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="m-0">
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="p-0">
              <div className="relative h-[500px] md:h-[650px] w-full overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 bg-slate-900">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover opacity-60"
                    priority={index === 0}
                  />
                  {/* Gradients for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950 to-transparent z-10 opacity-60" />
                </div>

                {/* Content */}
                <div className="relative z-20 container mx-auto h-full px-6 flex flex-col justify-center items-start">
                  <div className="max-w-3xl animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-sm bg-primary/20 border border-primary/30 shadow-sm">
                      <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                        {slide.badge}
                      </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-none">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? "text-primary" : ""}>
                          {word}{' '}
                        </span>
                      ))}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-lg leading-relaxed font-medium">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Button
                        size="lg"
                        className="h-14 px-10 text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all shadow-xl shadow-primary/20"
                      >
                        {slide.buttonText}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-10 text-[11px] font-bold uppercase tracking-[0.2em] border-white/30 text-white rounded-sm bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                      >
                        Xem ưu đãi
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation - hidden on small screens */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary h-12 w-12 rounded-sm transition-all" />
          <CarouselNext className="right-8 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary h-12 w-12 rounded-sm transition-all" />
        </div>

        {/* Custom Progress/Indicators could go here */}
      </Carousel>
    </section>
  );
}
