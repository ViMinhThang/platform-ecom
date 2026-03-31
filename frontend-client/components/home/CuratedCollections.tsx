"use client";

import Image from "next/image";
import Link from "next/link";

const COLLECTIONS = [
    {
        title: "Lưu trữ Silicon",
        subtitle: "Công cụ thế hệ mới cho học giả hiện đại.",
        image: "/banner-grid-1.avif",
        href: "/category/electronics",
        className: "md:col-span-2 md:row-span-2 min-h-[400px]",
    },
    {
        title: "Trang phục thủ công",
        subtitle: "Lịch sử dệt may thịnh vượng.",
        image: "/banner-2.png",
        href: "/category/apparel",
        className: "md:col-span-2 md:row-span-1 min-h-[200px]",
    },
    {
        title: "Văn học quý hiếm",
        subtitle: "Tuyển tập những bản thảo cổ điển.",
        image: "/banner-3.png",
        href: "/category/literature",
        className: "md:col-span-1 md:row-span-1 min-h-[200px]",
    },
        {
        title: "Vasdasdsam",
        subtitle: "Tuyển tập những bản thảo cổ điển.",
        image: "/banner-4.png",
        href: "/category/literature",
        className: "md:col-span-1 md:row-span-1 min-h-[200px]",
    },

];

export const CuratedCollections = () => {
    return (
        <section className="w-[1600px] mx-auto ">
            <div className="flex items-end justify-between mb-12">
                <div className="space-y-4">
                    <h2 className="font-labels text-4xl font-bold tracking-tight text-foreground uppercase">Bộ sưu tập tuyển chọn</h2>
                    <p className="font-labels text-foreground/40 text-sm">Được tuyển chọn bởi các giám tuyển tài ba</p>
                </div>
                <Link href="/category/collections" className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-1 hover:text-primary hover:border-primary transition-all">
                    Xem tất cả bộ sưu tập
                </Link>
            </div>

            {/* CURATED GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-[700px]">
                {COLLECTIONS.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={`group relative overflow-hidden rounded-[4px] shadow-sm ${item.className}`}
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
};
