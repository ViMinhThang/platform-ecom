import React from "react";
import { cn } from "@/lib/utils";
import { ProductSummary } from "@/types/chatbot";
import { Star, ShoppingCart, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
    products?: ProductSummary[];
    timestamp: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
    role,
    content,
    products,
}) => {
    const isAssistant = role === "assistant";

    // Simple markdown-to-html like formatter for bold and bullet points
    const formatContent = (text: string) => {
        return text.split('\n').map((line, i) => {
            // Bold
            let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Lists
            if (formattedLine.startsWith('* ') || formattedLine.startsWith('- ')) {
                return <li key={i} dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} className="ml-4 list-disc" />;
            }
            return <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} className={line ? "mb-2" : "h-2"} />;
        });
    };

    return (
        <div
            className={cn(
                "flex w-full mb-4",
                isAssistant ? "justify-start" : "justify-end"
            )}
        >
            <div
                className={cn(
                    "max-w-[85%] rounded-none p-3 shadow-sm",
                    isAssistant
                        ? "bg-white text-slate-800 border border-slate-100"
                        : "bg-primary text-primary-foreground"
                )}
            >
                <div className="text-sm leading-relaxed">
                    {formatContent(content)}
                </div>

                {isAssistant && products && products.length > 0 && (
                    <div className="mt-4 space-y-3 pt-3 border-t border-slate-50">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Sản phẩm đề xuất:
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex flex-col p-2 bg-slate-50 rounded-none border border-slate-100 hover:border-primary/30 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h4>
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-white">
                                            {Math.round(product.similarityScore * 100)}%
                                        </Badge>
                                    </div>

                                    <div className="flex gap-3 mt-1">
                                        {product.imageUrl && (
                                            <div className="relative w-16 h-16 shrink-0 border border-slate-100 bg-white">
                                                <Image 
                                                    src={"http://localhost:8080/uploads/" + product.imageUrl} 
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover p-1"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-1 justify-between">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-primary">
                                                    {product.price?.toLocaleString('vi-VN')} VNĐ
                                                </span>
                                                <div className="flex items-center text-[10px] text-orange-500 bg-orange-50 px-1 rounded-none">
                                                    <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                                                    {product.averageRating?.toFixed(1) || "0.0"}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button asChild size="sm" variant="outline" className="h-7 text-[10px] flex-1 bg-white rounded-none">
                                                    <Link href={`/products/${product.slug}`}>
                                                        Chi tiết <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
