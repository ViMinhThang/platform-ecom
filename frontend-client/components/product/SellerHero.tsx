'use client';

import { Store, MessageCircle, ShoppingBag, Calendar, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const VI_NUMBER_FORMAT = new Intl.NumberFormat("vi-VN");
import { SellerInfo } from "@/lib/services/user-service";
import { imageUrl } from "@/lib/utils/imageUrl";
import { formatOrderDate } from "@/lib/utils/dateUtils";

interface SellerHeroProps {
    seller: SellerInfo;
    totalProducts: number;
    totalSold?: number;
    createdAt?: string;
}

export function SellerHero({ seller, totalProducts, totalSold = 0, createdAt }: SellerHeroProps) {
    return (
        <div className="bg-white border shadow-sm p-8 md:p-12 mb-12">
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
                {/* Profile Avatar */}
                <div className="relative size-32 md:size-40 rounded-full overflow-hidden border-4 border-zinc-100 shadow-inner flex-shrink-0">
                    {seller.imageUrl ? (
                        <Image
                            src={imageUrl.avatar(seller.imageUrl)}
                            alt={seller.username}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-400 text-4xl font-bold font-header">
                            {seller.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Seller Info */}
                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                            <h1 className="text-3xl md:text-4xl font-semibold font-header tracking-tight text-zinc-900">
                                {seller.username}
                            </h1>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                    Yêu thích
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 font-medium justify-center md:justify-start">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-4" />
                                <span>Thành phố Hồ Chí Minh</span>
                            </div>
                            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />
                            <div className="flex items-center gap-1.5">
                                <Calendar className="size-4" />
                                <span>Tham gia {formatOrderDate(createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-zinc-100">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-header">Đánh giá</p>
                            <div className="flex items-center gap-1 justify-center md:justify-start">
                                <span className="font-bold text-lg font-header">4.9</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={"star-" + i} className="size-3 fill-primary text-primary" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-header">Sản phẩm</p>
                            <p className="font-bold text-lg font-header">{totalProducts}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-header">Đã bán</p>
                            <p className="font-bold text-lg font-header">
                                {VI_NUMBER_FORMAT.format(totalSold)}+
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-header">Phản hồi trò chuyện</p>
                            <p className="font-bold text-lg font-header">98%</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                        <Button className="gap-2 font-bold px-8 h-12 uppercase tracking-widest text-xs">
                            <MessageCircle className="size-4" />
                            Trò chuyện ngay
                        </Button>
                        <Button variant="outline" className="gap-2 font-bold px-8 h-12 uppercase tracking-widest text-xs border-2">
                            <Store className="size-4" />
                            Theo dõi
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
