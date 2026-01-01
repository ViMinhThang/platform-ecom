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
        <section className="p-0">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-muted-foreground/80 border-b pb-6">
                Mô tả sản phẩm
            </h2>

            <div className="relative">
                <div
                    ref={contentRef}
                    className={cn(
                        "prose prose-lg max-w-none overflow-hidden transition-[max-height] duration-500 ease-in-out",
                        !isExpanded && shouldShowButton ? "max-h-[800px]" : "max-h-[10000px]"
                    )}
                >
                    <RichTextPreview
                        content={product.description || "<p className='text-muted-foreground italic text-lg'>Chưa có mô tả cho sản phẩm này.</p>"}
                    />
                </div>

                {!isExpanded && shouldShowButton && (
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
                )}
            </div>

            {shouldShowButton && (
                <div className="flex justify-center mt-12 relative z-20">
                    <Button
                        variant="outline"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="rounded-none border-2 border-slate-900 font-black uppercase tracking-[0.2em] px-12 hover:bg-slate-900 hover:text-white transition-all h-14 text-xs"
                    >
                        {isExpanded ? (
                            <> Thu Gọn <ChevronUp className="ml-3 w-4 h-4" /> </>
                        ) : (
                            <> Xem Thêm <ChevronDown className="ml-3 w-4 h-4" /> </>
                        )}
                    </Button>
                </div>
            )}
        </section>
    );
};
