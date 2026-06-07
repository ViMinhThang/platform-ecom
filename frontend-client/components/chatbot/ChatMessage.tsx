"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ProductSummary } from "@/types/chatbot";
import { Star, ExternalLink, Search, Phone, Mail, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
    products?: ProductSummary[];
    showSupportInfo?: boolean;
    timestamp: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
    role,
    content,
    products,
    showSupportInfo,
}) => {
    const isAssistant = role === "assistant";

    const formatContent = (text: string) => {
        return text.split('\n').map((line, i) => {
            let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            if (formattedLine.startsWith('* ') || formattedLine.startsWith('- ')) {
                // eslint-disable-next-line react/no-danger
                return <li key={"line-" + i} dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} className="ml-6 list-disc text-foreground/70" />;
            }
            // eslint-disable-next-line react/no-danger
            return <p key={"line-" + i} dangerouslySetInnerHTML={{ __html: formattedLine }} className={line ? "mb-4 leading-relaxed" : "h-4"} />;
        });
    };

    return (
        <div
            className={cn(
                "flex w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-500",
                isAssistant ? "justify-start" : "justify-end"
            )}
        >
            <div
                className={cn(
                    "max-w-[90%] p-6 shadow-sm border font-labels",
                    isAssistant
                        ? "bg-white text-foreground/80 border-foreground/5 rounded-[4px] rounded-tl-none font-medium"
                        : "bg-primary text-white border-primary/20 rounded-[4px] rounded-tr-none font-bold uppercase tracking-widest text-[10px]"
                )}
            >
                <div className="text-[12px]">
                    {formatContent(content)}
                </div>

                {isAssistant && products && products.length > 0 && (
                    <div className="mt-8 space-y-4 pt-6 border-t border-foreground/5">
                        <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.3em]">
                            HỒ SƠ ĐỀ XUẤT HỆ THỐNG:
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="flex flex-col p-4 bg-secondary/2 border border-foreground/5 rounded-[2px] hover:border-primary/20 hover:bg-white transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-[10px] font-semibold text-foreground/70 uppercase tracking-widest line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h4>
                                        <div className="px-2 py-0.5 bg-primary text-white text-[8px] font-bold tracking-widest rounded-[2px]">
                                            ĐỘ TƯƠNG THÍCH: {Math.round(product.similarityScore * 100)}%
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        {product.imageUrl && (
                                            <div className="relative size-20 shrink-0 border border-foreground/5 bg-white p-2 rounded-[2px]">
                                                <Image 
                                                    src={"http://localhost:8080/uploads/" + product.imageUrl} 
                                                    alt={product.name}
                                                    fill
                                                    sizes="32px"
                                                    className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-1 justify-between">
                                            <div className="space-y-2">
                                                <div className="text-[14px] font-bold text-primary tracking-tighter">
                                                    {product.price?.toLocaleString('vi-VN')} VNĐ
                                                </div>
                                                <div className="flex items-center text-[9px] font-bold text-foreground/30 tracking-widest bg-foreground/2 px-2 py-0.5 rounded-[1px] w-fit">
                                                    <Star className="size-2.5 fill-orange-400 text-orange-400 mr-1.5" />
                                                    {product.averageRating?.toFixed(1) || "0.0"}
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.3em] text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    TRUY XUẤT HỒ SƠ <ArrowRight className="size-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Support Info Card */}
                {isAssistant && showSupportInfo && (
                    <div className="mt-8 pt-6 border-t border-foreground/5">
                        <div className="bg-white border border-primary/20 p-5 space-y-4 rounded-[4px]">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="size-4 text-primary" />
                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                                    PHÂN HỆ HỖ TRỢ TRUY XUẤT
                                </p>
                            </div>

                            <div className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-foreground/40 leading-relaxed font-labels">
                                <div className="flex items-start gap-4 p-2 hover:bg-primary/2 rounded-[2px] transition-colors">
                                    <Search className="size-4 mt-0.5 shrink-0 text-primary/30" />
                                    <span>TRUY VẤN VỚI DANH MỤC THAY THẾ HOẶC <Link href="/products" className="text-primary hover:underline hover:underline-offset-4">LIỆT KÊ TỔNG THỂ</Link></span>
                                </div>
                                <div className="flex items-start gap-4 p-2 hover:bg-primary/2 rounded-[2px] transition-colors">
                                    <Phone className="size-4 mt-0.5 shrink-0 text-primary/30" />
                                    <span>TỔNG ĐÀI ĐIỀU PHỐI GIÁM TUYỂN: <span className="text-foreground/60">1900-xxxx</span> (08:00 - 22:00)</span>
                                </div>
                                <div className="flex items-start gap-4 p-2 hover:bg-primary/2 rounded-[2px] transition-colors">
                                    <Mail className="size-4 mt-0.5 shrink-0 text-primary/30" />
                                    <span>THƯ TÍN ĐIỆN TỬ: <a href="mailto:support@acme-ecom.vn" className="text-primary hover:underline hover:underline-offset-4">SUPPORT@ACME-ECOM.VN</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
