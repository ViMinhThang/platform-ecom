'use client';

import { useState, useRef, useEffect } from "react";
import { RichTextPreview } from "@/components/RichTextPreview";
import { ProductDetail } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailedDescriptionProps {
    product: ProductDetail;
}

const MAX_COLLAPSED_HEIGHT = 800;

export const ProductDetailedDescription = ({ product }: ProductDetailedDescriptionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkHeight = () => {
            if (contentRef.current) {
                setShouldShowButton(contentRef.current.scrollHeight > MAX_COLLAPSED_HEIGHT);
            }
        };
        checkHeight();
        // Re-check after a short delay to ensure images/content are rendered
        const timer = setTimeout(checkHeight, 500);
        return () => clearTimeout(timer);
    }, [product.description]);

    return (
        <section className="space-y-8">
            <h2 className="text-[11px] font-semibold flex items-center gap-3 uppercase tracking-[0.2em] text-foreground">
                <span className="bg-primary/10 text-primary px-2 py-0.5 text-[9px]">02</span>
                MÔ TẢ CHI TIẾT
            </h2>

            <div className="relative">
                <div
                    ref={contentRef}
                    className={cn(
                        "prose prose-zinc max-w-none overflow-hidden transition-[max-height] duration-500 ease-in-out font-medium text-sm leading-relaxed",
                        !isExpanded && shouldShowButton ? "max-h-[600px]" : "max-h-[10000px]"
                    )}
                >
                    <RichTextPreview
                        content={product.description || "<p className='text-muted-foreground italic font-header uppercase tracking-widest text-[9px] opacity-50'>DỮ LIỆU MÔ TẢ TRỐNG</p>"}
                    />
                </div>

                {!isExpanded && shouldShowButton && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none z-10" />
                )}
            </div>

            {shouldShowButton && (
                <div className="flex justify-center mt-8">
                    <Button
                        variant="outline"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="rounded-sm border border-border bg-background font-bold uppercase tracking-widest px-10 hover:border-primary hover:text-primary transition-all h-11 text-[9px] shadow-sm"
                    >
                        {isExpanded ? (
                            <> THU GỌN <ChevronUp className="ml-2 size-3" /> </>
                        ) : (
                            <> XEM THÊM <ChevronDown className="ml-2 size-3" /> </>
                        )}
                    </Button>
                </div>
            )}
        </section>
    );
};
