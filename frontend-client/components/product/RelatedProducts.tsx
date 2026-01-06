'use client';

interface RelatedProductsProps {
    productId: number;
}

export const RelatedProducts = ({ productId }: RelatedProductsProps) => {
    return (
        <div className="pt-12 border-t-2 border-black">
            <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-[0.2em] text-black mb-6">
                <span className="bg-black text-white px-2 py-0.5 text-xs">05</span>
                CÁC THÀNH PHẦN LIÊN QUAN // RELATED_COMPONENTS
            </h2>
            <div className="bg-zinc-100 border-2 border-dashed border-black/20 p-20 flex flex-col items-center justify-center gap-4">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">ĐANG QUÉT CÁC SẢN PHẨM TƯƠNG ĐỒNG...</p>
                <div className="h-0.5 w-48 bg-black/5 overflow-hidden">
                    <div className="h-full bg-black/20 w-1/3 animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
        </div>
    );
};
