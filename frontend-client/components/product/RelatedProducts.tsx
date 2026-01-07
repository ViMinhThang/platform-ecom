'use client';

interface RelatedProductsProps {
    productId: number;
}

export const RelatedProducts = ({ productId }: RelatedProductsProps) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col items-center justify-center gap-3 py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Đang tìm kiếm sản phẩm liên quan...</p>
                <div className="h-1 w-32 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF4F00]/30 w-1/3 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};
